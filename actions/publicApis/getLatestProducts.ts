'use server';

import { getLatestProducts } from '@/lib/product-helpers';

export type ProductWithImages = Awaited<ReturnType<typeof getLatestProducts>>[number];

export { getLatestProducts };
