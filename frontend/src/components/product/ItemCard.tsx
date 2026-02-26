import ProductBody from "./ProductBody";
import BundleBody from "./BundleBody";
import ActionButtons from "./ActionButtons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/providers/CartProvider";
import type { ProductListItem } from "@/types/product";

export default function ItemCard({
  kind,
  product,
  bundle,
  className,
  products,
}: {
  kind: "product" | "bundle";
  product?: ProductListItem;
  bundle?: any;
  products?: ProductListItem[];
  className?: string;
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (kind === "product" && product) {
      const effectiveSku = `${product.slug || "product"}-std`;
      addToCart({
        productId: product._id,
        sku: effectiveSku,
        name: product.name,
        quantity: 1,
        priceAtPurchase: Math.max(0, product.basePrice || 0),
        originalPrice: product.basePrice || 0,
        image: product.images?.[0] ?? product.image,
        color: product.color,
        size: product.sizes?.[0],
      } as any);
      return;
    }
    if (kind === "bundle" && bundle) {
      const resolvedId = bundle._id ?? bundle.id;
      const effectiveSku = `bundle-${String(resolvedId)}`;
      addToCart({
        productId: resolvedId,
        sku: effectiveSku,
        name: bundle.name,
        quantity: 1,
        priceAtPurchase: Math.max(0, bundle.price || 0),
        originalPrice: Math.max(0, bundle.price || 0),
        image: bundle.image,
        bundleId: resolvedId,
        bundleProducts: Array.isArray(bundle.productIds)
          ? bundle.productIds
          : [],
      } as any);
      return;
    }
  };

  const handleBuy = () => {
    handleAdd();
    navigate("/checkout");
  };

  const Body = (
    <div className="flex-1">
      {kind === "product" ? (
        <ProductBody product={product} />
      ) : (
        <BundleBody bundle={bundle} products={products} />
      )}
    </div>
  );

  // Determine link target for clickable body
  const linkTo =
    kind === "product"
      ? `/product/${product?.slug ?? ""}`
      : `/bundles/${bundle?._id ?? bundle?.id ?? ""}`;

  return (
    <div
      className={`group relative bg-background border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${className || ""}`}>
      {product || bundle ? (
        <Link to={linkTo} className="block no-underline text-inherit">
          {Body}
        </Link>
      ) : (
        Body
      )}

      <div className="mt-auto">
        <ActionButtons onAdd={handleAdd} onBuy={handleBuy} />
      </div>
    </div>
  );
}
