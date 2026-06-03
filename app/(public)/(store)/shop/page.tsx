'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/product-card';
import Pagination from '@/components/pagination';
import SkeletonProductCard from '@/components/SkeletonProductCard';
import { getAllProducts, ProductWithImages } from '@/actions/publicApis/productForStore';

const PAGE_SIZE = 24;

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<ProductWithImages[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFiltering();
  }, [allProducts, sortBy, category, subcategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  async function loadProducts() {
    setLoading(true);
    try {
      const products = await getAllProducts();
      setAllProducts(products);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  function applyFiltering() {
    let filtered = [...allProducts];

    if (category) {
      const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/^-|-$/g, '').replace(/-+/g, '-');
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase().replace(/[^a-z0-9]+/g, '') === catSlug,
      );
    }

    if (subcategory) {
      const q = subcategory.toLowerCase().replace(/-/g, ' ');
      filtered = filtered.filter((product) =>
        product.subcategory?.toLowerCase().includes(q),
      );
    }

    let sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    setFilteredProducts(sorted);
  }

  if (loading) {
    return (
      <div className="max-w-none pb-16">
        <div className="px-6 flex items-end justify-between mb-4">
          <h2 className="font-serif text-[32px] md:text-[40px]">Shop</h2>
        </div>
        <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getCategoryDisplayName = () => {
    if (category) {
      return subcategory
        ? `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')}`
        : category.charAt(0).toUpperCase() + category.slice(1);
    }
    return 'Shop';
  };

  return (
    <>
      <div className="max-w-none pb-16">
        {(category || subcategory) && (
          <div className="px-6 pt-6 pb-2">
            <nav className="flex items-center space-x-2 text-sm text-neutral-600">
              <a href="/" className="hover:text-black transition-colors">Home</a>
              <span>/</span>
              <a href="/shop" className="hover:text-black transition-colors">Shop</a>
              {category && (
                <>
                  <span>/</span>
                  <span className="text-black font-medium capitalize">{category}</span>
                </>
              )}
              {subcategory && (
                <>
                  <span>/</span>
                  <span className="text-black font-medium capitalize">{subcategory.replace('-', ' ')}</span>
                </>
              )}
            </nav>
          </div>
        )}

        <div className="px-6 flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-[32px] md:text-[40px]">{getCategoryDisplayName()}</h2>
            <p className="text-sm text-neutral-600 mt-1">Discover our exclusive collection</p>
          </div>
          <div className="text-sm text-neutral-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="flex items-center justify-end relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center justify-center w-9 h-9 border border-black/20 rounded-none hover:border-black bg-white"
              title="Sort"
            >
              <ArrowUpDown size={16} />
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 bg-white border border-black/20 rounded-none shadow-lg">
                  <button
                    onClick={() => { setSortBy('newest'); setShowSortMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Newest first
                  </button>
                  <button
                    onClick={() => { setSortBy('price-low'); setShowSortMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => { setSortBy('price-high'); setShowSortMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Name A-Z
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-10 text-center text-sm text-neutral-500">
            No products found
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
