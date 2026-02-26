export type Bundle = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  price: number;
  image: string;
  expire?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
