import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCard {
  name: string;
  slug: string;
  count: number;
  image: string;
}

export default function CategoryGrid({ categories }: { categories: CategoryCard[] }) {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-brand-light/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-[32px] md:text-[42px] text-brand">Shop by Category</h2>
            <p className="mt-2 text-neutral-500 text-sm">Find your perfect piece</p>
          </div>
          <Link
            href="/shop"
            className="text-sm text-brand-accent hover:text-brand items-center gap-1 hidden sm:flex transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] bg-neutral-200 overflow-hidden"
            >
              <img
                src={cat.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-white font-serif text-lg md:text-xl">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-0.5">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm text-brand-accent hover:text-brand transition-colors"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
