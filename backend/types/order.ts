import { IAddress } from "./user";

export type OrderItemType = "product" | "bundle";

export interface IOrderItem {
  type: OrderItemType;
  productId?: number; // For product
  bundleId?: string; // For bundle
  name: string; // Snapshot of name
  quantity: number;
  priceAtPurchase: number;
  originalPrice?: number; // For bundle, sum of product prices
  image: string;
  color?: string;
}

export interface IOrder {
  _id?: number;
  userId: number;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: "COD" | "InstaPay";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "processing" // Customer placed order, still editable
    | "confirmed" // Merchant confirmed, preparing order
    | "shipped"
    | "delivered"
    | "cancelled"
    | "return-request"
    | "returned";
  subtotal: number;
  shippingFee: number;
  discountTotal?: number;
  promoCode?: string;
  originalTotal: number; // Sum of original prices (products/bundles)
  total: number;
  trackingNumber?: string;
  placedAt: Date;
  updatedAt?: Date;
}
