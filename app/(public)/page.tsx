import { getLatestProducts, getAllProducts } from '@/lib/product-helpers';
import ProductCard from '@/components/product-card';
import Link from 'next/link';
import PlaceholderProductCard from '@/components/placeholderProductCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latestProducts = await getLatestProducts(8);
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.filter((p) => p.priceCents > 30000).slice(0, 6);

  return (
    <main className="pt-8">
      <section className="max-w-none py-6 md:py-8">
        <div className="px-4">
          <h1 className="font-serif font-medium tracking-[-0.01em] leading-[1.05] text-[clamp(28px,5.2vw,40px)]">
            Timeless Forms. Pure Brilliance.
          </h1>
          <p className="mt-2 text-[15px] md:text-[16px] text-neutral-600 max-w-[580px]">
            Minimal jewelry for every day.
          </p>
          <div className="mt-3">
            <a
              href="/shop"
              className="inline-flex items-center justify-center h-10 md:h-11 px-5 bg-[#0E0E0E] text-white text-sm rounded-none hover:opacity-95"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="max-w-none pb-16">
          <div className="px-6 flex items-end justify-between mb-4">
            <h2 className="font-serif text-[32px] md:text-[40px]">Featured</h2>
          </div>

          <div className="px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section id="grid" className="max-w-none pb-16">
        <div className="px-6 flex items-end justify-between mb-4">
          <h2 className="font-serif text-[32px] md:text-[40px]">
            Just Arrived
          </h2>
        </div>

        <div className="px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {latestProducts.map((product) => (
            <PlaceholderProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-brand-light border-y border-black/5">
        <div className="container py-8 text-sm text-neutral-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>30-day returns</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
