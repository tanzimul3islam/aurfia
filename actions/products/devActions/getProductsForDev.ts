import { getAllProducts } from '@/lib/product-helpers';

export const getProducts = async (page: number = 1, limit: number = 200) => {
  const all = await getAllProducts();
  const total = all.length;
  const offset = (page - 1) * limit;

  return {
    products: all.slice(offset, offset + limit),
    total,
    page,
    limit,
  };
};
