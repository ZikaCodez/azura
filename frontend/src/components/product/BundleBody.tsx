import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import type { ProductListItem } from "@/types/product";

type BundleLike = {
  _id?: string | number;
  id?: string | number;
  name?: string;
  productIds?: unknown;
  description?: string;
  image?: string;
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

export default function BundleBody({
  bundle,
  products: productsProp,
}: {
  bundle: BundleLike;
  products?: ProductListItem[];
}) {
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

  const resolvedPrice = useMemo(() => {
    if ((bundle as any).price) return Math.max(0, (bundle as any).price || 0);
    if (!current) return 0;
    return Math.max(0, current.basePrice ?? 0);
  }, [bundle, current]);

  return (
    <>
      <div className="relative w-full pb-[100%]">
        <img
          src={
            current?.images?.[0] ??
            current?.thumbnail ??
            current?.image ??
            (bundle as any).image
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
}
