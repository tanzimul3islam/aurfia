import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      try {
        await db
          .update(orders)
          .set({ status: 'paid' })
          .where(eq(orders.id, Number(orderId)));
      } catch (err) {
        console.error('Failed to update order status', err);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
