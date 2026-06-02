'use server';

import { getAllProducts } from '@/lib/product-helpers';

export const getProducts = async (page: number = 1, limit: number = 20) => {
  const all = await getAllProducts();
  const total = all.length;
  const offset = (page - 1) * limit;
  const paged = all.slice(offset, offset + limit);

  return {
    products: paged,
    total,
    page,
    limit,
  };
};
