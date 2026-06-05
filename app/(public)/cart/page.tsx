'use client'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import { OptimizedImage } from '@/components/optimized-image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const subtotalCents = getTotalPrice()
  const subtotalEuros = Number((subtotalCents / 100).toFixed(2))
  const FREE_SHIPPING_THRESHOLD = 50

  const left = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalEuros)
  const progress = Math.min(100, (subtotalEuros / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="container py-8 lg:py-12 grid lg:grid-cols-[1fr_360px] gap-10">
      
      {/* Cart Items */}
      <section aria-labelledby="cart-heading">
        <h1 id="cart-heading" className="font-serif text-[28px] md:text-[40px] leading-[1.1]">
          Cart
        </h1>

        {/* Free Shipping Progress Bar */}
        <div className="mt-4 bg-neutral-50 border border-black/10 p-3">
          <div className="text-sm">
            {left > 0
              ? `$${left.toFixed(0)} away from free shipping`
              : 'Free shipping activated'}
          </div>
          <div className="mt-2 h-1 bg-neutral-200">
            <div
              className="h-1 bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-600">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-4 border border-black/10 p-3">
                
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="shrink-0 w-[120px] h-[150px] border border-black/10 overflow-hidden"
                  style={{ aspectRatio: '4/5', background: '#F5F5F5' }}
                >
                  <OptimizedImage
                    src={item.image ?? '/placeholder.png'}
                    alt={item.name}
                    width={400}
                    height={500}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
                </Link>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="block truncate text-sm"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price / 100).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-black/10">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 hover:bg-neutral-50"
                      >
                        −
                      </button>

                      <div className="w-8 h-8 grid place-items-center text-sm">
                        {item.quantity}
                      </div>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-8 h-8 hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs opacity-70 hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          href="/shop"
          className="inline-block mt-6 text-sm opacity-70 hover:opacity-100"
        >
          Continue shopping
        </Link>
      </section>

      {/* Summary */}
      <aside className="lg:sticky lg:top-32 h-max border border-black/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">
            ${subtotalEuros.toFixed(2)}
          </span>
        </div>

        <div className="mt-1 text-xs text-neutral-500">
          incl. tax, plus shipping
        </div>

        <div className="mt-4 bg-neutral-50 p-3 text-xs text-neutral-600">
          Free shipping over $50. 30-day returns.
        </div>

        <Link
          href="/checkout"
          className="mt-4 w-full h-11 bg-black text-white rounded-none grid place-items-center hover:opacity-95"
        >
          Checkout
        </Link>
      </aside>
    </div>
  )
}
