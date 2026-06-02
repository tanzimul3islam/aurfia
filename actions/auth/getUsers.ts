'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { isSuperAdminSession } from './isSuperAdminSession';
import { getOrCreateDbUser } from './getOrCreateDbUser';
import { eq, not } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    const isSuperAdmin = await isSuperAdminSession();
    const dbUser = await getOrCreateDbUser();

    if (isSuperAdmin.isLoggedIn || dbUser?.role === 'admin') {
      const u = await db
        .select()
        .from(users)
        .where(not(eq(users.id, dbUser!.id)));

      return u;
    }

    return [];
  } catch {
    throw new Error('Internal Server Error');
  }
};
