import type { Discount } from "./offer";

export type ProductStatus = "active" | "inactive" | "archived";

export type ProductListItem = {
  _id: number;
  name: string;
  slug: string;
  basePrice: number;
  category?: number; // category id
  collection?: string | number;
  color?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  status?: ProductStatus;
  description?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  thumbnail?: string | null;
  images?: string[];
  image?: string | null;
  discount?: Discount;
  sizes?: ("S" | "M" | "L")[];
};
