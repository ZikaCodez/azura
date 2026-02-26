import { CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function ActionButtons({
  onAdd,
  onBuy,
  addLabel = "Add to cart",
  buyLabel = "Buy now",
}: {
  onAdd?: (e?: React.MouseEvent) => void;
  onBuy?: (e?: React.MouseEvent) => void;
  addLabel?: string;
  buyLabel?: string;
}) {
  return (
    <div className="mt-3 w-full grid grid-cols-2 gap-2 p-2">
      <Button
        variant="default"
        size="sm"
        className="rounded-full w-full"
        onClick={(e) => {
          e.stopPropagation();
          onAdd?.(e);
        }}
        aria-label="Add to cart">
        <ShoppingCart className="size-4" />
        <span className="ml-1">{addLabel}</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        className="rounded-full w-full"
        onClick={(e) => {
          e.stopPropagation();
          onBuy?.(e);
        }}
        aria-label="Buy now">
        <CreditCard className="size-4" />
        {buyLabel}
      </Button>
    </div>
  );
}
