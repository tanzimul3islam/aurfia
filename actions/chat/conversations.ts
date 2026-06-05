'use server';

import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc, and } from 'drizzle-orm';

export async function createConversation() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;

  const [conv] = await db
    .insert(chatConversations)
    .values({ userId })
    .returning();

  return conv;
}

export async function listConversations() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return [];

  const convs = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, userId))
    .orderBy(desc(chatConversations.updatedAt))
    .limit(50);

  return convs;
}

export async function deleteConversation(conversationId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return { error: 'Not authenticated' };

  await db
    .delete(chatConversations)
    .where(
      and(
        eq(chatConversations.id, conversationId),
        eq(chatConversations.userId, userId)
      )
    );

  return { success: true };
}

export async function getAllConversations(limit = 50) {
  const convs = await db
    .select()
    .from(chatConversations)
    .orderBy(desc(chatConversations.updatedAt))
    .limit(limit);

  return convs;
}
