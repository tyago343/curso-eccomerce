import { Category } from "../interfaces/Category.interface";

export function formatCategory(item: any): Category {
  return {
    id: item._id,
    name: item.name,
    ...(item.parent ? { parent: formatCategory(item.parent) } : {}),
  };
}
