import type { Component } from "./component";

export type CustomAccessoryStatus = "private" | "public" | "reviewing";

export type CustomAccessory = {
  id: string;
  userId: string;
  name: string;
  type: string; // e.g. bracelet, necklace
  structure: Component[];
  status: CustomAccessoryStatus;
  image: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
};
