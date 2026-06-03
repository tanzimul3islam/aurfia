'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import { Product, ProductImage } from '@prisma/client';
import { useCartStore } from '@/lib/cart-store';
import Toast from './Toast';

type P = any;

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-4.6-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.4-9.5 8-9.5 8z" fill="currentColor"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.1 20.8c-.2.1-.4.1-.6 0C9.3 19.4 3 14.9 3 9.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9 3.5c0 5.4-6.3 9.9-8.4 11.3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6h15l-1.5 9h-12z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  )
}

export default function ProductCard({ product }: { product: P }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState<{ text: string; open: boolean }>({ text: '', open: false });
  const { addItem } = useCartStore();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setLiked(favorites.includes(product.slug));
  }, [product.slug]);

  const images = product.images || [];
  const hasImages = images.length > 0;

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white transition-all duration-300">
        {hasImages ? (
          <>
            <div className="w-full bg-neutral-50 overflow-hidden relative" style={{aspectRatio: '4/5'}}>
              <img
                src={images[currentImageIndex].url}
                alt=""
                width={1200}
                height={1500}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              {images.length > 1 && isHovered && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-3 h-3 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {images.length > 1 && isHovered && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Next image"
                >
                  <svg className="w-3 h-3 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <div
                className="absolute inset-0"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </>
        ) : (
          <div className="w-full bg-neutral-50 flex items-center justify-center" style={{aspectRatio: '4/5'}}>
            <span className="text-neutral-400 text-xs">No image</span>
          </div>
        )}

        <div className="pt-3 pb-4 px-1">
            <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-neutral-900 truncate leading-snug">{product.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">${(product.priceCents / 100).toFixed(2)}</p>
              {product.rating && product.rating > 0 ? (
                <p className="text-xs text-neutral-400 mt-0.5">
                  ★ {product.rating.toFixed(1)} ({product.reviewCount ?? 0})
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <button
                aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={liked}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
                  let newFavorites;

                  if (liked) {
                    newFavorites = favorites.filter((slug: string) => slug !== product.slug)
                    setToast({
                      text: 'Removed from wishlist',
                      open: true
                    })
                  } else {
                    newFavorites = [...favorites, product.slug]
                    setToast({
                      text: 'Added to wishlist',
                      open: true
                    })
                  }

                  localStorage.setItem('favorites', JSON.stringify(newFavorites))
                  setLiked(!liked)

                  window.dispatchEvent(new CustomEvent('favoritesUpdate', {
                    detail: { action: liked ? 'remove' : 'add' }
                  }))
                }}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  liked
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <HeartIcon filled={liked} />
              </button>

              <button
                aria-label="Quick add to cart"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addItem({
                    productId: String(product.id),
                    name: product.name,
                    price: product.priceCents,
                    quantity: 1,
                    image: images[0]?.url,
                    slug: product.slug,
                  });
                  setToast({ text: 'Added to cart', open: true })
                }}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all duration-200"
              >
                <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        text={toast.text}
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Link>
  );
}
