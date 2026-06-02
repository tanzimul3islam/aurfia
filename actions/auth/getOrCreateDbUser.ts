'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const getOrCreateDbUser = async () => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    throw new Error('Internal Server Error');
  }

  let dbUser = await db.select().from(users).where(eq(users.clerkId, user.id));

  if (!dbUser[0]) {
    dbUser = await db
      .insert(users)
      .values({
        clerkId: user.id,
        userName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress ?? '',
        imageUrl: user.hasImage ? user.imageUrl : '',
        role: 'customer',
      })
      .returning();
  }

  return dbUser[0];
};
