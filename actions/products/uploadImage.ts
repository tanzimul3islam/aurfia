'use server';

import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';
import { uploadImageBuffer } from '@/lib/imageUploader';

export async function uploadProductImage(formData: FormData) {
  const isSuperAdmin = await isSuperAdminSession();
  const isAdmin = await isUserAdmin();
  if (!isSuperAdmin.isLoggedIn && !isAdmin) throw new Error('Unauthorized');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImageBuffer(buffer, file.name);
  return { url };
}
