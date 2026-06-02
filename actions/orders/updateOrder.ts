'use server';

import { db } from '@/lib/db';
import { orders as ordersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  if (!orderId || !newStatus) throw new Error('Invalid input');

  try {
    const [updatedOrder] = await db
      .update(ordersTable)
      .set({ status: newStatus })
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (!updatedOrder) throw new Error('Order not found');

    revalidatePath('/admin/orders');

    return updatedOrder;
  } catch (error) {
    console.error('Update order error:', error);
    throw new Error('Failed to update order');
  }
};
