export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  price: number;
  image: string;
  expire?: Date;
}
