'use server';

import { db } from '@/lib/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function sendNewsletterAction(subject: string, content: string) {
  if (!subject || !content) {
    throw new Error('Subject + content required');
  }

  try {
    const activeSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));

    console.log('Sending newsletter to:', activeSubscribers.length, 'users');

    return { success: true, count: activeSubscribers.length };
  } catch (err) {
    console.error('SEND NEWSLETTER ERROR:', err);
    throw new Error('Failed to send newsletter');
  }
}
