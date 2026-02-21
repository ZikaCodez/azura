import { IColor } from "./color";

export interface IDiscount {
  type: "percentage" | "fixed";
  value: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IProduct {
  _id?: number; // MongoDB ObjectId
  name: string;
  slug: string; // URL-friendly name
  description: string;
  basePrice: number;
  category: number; // Category id (number)
  tags: string[]; // e.g., ["summer", "minimal"]
  color: IColor["_id"]; // Single color
  image: string; // Main image
  isFeatured: boolean;
  isActive: boolean; // For "Soft Deletes"
  createdAt: Date;
  updatedAt: Date;
  discount?: IDiscount;
}
