'use server'

import { getAllProducts, getCategoryTree } from '@/lib/product-helpers';
import type { CategoryNode } from '@/lib/product-helpers';

export async function fetchCategories(): Promise<CategoryNode[]> {
  return getCategoryTree();
}

export async function fetchProducts(filter: { categoryId?: string; featured?: boolean } = {}, limit = 8, page = 1) {
  const all = await getAllProducts();
  const offset = (page - 1) * limit;
  const paged = all.slice(offset, offset + limit);

  return paged.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Math.round(p.priceCents / 100),
    images: p.images.map((img) => img.url),
  }));
}
