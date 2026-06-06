"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import ProductCard from "@/components/product-card";
import Toast from "@/components/Toast";
import ProductStructuredData from "@/components/ProductStructuredData";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import { OptimizedImage } from "@/components/optimized-image";
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
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const totalInCart = product
    ? items.filter((item) => item.productId.startsWith(String(product.id))).reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  const setQty = (variantId: number, qty: number) => {
    setQuantities((prev) => ({ ...prev, [variantId]: Math.max(0, qty) }));
  };

  const totalSelected = product
    ? product.variants.reduce((sum, v) => sum + (quantities[v.id] || 0), 0)
    : 0;

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

  const handleAddAllToCart = () => {
    if (!product) return;
    let count = 0;
    product.variants.forEach((variant) => {
      const qty = quantities[variant.id] || 0;
      if (qty > 0) {
        addItem({
          productId: `${product.id}-${variant.id}`,
          name: `${product.name} - ${variant.title ?? "Option"}`,
          price: variant.sellingPriceCents,
          quantity: qty,
          image: variant.imageUrl || product.images[0]?.url,
          slug: product.slug,
        });
        count += qty;
      }
    });
    if (count === 0) {
      addItem({
        productId: String(product.id),
        name: product.name,
        price: product.priceCents,
        quantity: 1,
        image: product.images[0]?.url,
        slug: product.slug,
      });
      count = 1;
    }
    setQuantities({});
    setToast({ text: `Added ${count} item${count > 1 ? "s" : ""} to cart`, open: true });
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
          price_cents: product.variants[0]?.sellingPriceCents ?? product.priceCents,
          currency: product.currency,
          stock: product.stock,
          sku: product.sku,
          images: product.images.map((img) => ({
            url: img.url,
            alt: product.name,
          })),
        }}
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/` },
          { name: 'Shop', url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/shop` },
          { name: product.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug}` },
        ]}
      />

      <div className="container py-8 lg:py-12">
        <nav className="text-sm text-neutral-600 mb-6">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">›</span>
          <a href="/shop" className="hover:text-black">Shop</a>
          <span className="mx-2">›</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-4">
            <div className="border border-black/10 rounded-sm overflow-hidden">
              <div className="w-full bg-neutral-100" style={{ aspectRatio: "4/3" }}>
                <OptimizedImage
                  src={product.images[currentImageIndex]?.url || product.images[0]?.url}
                  alt={product.name}
                  width={800}
                  height={600}
                  priority
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
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
                    <OptimizedImage src={image.url} alt={`${product.name} ${index + 1}`} width={200} height={150} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Reviews */}
            <section className="pt-12">
              <h2 className="font-serif text-[28px] md:text-[32px] mb-8">Reviews</h2>
              <ReviewList productId={product.id} refreshKey={reviewRefreshKey} />
              <ReviewForm productId={product.id} onReviewSubmitted={() => setReviewRefreshKey(k => k + 1)} />
            </section>
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
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>

            {product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Available Options</h3>
                <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                  {/* Table header — hidden on mobile */}
                  <div className="hidden md:grid grid-cols-[60px_1fr_1fr_120px] gap-0 bg-neutral-50 border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                    <div className="p-3 text-center">Image</div>
                    <div className="p-3">Size</div>
                    <div className="p-3 text-center">Price</div>
                    <div className="p-3 text-center">Qty</div>
                  </div>

                  {product.variants.map((variant) => {
                    const qty = quantities[variant.id] || 0;
                    return (
                      <div
                        key={variant.id}
                        className="grid grid-cols-[48px_1fr_auto] md:grid-cols-[60px_1fr_1fr_120px] items-center gap-3 p-3 border-b border-[#E5E5E5] last:border-b-0 hover:bg-neutral-50/60 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden bg-neutral-100 border border-[#E5E5E5] shrink-0">
                          {variant.imageUrl ? (
                            <img src={variant.imageUrl} alt={variant.title ?? ""} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[9px]">—</div>
                          )}
                        </div>

                        {/* Size / Variant name */}
                        <div className="text-sm font-medium text-zinc-800">{variant.title ?? "Option"}</div>

                        {/* Price */}
                        <div className="text-sm text-zinc-700 text-right md:text-center md:col-span-1">
                          ${(variant.sellingPriceCents / 100).toFixed(2)}
                        </div>

                        {/* Quantity control */}
                        <div className="flex items-center justify-end md:justify-center col-span-full md:col-span-1 mt-2 md:mt-0">
                          <div className="inline-flex items-center border border-[#E5E5E5] rounded-md overflow-hidden">
                            <button
                              onClick={() => setQty(variant.id, qty - 1)}
                              className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-neutral-100 transition-colors border-r border-[#E5E5E5] text-sm leading-none"
                            >
                              −
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-zinc-800 select-none">
                              {qty}
                            </span>
                            <button
                              onClick={() => setQty(variant.id, qty + 1)}
                              className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-neutral-100 transition-colors border-l border-[#E5E5E5] text-sm leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddAllToCart}
                disabled={totalInCart > 0}
                className={`flex-1 h-12 rounded-lg text-sm font-medium transition-colors ${totalInCart > 0 ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-black text-white hover:opacity-90"}`}
              >
                {totalInCart > 0
                  ? `Already in Cart (${totalInCart})`
                  : totalSelected > 0
                    ? `Add to Cart (${totalSelected})`
                    : "Add to Cart"}
              </button>

              <button
                onClick={handleToggleFavorite}
                className="w-12 h-12 border border-[#E5E5E5] rounded-lg hover:border-black/20 flex items-center justify-center transition-colors"
                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "black" : "none"} stroke={isFavorite ? "black" : "currentColor"} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 1.06-1.06 5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

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
