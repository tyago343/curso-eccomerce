import { Product } from "../interfaces/Product.interface";

export function formatProduct(item: any): Product {
  return {
    id: item._id,
    title: item.title,
    description: item.description,
    price: item.price,
    images: item.images,
  };
}
