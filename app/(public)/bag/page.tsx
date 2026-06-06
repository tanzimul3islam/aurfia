import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { buildPageMetadata } from '@/lib/seo-helper';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('Cart');
}

export default function BagPage() {
  return (
    <div className="container py-12 pt-20">
      <h1 className="h2 mb-6 flex items-center gap-4">
        <ShoppingBag className="w-8 h-8" />
        Bag
      </h1>
      <div className="text-center muted">
        <p>Your bag is empty</p>
        <Link href="/shop" className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-none hover:opacity-95">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
