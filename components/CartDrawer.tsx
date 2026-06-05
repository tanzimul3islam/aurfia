'use client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'
import { OptimizedImage } from './optimized-image'

export default function CartDrawer({ open, onClose }:{
  open:boolean; onClose: ()=>void;
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  useEffect(() => setMounted(true), [])

  // Close on ESC
  useEffect(() => {
    function esc(e: KeyboardEvent){ if(e.key==='Escape') onClose() }
    if (open) document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [open, onClose])

  // Body scroll lock (prevents layout shift from scrollbar)
  useLayoutEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.paddingRight = ''
    }
  }, [open])

  if (!mounted || !open) return null

  const isEmpty = items.length === 0
  const subtotal = (getTotalPrice() / 100).toFixed(2) // Convert cents to dollars

  return createPortal(
    <>
      {/* Overlay (fixed, ohne Blur) */}
      <button
        onClick={onClose}
        aria-label="Close overlay"
        className="fixed inset-0 z-50 bg-black/30"
      />

      {/* Panel (fixed, 100dvh + Safe Areas) */}
      <aside
        className="fixed z-50 right-0 top-0 w-[360px] md:w-[420px] bg-white border-l border-black/10 flex flex-col"
        style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top)' }}
        role="dialog" aria-modal="true" aria-label="Shopping Cart"
      >
        {/* Header (sticky/kein Scroll) */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-black/10 bg-white">
          <div className="font-medium">Cart ({items.length})</div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">Close</button>
        </header>

        {/* Content (eigenes Scrollen) */}
        <div
          className="flex-1 overflow-auto p-4 space-y-4"
          style={{ WebkitOverflowScrolling: 'touch' as any }}
        >
          {isEmpty ? (
            <div className="text-sm text-neutral-600">Your cart is empty.</div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-3">
              <Link href={`/product/${item.slug}`}
                 className="shrink-0 w-[96px] h-[120px] border border-black/10 overflow-hidden"
                 style={{ aspectRatio:'4 / 5', background:'#F5F5F5' }}>
                <OptimizedImage src={item.image ?? ''} alt={item.name} width={400} height={500} className="w-full h-full" imgClassName="w-full h-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.slug}`} className="block truncate text-sm font-medium">{item.name}</Link>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border border-black/10">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 hover:bg-neutral-50"
                    >
                      −
                    </button>
                    <div className="w-8 h-8 grid place-items-center text-sm">{item.quantity}</div>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 hover:bg-neutral-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-medium">${(item.price / 100).toFixed(2)}</div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="mt-2 p-1 opacity-70 hover:opacity-100 hover:bg-red-50 rounded"
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer (sticky, Safe-Area unten) */}
        <footer
          className="border-t border-black/10 p-4 bg-white sticky bottom-0"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
        >
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span><span className="font-medium">${subtotal}</span>
          </div>
          <div className="mt-1 text-xs text-neutral-500">incl. tax, plus shipping</div>
          <div className="mt-3 flex gap-2">
            <button
              disabled={isEmpty}
              onClick={() => { if (!isEmpty) { onClose(); router.push('/checkout'); } }}
              className={`flex-1 h-11 rounded-none grid place-items-center ${isEmpty ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-black text-white hover:opacity-95'}`}
            >
              Checkout
            </button>
            <button
              onClick={() => { onClose(); router.push('/cart'); }}
              className="h-11 px-4 border border-black/10 rounded-none grid place-items-center hover:border-black/20"
            >
              View Cart
            </button>
          </div>
        </footer>
      </aside>
    </>,
    document.body
  )
}
