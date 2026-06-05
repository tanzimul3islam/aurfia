'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import Toast from './Toast';
import { useCartStore } from '@/lib/cart-store';
import { OptimizedImage } from './optimized-image';

type PlaceholderProduct = {
  id: number;
  name: string;
  price: number;
  images: string[];
  slug: string;
};

const PlaceholderProductCard = ({ product, priority }: { product: PlaceholderProduct; priority?: boolean }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [toast, setToast] = React.useState<{ text: string; open: boolean }>({ text: '', open: false });
  const { addItem, items } = useCartStore();

  const isInCart = items.some(item => item.slug === product.slug);

  React.useEffect(() => {
    if (!isHovered || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, product.images.length]);

  React.useEffect(() => {
    if (!isHovered) setCurrentImageIndex(0);
  }, [isHovered]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const images = product.images || [];
  const hasImages = images.length > 0;

  React.useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(product.slug));
    } catch {
      console.error('Error loading favorites');
    }
  }, [product.slug]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedFavorites = newFavorite
        ? [...favorites, product.slug]
        : favorites.filter((slug: string) => slug !== product.slug);

      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoritesUpdate', {
        detail: { action: newFavorite ? 'add' : 'remove' }
      }));

      setToast({
        text: newFavorite ? 'Added to wishlist' : 'Removed from wishlist',
        open: true
      });
    } catch {
      console.error('Error updating favorites');
    }
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="border border-black/10 hover:border-black/20 rounded-sm overflow-hidden relative block">
          {hasImages ? (
            <>
              <div className="w-full bg-neutral-100 rounded-sm overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <OptimizedImage
                  src={images[currentImageIndex]}
                  alt=""
                  width={800}
                  height={1000}
                  priority={priority}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {images.length > 1 && isHovered && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-sm p-1.5 shadow-lg transition-all duration-200 opacity-80 hover:opacity-100 z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-3 h-3 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {images.length > 1 && isHovered && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-sm p-1.5 shadow-lg transition-all duration-200 opacity-80 hover:opacity-100 z-10"
                  aria-label="Next image"
                >
                  <svg className="w-3 h-3 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <div className="w-full bg-neutral-100 rounded-sm flex items-center justify-center" style={{ aspectRatio: '4/5' }}>
              <span className="text-neutral-400 text-xs">No image</span>
            </div>
          )}
        </div>

        <div className="mt-3 ml-4 grid grid-cols-[1fr_56px] items-start gap-x-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{product.name}</div>
            <div className="mt-2 text-sm text-neutral-600">${(product.price / 100).toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-2 justify-self-start -translate-x-2">
            <button
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isFavorite}
              onClick={handleToggleFavorite}
              className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                isFavorite ? 'text-black' : 'text-neutral-400 hover:text-black'
              }`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <button
              aria-label={isInCart ? 'Already in cart' : 'Quick add to cart'}
              disabled={isInCart}
              onClick={(e) => {
                if (isInCart) return;
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  productId: String(product.id),
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images[0] || undefined,
                  slug: product.slug,
                });
                setToast({ text: 'Added to cart', open: true });
              }}
              className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                isInCart
                  ? 'text-green-600 cursor-not-allowed opacity-60'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>

      <Toast
        text={toast.text}
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Link>
  );
};

export default PlaceholderProductCard;
