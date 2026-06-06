'use server';

import { db } from '@/lib/db';
import { products, productImages, productBreadcrumbs, productOptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(formData: FormData) {
  const isSuperAdmin = await isSuperAdminSession();
  const isAdmin = await isUserAdmin();
  if (!isSuperAdmin.isLoggedIn && !isAdmin) {
    throw new Error('Unauthorized');
  }

  const id = parseInt(formData.get('id') as string);
  if (!id) throw new Error('Invalid product ID');

  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(productBreadcrumbs).where(eq(productBreadcrumbs.productId, id));
  await db.delete(productOptions).where(eq(productOptions.productId, id));
  await db.delete(products).where(eq(products.id, id));

  revalidatePath('/admin/products/list');
}
