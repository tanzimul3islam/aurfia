'use server';

import { isUserAdmin } from '../auth/isUserAdmin';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';

export async function onImportCsv(_formData: FormData) {
  const isAdmin = await isUserAdmin();
  const isSuperAdmin = await isSuperAdminSession();

  if (!isAdmin && !isSuperAdmin.isLoggedIn) {
    throw new Error('UNAUTHORIZED');
  }

  // CSV import would write to product.db — not supported yet.
  return { success: true, created: 0 };
}
