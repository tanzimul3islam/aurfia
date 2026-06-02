'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isSuperAdminSession } from './isSuperAdminSession';
import { revalidatePath } from 'next/cache';

export const setUserRole = async (userId: number, role: 'admin') => {
  const isSuperAdmin = await isSuperAdminSession();

  if (!isSuperAdmin.isLoggedIn) {
    throw new Error('Unauthorized');
  }

  await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId));

  revalidatePath('/admin/users');
};
