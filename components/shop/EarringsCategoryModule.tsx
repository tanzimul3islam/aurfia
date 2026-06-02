'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { earringsSubcategories } from '@/lib/categories';

export default function EarringsCategoryModule() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');
  const currentSubcategory = searchParams.get('subcategory');

  const isActiveCategory = (slug: string) => {
    return currentCategory === 'earrings' && currentSubcategory === slug;
  };

  const getCategoryHref = (slug: string) => {
    return `/shop?category=earrings&subcategory=${slug}`;
  };

  return (
    <div className="w-full max-w-none p-6 md:p-8">
      {/* Title */}
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-zinc-900 tracking-wide">
          Earrings
        </h2>
      </div>


      {/* Categories */}
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {earringsSubcategories.map((item) => (
            <Link
              key={item.slug}
              href={getCategoryHref(item.slug)}
              className={`block py-2 text-center text-sm uppercase tracking-wider font-light transition-colors duration-200 ${
                isActiveCategory(item.slug)
                  ? 'text-black font-medium'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
