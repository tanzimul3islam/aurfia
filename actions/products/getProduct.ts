'use server';

import { getProductBySlug, getProductCardBySlug } from '@/lib/product-helpers';

export const getProduct = async (slug: string) => {
  const detail = await getProductBySlug(slug);
  return detail;
};

export const getProductCard = async (slug: string) => {
  return getProductCardBySlug(slug);
};
