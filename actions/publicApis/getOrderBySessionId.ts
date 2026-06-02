'use server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type OrderConfirmation = {
  id: number;
  email: string | null;
  total: number | null;
  currency: string | null;
  status: string | null;
  stripeId: string | null;
  shippingAddress: string | null;
  items: {
    name: string | null;
    price: number | null;
    quantity: number | null;
  }[];
};

export async function getOrderBySessionId(sessionId: string): Promise<OrderConfirmation | null> {
  if (!sessionId) return null;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeId, sessionId));
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}
