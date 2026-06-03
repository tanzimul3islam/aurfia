'use client';

import { useState, useEffect, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { getFavorites } from '@/actions/publicApis/faveroutes';
import { useCartStore } from '@/lib/cart-store';

type FavoriteItem = {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  images: { url: string }[];
};

export default function WishlistPage() {
  const addItem = useCartStore((s) => s.addItem);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    const favoriteSlugs = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (favoriteSlugs.length === 0) {
      setLoading(false);
      return;
    }

    startTransition(async () => {
      const data: any = await getFavorites(favoriteSlugs);
      setFavorites(data);

      const valid = data.map((p: any) => p.slug);
      localStorage.setItem('favorites', JSON.stringify(valid));
      window.dispatchEvent(new CustomEvent('favoritesUpdate'));
      setLoading(false);
    });
  }

  function removeFavorite(slug: string) {
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = stored.filter((s: string) => s !== slug);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(favorites.filter((f) => f.slug !== slug));
    window.dispatchEvent(new CustomEvent('favoritesUpdate'));
  }

  function addToCart(item: FavoriteItem) {
    addItem({
      productId: String(item.id),
      name: item.name,
      price: item.priceCents,
      quantity: 1,
      image: item.images?.[0]?.url,
      slug: item.slug,
    });
    setAddedToCart(String(item.id));
    setTimeout(() => setAddedToCart(null), 2000);
  }

  if (loading || isPending) {
    return (
      <div className="container py-12 text-center">
        <div className="text-lg">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="flex items-end justify-between mb-4">
        <h1 className="font-serif text-[28px] md:text-[40px] leading-[1.1]">
          Wishlist
        </h1>
        {favorites.length > 0 && (
          <button
            onClick={() => {
              localStorage.setItem('favorites', '[]');
              setFavorites([]);
              window.dispatchEvent(new CustomEvent('favoritesUpdate'));
            }}
            className="text-sm opacity-70 hover:opacity-100"
          >
            Remove all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-neutral-600">Nothing saved yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((p) => (
            <div key={p.id} className="group">
              <div
                className="relative border border-black/10 rounded-sm overflow-hidden"
                style={{ aspectRatio: '4/5', background: '#F5F5F5' }}
              >
                <a href={`/product/${p.slug}`} className="block w-full h-full">
                  <img
                    src={p.images?.[0]?.url || ''}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </a>
                <button
                  onClick={() => removeFavorite(p.slug)}
                  className="absolute top-3 right-3 p-1 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Heart size={20} className="fill-black text-black" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="truncate text-sm">{p.name}</span>
                <span className="text-sm font-medium">
                  ${(p.priceCents / 100).toFixed(2)}
                </span>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => addToCart(p)}
                  className={`w-full h-12 rounded-sm transition-all duration-200 flex items-center justify-center px-6 ${
                    addedToCart === String(p.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-black text-white hover:opacity-95'
                  }`}
                >
                  <span className="text-xs font-medium tracking-wide">
                    {addedToCart === String(p.id) ? 'ADDED!' : 'ADD TO CART'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
