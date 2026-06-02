'use server';

import { getProductById as getProductByIdHelper } from '@/lib/product-helpers';

export const getProductById = async (id: number) => {
  return getProductByIdHelper(id);
};
