import { Category } from "./Category.interface";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: [string];
  category?: Category;
}
