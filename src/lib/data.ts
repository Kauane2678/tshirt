export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  team: string;
  sizes: string[];
  badge?: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  soldCount: number;
};

// Importa o catálogo gerado pelo script sync-products
// Para atualizar: npm run sync-products
import { catalogProducts, catalogCategories, catalogTeams } from "./products-catalog";

export const products: Product[] = catalogProducts;
export const categories = catalogCategories as unknown as string[];
export const teams      = catalogTeams      as unknown as string[];
