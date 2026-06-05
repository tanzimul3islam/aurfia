'use server';

import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/db/schema';
import { searchRelevantChunks, generateResponse } from '@/lib/chat/rag';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

export async function sendChatMessage(conversationId: number, message: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return { error: 'You must be logged in to chat.' };
  }

  const conv = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1);

  if (conv.length === 0 || conv[0].userId !== userId) {
    return { error: 'Conversation not found.' };
  }

  await db.insert(chatMessages).values({
    conversationId,
    role: 'user',
    content: message,
  });

  const relevantChunks = await searchRelevantChunks(message);

  const reply = await generateResponse(message, relevantChunks);

  await db.insert(chatMessages).values({
    conversationId,
    role: 'assistant',
    content: reply,
  });

  if (conv[0].title === 'New conversation') {
    const title = message.length > 60 ? message.slice(0, 57) + '...' : message;
    await db
      .update(chatConversations)
      .set({ title })
      .where(eq(chatConversations.id, conversationId));
  }

  return { reply };
}

export async function getMessages(conversationId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return [];

  const conv = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1);

  if (conv.length === 0 || conv[0].userId !== userId) return [];

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(chatMessages.createdAt);

  return messages;
}
