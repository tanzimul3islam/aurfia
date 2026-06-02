'use server';

import { db } from '@/lib/db';
import { orders as ordersTable, orderItems } from '@/db/schema';
import { getStripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';

type CheckoutItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  sku?: string | null;
};

export async function checkoutAction({
  items,
  email,
  shippingAddress,
  billingAddress,
}: {
  items: CheckoutItem[];
  email: string;
  shippingAddress: string;
  billingAddress: string;
}) {
  if (!items || items.length === 0) throw new Error('No items in cart.');

  const totalCents = items.reduce(
    (sum, i) => sum + Math.round(i.price * 100) * i.quantity,
    0,
  );

  const orderInsert = await db
    .insert(ordersTable)
    .values({
      email,
      total: totalCents,
      currency: 'USD',
      shippingAddress,
      billingAddress,
      status: 'pending',
    })
    .returning();

  const orderId = orderInsert[0].id;

  await db.insert(orderItems).values(
    items.map((i) => ({
      orderId,
      name: i.name,
      price: Math.round(i.price * 100),
      quantity: i.quantity,
      sku: i.sku ?? null,
    })),
  );

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((i) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    customer_email: email,
    metadata: { orderId: String(orderId) },
  });

  await db
    .update(ordersTable)
    .set({ stripeId: session.id })
    .where(eq(ordersTable.id, orderId));

  return { url: session.url };
}
