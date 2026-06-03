"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import ProductCard from "@/components/product-card";
import Toast from "@/components/Toast";
import ProductStructuredData from "@/components/ProductStructuredData";
import {
  getProductBySlug,
  getSimilarProducts,
} from "@/actions/publicApis/productDetailPageActions";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import StarRating from "@/components/reviews/StarRating";
import { getProductReviews } from "@/actions/reviews/getProductReviews";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem, items } = useCartStore();

  const [product, setProduct] = useState<Awaited<ReturnType<typeof getProductBySlug>>>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; open: boolean }>({
    text: "",
    open: false,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewStats, setReviewStats] = useState<{ averageRating: number; totalReviews: number } | null>(null);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const isInCart = product
    ? items.some((item) => item.slug === product.slug)
    : false;

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductBySlug(slug);
        if (!fetchedProduct) return notFound();
        setProduct(fetchedProduct);

        const reviews = await getProductReviews(fetchedProduct.id);
        setReviewStats(
          reviews.totalReviews > 0
            ? { averageRating: reviews.averageRating, totalReviews: reviews.totalReviews }
            : null
        );

        const fetchedSimilar = await getSimilarProducts(slug);
        setSimilarProducts(fetchedSimilar);
      } catch (err) {
        console.error("Error fetching product:", err);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const currentVariant = product?.variants[selectedVariantIndex] ?? null;

  const handleAddToCart = () => {
    if (!product) return;
    const priceCents = currentVariant?.sellingPriceCents ?? product.priceCents;
    addItem({
      productId: String(product.id),
      name: product.name,
      price: priceCents,
      quantity: 1,
      image: product.images[0]?.url,
      slug: product.slug,
    });
    setToast({ text: "Added to cart", open: true });
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = newFavorite
        ? [...favorites, product.slug]
        : favorites.filter((s: string) => s !== product.slug);

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      window.dispatchEvent(
        new CustomEvent("favoritesUpdate", {
          detail: { action: newFavorite ? "add" : "remove" },
        })
      );

      setToast({
        text: newFavorite ? "Added to wishlist" : "Removed from wishlist",
        open: true,
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  useEffect(() => {
    if (!product) return;
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(product.slug));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [product]);

  if (loading)
    return (
      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="w-full bg-neutral-50" style={{aspectRatio: "4/5"}}>
            <div className="w-full h-full animate-pulse bg-neutral-100" />
          </div>
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-neutral-100 animate-pulse rounded-sm" />
            <div className="h-6 w-1/4 bg-neutral-100 animate-pulse rounded-sm" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-neutral-100 animate-pulse rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  if (!product) notFound();

  return (
    <>
      <ProductStructuredData
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price_cents: currentVariant?.sellingPriceCents ?? product.priceCents,
          currency: product.currency,
          stock: product.stock,
          sku: product.sku,
          images: product.images.map((img) => ({
            url: img.url,
            alt: product.name,
          })),
        }}
      />

      <div className="container py-8 lg:py-12">
        <nav className="text-sm text-neutral-600 mb-6">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">›</span>
          <a href="/shop" className="hover:text-black">Shop</a>
          <span className="mx-2">›</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="border border-black/10 rounded-sm overflow-hidden">
              <div className="w-full bg-neutral-100" style={{ aspectRatio: "4/5" }}>
                <img
                  src={currentVariant?.imageUrl || product.images[currentImageIndex]?.url || product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover text-transparent"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`border rounded-sm overflow-hidden hover:border-black/20 ${currentImageIndex === index ? "border-black ring-1 ring-black/20" : "border-black/10"}`}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover text-transparent"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h1 className="font-serif text-[32px] md:text-[40px] leading-[1.1] mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              {reviewStats ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={reviewStats.averageRating} size={16} />
                  <span className="text-sm text-zinc-500">
                    {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""})
                  </span>
                </div>
              ) : (
                <span className="text-sm text-zinc-400">No reviews yet</span>
              )}
            </div>
            <div className="text-2xl font-medium mb-4">${((currentVariant?.sellingPriceCents ?? product.priceCents) / 100).toFixed(2)}</div>
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>

            {product.variants.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-900">Available Options</h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`border rounded-sm p-1 text-center hover:border-black/60 transition w-[100px] ${
                        idx === selectedVariantIndex
                          ? "border-black ring-1 ring-black/20"
                          : "border-black/10"
                      }`}
                    >
                      <div className="w-full aspect-[4/3] bg-neutral-100 overflow-hidden rounded-sm">
                        {variant.imageUrl ? (
                          <img src={variant.imageUrl} alt={variant.title ?? ""} className="w-full h-full object-cover text-transparent" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[9px]">No image</div>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-zinc-800 leading-tight mt-1">{variant.title ?? "Option"}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`flex-1 h-12 rounded-none text-sm font-medium ${isInCart ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-black text-white hover:opacity-95"}`}
              >
                {isInCart ? "Already in Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleToggleFavorite}
                className="w-12 h-12 border border-black/10 rounded-none hover:border-black/20 flex items-center justify-center"
                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "black" : "none"} stroke={isFavorite ? "black" : "currentColor"} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 1.06-1.06 5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 lg:mt-20 max-w-lg">
          <h2 className="font-serif text-[28px] md:text-[32px] mb-8">Reviews</h2>
          <ReviewList productId={product.id} refreshKey={reviewRefreshKey} />
          <ReviewForm productId={product.id} onReviewSubmitted={() => setReviewRefreshKey(k => k + 1)} />
        </section>

        {similarProducts.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <h2 className="font-serif text-[28px] md:text-[32px] mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <Toast text={toast.text} open={toast.open} onClose={() => setToast({ ...toast, open: false })}/>
      </div>
    </>
  );
}
