export interface Category {
  id: string;
  name: string;
  parent?: Category;
  properties: any[];
}
