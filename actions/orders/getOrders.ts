'use server';

import { db } from '@/lib/db';
import { orders as ordersTable, orderItems } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const getOrders = async () => {
  try {
    const ordersData = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));

    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return { ...order, items };
      }),
    );

    return ordersWithItems;
  } catch (error) {
    console.error('Fetch orders error:', error);
    throw new Error('Failed to fetch orders');
  }
};
