import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SizeChart from "@/components/category/SizeChart";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import type { ProductListItem } from "@/types/product";

export interface ProductBodyProps {
  product?: ProductListItem;
  title?: string;
  price?: number;
  image?: string;
  categoryId?: number;
  collectionId?: string | number;
  color?: string;
  sizes?: ("S" | "M" | "L")[];
  productId?: number;
  slug?: string;
  discount?: any;
}

export default function ProductBody({
  product,
  title = "Essential Tee",
  price = 499,
  image = "",
  categoryId,
  collectionId,
  color,
  sizes,
  productId,
  discount,
}: ProductBodyProps) {
  const resolvedId = product?._id ?? productId;
  const resolvedName = product?.name ?? title;
  const resolvedImage =
    product?.images?.[0] ?? product?.thumbnail ?? product?.image ?? image;
  const resolvedPrice = Math.max(0, product?.basePrice ?? price);
  const resolvedCategoryId = product?.category ?? categoryId;
  const resolvedCollectionId = product?.collection ?? collectionId;
  const resolvedColor = product?.color ?? color;
  const resolvedSizes = product?.sizes ?? sizes ?? [];
  const resolvedDiscount = product?.discount ?? discount;
  const discountPercent =
    typeof resolvedDiscount === "number"
      ? resolvedDiscount
      : resolvedDiscount && typeof resolvedDiscount === "object"
        ? (resolvedDiscount.percent ?? resolvedDiscount.amount ?? null)
        : null;
  const hasPercent =
    typeof discountPercent === "number" && !isNaN(discountPercent);
  const discountedPrice = hasPercent
    ? Math.max(
        0,
        Math.round((resolvedPrice * (100 - (discountPercent as number))) / 100),
      )
    : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("");
  const [featuredBundle, setFeaturedBundle] = useState<{
    id: string | number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (resolvedSizes.length > 0) {
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
        const response = await api.get(`/categories/${resolvedCategoryId}`, {
          headers: { "x-silent": "1" },
        });
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
        const response = await api.get(`/collections/${resolvedCollectionId}`, {
          headers: { "x-silent": "1" },
        });
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
        const response = await api.get(`/bundles`, {
          headers: { "x-silent": "1" },
        });
        const bundles = Array.isArray(response.data) ? response.data : [];
        const match = bundles.find((bundle: any) => {
          const ids = Array.isArray(bundle.productIds) ? bundle.productIds : [];
          return ids.some((id: any) => String(id) === String(resolvedId));
        });
        if (isMounted) {
          setFeaturedBundle(
            match ? { id: match._id ?? match.id, name: match.name } : null,
          );
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

  return (
    <>
      <div className="relative w-full pb-[100%]">
        <img
          src={resolvedImage}
          alt={resolvedName}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        {hasPercent && (
          <div className="absolute left-2 top-2">
            <Badge className="text-xs bg-red-600 text-white">
              {String(discountPercent)}% OFF
            </Badge>
          </div>
        )}
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

          {collectionName && (
            <Badge className="text-xs">{collectionName}</Badge>
          )}

          {categoryName && <Badge className="text-xs">{categoryName}</Badge>}
          {resolvedColor && (
            <div
              title={`Color: ${resolvedColor}`}
              aria-label={`Color: ${resolvedColor}`}
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: String(resolvedColor) }}
            />
          )}
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-1">
              {resolvedName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {hasPercent && discountedPrice != null ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">
                    EGP {String(discountedPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    EGP {resolvedPrice.toFixed(0)}
                  </span>
                </div>
              ) : (
                <span>EGP {resolvedPrice.toFixed(0)}</span>
              )}
            </div>
          </div>
        </div>

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
}
