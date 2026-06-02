'use server';

import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/actions/auth/isUserAdmin';
import { isSuperAdminSession } from '@/actions/auth/isSuperAdminSession';
import { revalidatePath } from 'next/cache';

export const bulkDeleteProducts = async (_formData: FormData) => {
  const isAdmin = await isUserAdmin();
  const isSuperAdmin = await isSuperAdminSession();

  if (!isSuperAdmin.isLoggedIn && !isAdmin) {
    redirect('/');
  }

  // Read-only source.
  revalidatePath('/admin/products/bulk-delete');
};
