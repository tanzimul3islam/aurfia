'use server';

import { getAllProducts } from '@/lib/product-helpers';

export type ProductWithImages = Awaited<ReturnType<typeof getAllProducts>>[number];

export async function fetchAllProducts(): Promise<ProductWithImages[]> {
  return getAllProducts();
}

export { getAllProducts };
