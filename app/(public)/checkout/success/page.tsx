'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderBySessionId, OrderConfirmation } from '@/actions/publicApis/getOrderBySessionId';
import { useCartStore } from '@/lib/cart-store';

function ConfirmationContent() {
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
        <p className="text-neutral-600 mb-6">We couldn&apos;t find an order matching that session.</p>
        <Link href="/shop" className="inline-flex h-11 px-5 bg-black text-white items-center">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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

export default function OrderConfirmationPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
