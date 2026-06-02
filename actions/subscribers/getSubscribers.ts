'use server';

import { db } from '@/lib/db';
import { subscribers } from '@/db/schema';

export const getSubscribers = async () => {
  try {
    const rows = await db.select().from(subscribers).orderBy(subscribers.subscribedAt);

    return rows.map((s) => ({
      id: s.id,
      email: s.email,
      status: s.status as 'active' | 'unsubscribed',
      subscribed_at: s.subscribedAt,
    }));
  } catch (error) {
    console.error('GET SUBSCRIBERS ERROR:', error);
    throw new Error('Failed to load subscribers');
  }
};
