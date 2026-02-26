import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import api from "@/lib/api";

import { useCart } from "@/providers/CartProvider";

import type { Discount } from "@/types/offer";
import type { ProductListItem } from "@/types/product";

type BundleLike = {
  id: string | number;
  name: string;
  productIds: unknown;
  discount?: Discount;
};

function parseProductIds(value: unknown): Array<string | number> {
  if (Array.isArray(value)) return value as Array<string | number>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as Array<string | number>;
    } catch {
      return [];
    }
  }
  return [];
}

export default function BundleCard({
  bundle,
  products: productsProp,
  loading = false,
}: {
  bundle: BundleLike;
  products?: ProductListItem[];
  loading?: boolean;
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ProductListItem[] | null>(
    productsProp ?? null,
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (productsProp) {
      setProducts(productsProp);
      setSelectedIndex(0);
      return;
    }

    let isMounted = true;
    async function loadProducts() {
      try {
        const ids = parseProductIds(bundle.productIds);
        if (!ids || ids.length === 0) {
          if (isMounted) setProducts([]);
          return;
        }
        const { data } = await api.get("/products", {
          params: {
            filter: JSON.stringify({ _id: ids }),
            limit: ids.length,
            _ts: Date.now(),
          },
          headers: { "x-silent": "1" },
        });
        const items = Array.isArray((data as any).items)
          ? (data as any).items
          : [];
        if (isMounted) setProducts(items as ProductListItem[]);
      } catch {
        if (isMounted) setProducts([]);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [bundle.productIds, productsProp]);

  const current =
    products && products.length > 0 ? products[selectedIndex] : null;

  const resolvedName = bundle.name || "Bundle";
  const resolvedId = (bundle as any)._id ?? (bundle as any).id;

  const resolvedPrice = useMemo(() => {
    // display price is bundle price if available otherwise fallback to current product
    if ((bundle as any).price) return Math.max(0, (bundle as any).price || 0);
    if (!current) return 0;
    return Math.max(0, current.basePrice ?? 0);
  }, [bundle, current]);
  const finalPrice = resolvedPrice;

  const handleAddToCart = () => {
    // Add the bundle as a single cart item (bundle-level purchase)
    if (!resolvedId) return false;

    const effectiveSku = `bundle-${String(resolvedId)}`;

    addToCart({
      productId: resolvedId as any,
      sku: effectiveSku,
      name: resolvedName,
      quantity: 1,
      priceAtPurchase: finalPrice,
      originalPrice: resolvedPrice,
      image: (bundle as any).image ?? current?.images?.[0] ?? current?.image,
      // attach bundle metadata so other parts can detect bundle items
      bundleId: resolvedId,
      bundleProducts: parseProductIds(bundle.productIds),
    } as any);

    toast.success("Added bundle to cart", { description: resolvedName });
    return true;
  };

  const handleBuyNow = () => {
    const added = handleAddToCart();
    if (added) navigate("/checkout");
  };

  if (loading || !products) {
    return (
      <div className="group relative bg-background border rounded-2xl overflow-hidden shadow-sm">
        <div className="relative w-full pb-[100%]">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </div>
        <div className="p-3">
          <Skeleton className="h-3 w-24" />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    );
  }

  const CardBody = (
    <>
      <div className="relative w-full pb-[100%]">
        <img
          src={
            current?.images?.[0] ?? current?.thumbnail ?? current?.image ?? ""
          }
          alt={current?.name ?? resolvedName}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="text-xs">{resolvedName}</Badge>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-1">
              {current?.name ?? "Item"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              EGP {resolvedPrice.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Product selector: acts like a size selector for bundle items */}
        {products && products.length > 1 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1">Items:</span>
            {products.map((p, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`bundle-item-${String(p._id ?? idx)}`}
                  type="button"
                  aria-label={`Show ${p.name}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`text-xs rounded-2xl border px-2 py-0.5 ${isSelected ? "ring-3 ring-foreground/30 bg-accent" : "ring-0"}`}>
                  {p.name}
                </button>
              );
            })}
          </div>
        )}

        {((bundle as any).description || current?.description) && (
          <div className="mt-2 text-xs text-muted-foreground">
            {(bundle as any).description ?? current?.description}
          </div>
        )}
      </div>
    </>
  );

  function ClickableContent({ children }: { children: React.ReactNode }) {
    if (resolvedId) {
      return (
        <Link
          to={`/bundles/${resolvedId}`}
          aria-label={`View ${resolvedName}`}
          className="block">
          {children}
        </Link>
      );
    }
    return <div>{children}</div>;
  }

  function ActionButtons() {
    return (
      <div className="mt-3 w-full grid grid-cols-2 gap-2 p-2">
        <Button
          variant="default"
          size="sm"
          className="rounded-full w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          aria-label="Add to cart">
          <ShoppingCart className="size-4" />
          <span className="ml-1">Add to cart</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="rounded-full w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleBuyNow();
          }}
          aria-label="Buy now">
          <CreditCard className="size-4" />
          Buy now
        </Button>
      </div>
    );
  }

  return (
    <div className="group relative bg-background border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <ClickableContent>{CardBody}</ClickableContent>
      <ActionButtons />
    </div>
  );
}
