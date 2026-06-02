# Stripe Checkout Integration

## Overview
Complete the Stripe Checkout flow: create a Stripe utility, fix the success page, add a webhook handler, and update env config.

## Files to Create

### 1. `lib/stripe.ts` — Stripe server-side singleton

```ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export default stripe;
```

Then update `actions/publicApis/checkout.ts`:
- Replace `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')` with `import stripe from '@/lib/stripe'`

### 2. `actions/publicApis/getOrderBySessionId.ts` — Lookup order by Stripe session ID

```ts
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
```

### 3. Rewrite `app/(public)/checkout/success/page.tsx` — Order confirmation page

Replace the entire file with:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderBySessionId, OrderConfirmation } from '@/actions/publicApis/getOrderBySessionId';
import { useCartStore } from '@/lib/cart-store';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id') || '';
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!sessionId) {
      router.replace('/cart');
      return;
    }
    const load = async () => {
      const result = await getOrderBySessionId(sessionId);
      setOrder(result);
      clearCart();
      setLoading(false);
    };
    load();
  }, [sessionId, router, clearCart]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="text-lg">Confirming your order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <div className="text-xl font-serif mb-4">Order not found</div>
        <p className="text-neutral-600 mb-6">We couldn't find an order matching that session.</p>
        <Link href="/shop" className="inline-flex h-11 px-5 bg-black text-white items-center">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-[32px] mb-2">Thank you for your order!</h1>
        <p className="text-neutral-600">Order #{order.id}</p>
        <p className="text-sm text-neutral-500 mt-1">A confirmation email has been sent to {order.email}</p>
      </div>

      <div className="border border-black/10 p-6 space-y-4">
        <h2 className="font-medium">Order Summary</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} <span className="text-neutral-500">x{item.quantity}</span></span>
            <span className="font-medium">${((item.price ?? 0) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-black/10 pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>${((order.total ?? 0) / 100).toFixed(2)} USD</span>
        </div>
      </div>

      <div className="mt-6 border border-black/10 p-6">
        <h2 className="font-medium mb-2">Shipping Address</h2>
        <p className="text-sm text-neutral-600 whitespace-pre-line">{order.shippingAddress}</p>
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop" className="inline-flex h-11 px-5 bg-black text-white items-center">Continue Shopping</Link>
      </div>
    </div>
  );
}
```

### 4. Create `app/api/webhooks/stripe/route.ts` — Webhook handler

```ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
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
      await db
        .update(orders)
        .set({ status: 'paid' })
        .where(eq(orders.id, Number(orderId)));
    }
  }

  return NextResponse.json({ received: true });
}
```

### 5. Update `.env` — Add webhook secret

After line 32 (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`), add:
```
STRIPE_WEBHOOK_SECRET=
```

## Steps to Apply
1. Create `lib/stripe.ts`
2. Update `actions/publicApis/checkout.ts` — use `@/lib/stripe`
3. Create `actions/publicApis/getOrderBySessionId.ts`
4. Rewrite `app/(public)/checkout/success/page.tsx`
5. Create `app/api/webhooks/stripe/route.ts`
6. Add `STRIPE_WEBHOOK_SECRET=` to `.env`
7. Fill in actual Stripe keys from Stripe Dashboard:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
8. Create Stripe webhook endpoint at `https://yourdomain.com/api/webhooks/stripe`
9. Run `npm run build` to verify
