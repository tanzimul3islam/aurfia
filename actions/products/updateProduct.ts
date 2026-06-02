'use server';

import { isSuperAdminSession } from '../auth/isSuperAdminSession';

export async function updateProductAction(formData: FormData, productId: string) {
  const isSuperAdmin = await isSuperAdminSession();
  if (!isSuperAdmin.isLoggedIn) {
    throw new Error('Unauthorized');
  }

  // product.db is read-only. Updates are not supported.
  // Return mock success for now.
  console.log('Update requested for product:', productId, '(read-only source)');
  return { id: productId };
}
