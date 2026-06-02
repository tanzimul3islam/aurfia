'use server';

import { getProductBySlug } from '@/lib/product-helpers';

export const getProductForDetails = async (slug: string) => {
  return getProductBySlug(slug);
};
