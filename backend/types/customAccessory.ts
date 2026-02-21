import { Component } from "./component";

export type CustomAccessoryStatus = "private" | "public" | "reviewing";

export interface CustomAccessory {
  id: string;
  userId: string;
  name: string;
  type: string; // e.g. bracelet, necklace
  structure: Component[]; // Array of components
  status: CustomAccessoryStatus;
  image: string;
  createdAt: Date;
  updatedAt?: Date;
}
