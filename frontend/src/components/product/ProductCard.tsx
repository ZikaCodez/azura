import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SizeChart from "@/components/category/SizeChart";

import api from "@/lib/api";
import {
  calculateDiscountedPrice,
  getDiscountLabel,
  isDiscountValid,
} from "@/lib/discounts";

import { useCart } from "@/providers/CartProvider";
import { useColors } from "@/hooks/useColors";

import type { Discount } from "@/types/offer";
import type { ProductListItem } from "@/types/product";

type BundleLike = {
  id: string | number;
  name: string;
  productIds: unknown;
};

type CollectionLike = {
  id?: string | number;
  name?: string;
};

type CategoryLike = {
  _id?: number;
  id?: number;
  name?: string;
};

export interface ProductCardProps {
  product?: ProductListItem;
  title?: string;
  price?: number;
  image?: string;
  categoryId?: number;
  collectionId?: string | number;
  color?: string;
  sizes?: ("S" | "M" | "L")[];
  onQuickAdd?: () => void;
  productId?: number;
  sku?: string;
  loading?: boolean;
  basePrice?: number;
  slug?: string;
  discount?: Discount;
}

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

function getColorStyles(hex?: string): {
  backgroundColor: string;
  borderColor: string;
} {
  if (!hex) return { backgroundColor: "#e5e7eb", borderColor: "#9ca3af" };
  const h = hex.replace(/^#/, "");
  if (h.length !== 6)
    return { backgroundColor: "#e5e7eb", borderColor: "#9ca3af" };

  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return {
    backgroundColor: `#${h}`,
    borderColor: luminance > 180 ? "#9ca3af" : "#ffffff",
  };
}

export default function ProductCard({
  product,
  title = "Essential Tee",
  price = 499,
  image = "https://placehold.co/800/white/000000?text=Azura&font=roboto",
  categoryId,
  collectionId,
  color,
  sizes,
  onQuickAdd,
  productId,
  sku,
  loading = false,
  basePrice,
  slug,
  discount,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { colorsMap } = useColors();

  const resolvedId = product?._id ?? productId;
  const resolvedName = product?.name ?? title;
  const resolvedSlug = product?.slug ?? slug;
  const resolvedImage =
    product?.images?.[0] ?? product?.thumbnail ?? product?.image ?? image;
  const resolvedPrice = Math.max(0, product?.basePrice ?? basePrice ?? price);
  const resolvedCategoryId = product?.category ?? categoryId;
  const resolvedCollectionId = product?.collection ?? collectionId;
  const resolvedColor = product?.color ?? color;
  const resolvedSizes = product?.sizes ?? sizes ?? [];
  const resolvedDiscount = product?.discount ?? discount;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("");
  const [featuredBundle, setFeaturedBundle] = useState<{
    id: string | number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (resolvedSizes.length > 0) {
      // Always default to the first size when sizes are present
      setSelectedSize(resolvedSizes[0]);
    }
  }, [resolvedSizes]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      try {
        if (resolvedCategoryId == null) {
          if (isMounted) setCategoryName("");
          return;
        }

        const response = await api.get<CategoryLike>(
          `/categories/${resolvedCategoryId}`,
          {
            headers: { "x-silent": "1" },
          },
        );

        if (isMounted) setCategoryName(response.data?.name ?? "");
      } catch {
        if (isMounted) setCategoryName("");
      }
    }

    loadCategory();
    return () => {
      isMounted = false;
    };
  }, [resolvedCategoryId]);

  useEffect(() => {
    let isMounted = true;

    async function loadCollection() {
      try {
        if (resolvedCollectionId == null || resolvedCollectionId === "") {
          if (isMounted) setCollectionName("");
          return;
        }

        const response = await api.get<CollectionLike>(
          `/collections/${resolvedCollectionId}`,
          {
            headers: { "x-silent": "1" },
          },
        );

        if (isMounted) setCollectionName(response.data?.name ?? "");
      } catch {
        if (isMounted) setCollectionName("");
      }
    }

    loadCollection();
    return () => {
      isMounted = false;
    };
  }, [resolvedCollectionId]);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedBundle() {
      try {
        if (resolvedId == null) {
          if (isMounted) setFeaturedBundle(null);
          return;
        }

        const response = await api.get<BundleLike[]>("/bundles", {
          headers: { "x-silent": "1" },
        });

        const bundles = Array.isArray(response.data) ? response.data : [];
        const match = bundles.find((bundle) => {
          const ids = parseProductIds(bundle.productIds);
          return ids.some((id) => String(id) === String(resolvedId));
        });

        if (isMounted) {
          setFeaturedBundle(match ? { id: match.id, name: match.name } : null);
        }
      } catch {
        if (isMounted) setFeaturedBundle(null);
      }
    }

    loadFeaturedBundle();
    return () => {
      isMounted = false;
    };
  }, [resolvedId]);

  const hasDiscount = isDiscountValid(resolvedDiscount);
  const finalPrice = calculateDiscountedPrice(resolvedPrice, resolvedDiscount);
  const discountLabel = getDiscountLabel(resolvedDiscount);

  const colorHex = resolvedColor
    ? colorsMap[resolvedColor.toLowerCase()]
    : undefined;
  const colorStyles = useMemo(() => getColorStyles(colorHex), [colorHex]);

  const handleAddToCart = () => {
    if (resolvedId == null) {
      onQuickAdd?.();
      return false;
    }

    if (resolvedSizes.length > 0 && !selectedSize) {
      toast.error("Select a size", { position: "bottom-left" });
      return false;
    }

    const effectiveSku =
      sku ||
      [resolvedSlug || "product", selectedSize || "std"]
        .join("-")
        .toLowerCase();

    addToCart({
      productId: resolvedId,
      sku: effectiveSku,
      name: resolvedName,
      quantity: 1,
      priceAtPurchase: finalPrice,
      originalPrice: resolvedPrice,
      image: resolvedImage,
      color: resolvedColor,
      size: selectedSize || undefined,
    });

    toast.success("Added to cart", {
      description: selectedSize
        ? `${resolvedName} • ${selectedSize.toUpperCase()}`
        : resolvedName,
    });

    return true;
  };

  const handleBuyNow = () => {
    const added = handleAddToCart();
    if (added) navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="group relative bg-background border rounded-2xl overflow-hidden shadow-sm">
        <div className="relative w-full pb-[100%]">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </div>
        <div className="p-3">
          <Skeleton className="h-3 w-16" />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="mt-3 sm:hidden">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const CardBody = (
    <>
      <div className="relative w-full pb-[100%]">
        <img
          src={resolvedImage}
          alt={resolvedName}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          width={800}
          height={800}
          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 75vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-2">
        <div className="flex items-center gap-2 flex-wrap">
          {featuredBundle && (
            <Badge className="text-xs">
              <Link to={`/bundles/${featuredBundle.id}`} className="underline">
                {featuredBundle.name}
              </Link>
            </Badge>
          )}

          {collectionName && <Badge className="text-xs">{collectionName}</Badge>}

          {categoryName && <Badge className="text-xs">{categoryName}</Badge>}

          {resolvedColor && (
            <Badge className="text-xs flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-4 rounded-full border"
                style={colorStyles}
              />
              <span>{resolvedColor}</span>
            </Badge>
          )}
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-1">{resolvedName}</h3>
          </div>

          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <div className="hidden gap-2 md:flex md:items-center">
                  <span className="text-xs text-muted-foreground line-through">
                    EGP {resolvedPrice.toFixed(0)}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    EGP {finalPrice.toFixed(0)}
                  </span>
                  {discountLabel && (
                    <Badge
                      variant="destructive"
                      className="text-xs h-5 px-1.5 shrink-0">
                      {discountLabel}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 md:hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground line-through">
                      EGP {resolvedPrice.toFixed(0)}
                    </span>
                    {discountLabel && (
                      <Badge
                        variant="destructive"
                        className="text-xs h-4 px-1 shrink-0">
                        {discountLabel}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    EGP {finalPrice.toFixed(0)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm font-medium">
                EGP {resolvedPrice.toFixed(0)}
              </div>
            )}
          </div>
        </div>

        {/* color is shown as a badge above; keep this block for compatibility if needed */}

        {resolvedSizes.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1">Sizes:</span>
            {resolvedSizes.map((s) => {
              const isSelected = selectedSize === s;
              return (
                <button
                  key={`size-${s}`}
                  type="button"
                  aria-label={`Select size ${s}`}
                  onClick={() => setSelectedSize(s)}
                  className={`text-xs rounded-2xl border px-2 py-0.5 ${isSelected ? "ring-3 ring-foreground/30 bg-accent" : "ring-0"}`}>
                  {s}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-2">
          <SizeChart categoryId={resolvedCategoryId ?? undefined} />
        </div>

        {collectionName && (
          <div className="mt-2 text-xs text-muted-foreground">
            Collection: {collectionName}
          </div>
        )}

        {featuredBundle && (
          <div className="mt-2 text-xs text-muted-foreground">
            This product is featured in{" "}
            <Link to={`/bundles/${featuredBundle.id}`} className="underline">
              {featuredBundle.name}
            </Link>
          </div>
        )}

        </div>
    </>
  );

  function ClickableContent({ children }: { children: React.ReactNode }) {
    if (resolvedSlug) {
      return (
        <Link
          to={`/product/${resolvedSlug}`}
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
