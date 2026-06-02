'use server';

import { getAllProducts as getAllProductsFromDb } from '@/lib/product-helpers';

export async function getAllProducts() {
  const all = await getAllProductsFromDb();
  return all.map((p) => ({ id: p.id, name: p.name }));
}

export async function bulkUpdateProducts(ids: number[], action: string, value: string) {
  // product.db is read-only.
  return { error: 'Bulk editing is not supported on the read-only product source.' };
}
