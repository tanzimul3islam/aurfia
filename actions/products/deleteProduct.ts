'use server';

import { redirect } from 'next/navigation';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';
import { revalidatePath } from 'next/cache';

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get('id');

  if (!id || typeof id !== 'string') {
    throw new Error('Invalid product ID');
  }

  const isAdmin = await isUserAdmin();
  const isSuperAdmin = await isSuperAdminSession();

  if (!isSuperAdmin.isLoggedIn && !isAdmin) {
    redirect('/');
  }

  // product.db is read-only for product data.
  // For now, products cannot be deleted from the SQLite source.
  // Mark as handled and revalidate.
  console.log('Delete requested for product:', id, '(read-only source)');
  revalidatePath('/admin/products/list');
};
