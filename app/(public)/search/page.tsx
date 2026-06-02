'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchProducts } from '@/actions/publicApis/searchProducts';
import { ProductWithImages } from '@/lib/product-helpers';
import ProductCard from '@/components/product-card';
import Pagination from '@/components/pagination';
import SkeletonProductCard from '@/components/SkeletonProductCard';

const PAGE_SIZE = 24;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (query) {
      runSearch(query);
    } else {
      setLoading(false);
    }
    setCurrentPage(1);
  }, [query]);

  async function runSearch(q: string) {
    setLoading(true);
    const results = await searchProducts(q);
    setProducts(results as any);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="h2 mb-4">Search Products</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 h-11 px-4 border border-black/20 rounded-none focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="h-11 px-6 bg-black text-white rounded-none hover:opacity-90"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-neutral-600">
            Results for &quot;<strong>{query}</strong>&quot;
            {products.length > 0 && ` (${products.length} products found)`}
          </p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-12 text-lg text-neutral-600">
          Enter a search term
        </div>
      )}

      {!loading && query && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg text-neutral-600 mb-4">
            No products found for &quot;{query}&quot;
          </div>
          <p className="text-neutral-500 mb-6">
            Try different keywords or browse the{' '}
            <Link href="/shop" className="text-blue-600 underline">Shop</Link>.
          </p>
        </div>
      )}

      {!loading && query && products.length > 0 && (
        <>
          {(() => {
            const totalPages = Math.ceil(products.length / PAGE_SIZE);
            const paginatedProducts = products.slice(
              (currentPage - 1) * PAGE_SIZE,
              currentPage * PAGE_SIZE,
            );
            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            );
          })()}
        </>
      )}

      <div className="mt-12 text-center">
        <Link href="/shop" className="btn btn-secondary">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
