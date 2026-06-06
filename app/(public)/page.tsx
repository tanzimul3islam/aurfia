import { getAllProducts, getCategoryTree } from '@/lib/product-helpers';
import ProductCard from '@/components/product-card';
import HomeHero from '@/components/home-hero';
import BrandStory from '@/components/brand-story';
import CategoryGrid from '@/components/category-grid';
import EditorialStrip from '@/components/editorial-strip';
import { buildPageMetadata } from '@/lib/seo-helper';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('Homepage');
}

export default async function Home() {
  const [allProducts, categoryTree] = await Promise.all([
    getAllProducts(),
    getCategoryTree(),
  ]);

  const productsWithImages = allProducts.filter((p) => p.images.length > 0);

  const bestSellers = [...productsWithImages]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);

  const categoryImages = new Map<string, string>();
  for (const p of allProducts) {
    if (p.category && !categoryImages.has(p.category) && p.images.length > 0) {
      categoryImages.set(p.category, p.images[0].url);
    }
  }

  const topCategories = categoryTree.slice(0, 6).map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
    image: categoryImages.get(cat.name) ?? '',
  }));

  return (
    <>
      <HomeHero />

      <BrandStory />

      {topCategories.length > 0 && <CategoryGrid categories={topCategories} />}

      <EditorialStrip />

      {bestSellers.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="font-serif text-[32px] md:text-[42px] text-brand">Best Sellers</h2>
              <p className="mt-2 text-neutral-500 text-sm">Our most-loved pieces</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {bestSellers.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}


    </>
  );
}
