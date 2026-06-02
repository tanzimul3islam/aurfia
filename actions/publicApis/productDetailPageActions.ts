'use server';

import { getProductBySlug } from '@/lib/product-helpers';

export type Product = Awaited<ReturnType<typeof getProductBySlug>>;

export type ProductImage = NonNullable<Product>['images'][number];

export type ProductVariant = NonNullable<Product>['variants'][number];

export { getProductBySlug };

export async function getSimilarProducts(slug: string, limit = 4) {
  const product = await getProductBySlug(slug);
  if (!product) return [];

  const all = await (await import('@/lib/product-helpers')).getAllProducts();
  return all
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, limit);
}
