'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { checkoutAction } from '@/actions/publicApis/checkout'
import { OptimizedImage } from '@/components/optimized-image'

type Addr = {
  firstName: string; lastName: string; email: string; phone?: string;
  street: string; zip: string; city: string; country: string;
  company?: string;
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [shipping, setShipping] = useState<Addr>({
    firstName:'', lastName:'', email:'', phone:'',
    street:'', zip:'', city:'', country:'United States',
    company:''
  })

  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState<Addr>({
    firstName:'', lastName:'', email:'', phone:'',
    street:'', zip:'', city:'', country:'United States',
    company:''
  })

  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (billingSame) setBilling(shipping) }, [billingSame, shipping])
  useEffect(() => { if (mounted && items.length === 0) router.push('/cart') }, [items, mounted, router])

  const shipValid = !!(shipping.firstName && shipping.lastName && shipping.email && shipping.street && shipping.zip && shipping.city && shipping.country)
  const canContinue = shipValid && termsAccepted
  const subtotal = mounted ? '$' + (getTotalPrice() / 100).toFixed(2) : ''

  const handlePayment = async () => {
    if (items.length === 0) return
    setIsProcessing(true)

    try {
      const shippingAddress = `${shipping.firstName} ${shipping.lastName}, ${shipping.street}, ${shipping.zip} ${shipping.city}, ${shipping.country}`
      const billingAddress = billingSame ? shippingAddress : `${billing.firstName} ${billing.lastName}, ${billing.street}, ${billing.zip} ${billing.city}, ${billing.country}`

      const orderItems = items.map(i => ({
        productId: Number(i.productId),
        name: i.name,
        price: i.price / 100,
        quantity: i.quantity
      }))

      const res = await checkoutAction({
        items: orderItems,
        email: shipping.email,
        shippingAddress,
        billingAddress
      })

      if (res.url) window.location.href = res.url
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Checkout error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container py-12 text-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    )
  }

  return (
    <div className="container py-8 lg:py-12 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-16">
      <div>
        <nav className="text-sm text-neutral-600 mb-6 flex items-center gap-3">
          <span className="text-black font-medium">Shipping</span>
        </nav>

        <section className="space-y-4">
          <h1 className="font-serif text-[26px] md:text-[32px] leading-[1.1]">Shipping Address</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="First Name *"
              value={shipping.firstName} onChange={e=>setShipping({...shipping, firstName:e.target.value})}/>
            <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="Last Name *"
              value={shipping.lastName} onChange={e=>setShipping({...shipping, lastName:e.target.value})}/>
          </div>
          <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Email *"
            value={shipping.email} onChange={e=>setShipping({...shipping, email:e.target.value})}/>
          <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Phone (optional)"
            value={shipping.phone} onChange={e=>setShipping({...shipping, phone:e.target.value})}/>
          <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Street & Number *"
            value={shipping.street} onChange={e=>setShipping({...shipping, street:e.target.value})}/>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="ZIP Code *"
              value={shipping.zip} onChange={e=>setShipping({...shipping, zip:e.target.value})}/>
            <input className="h-11 px-3 border border-black/10 rounded-none sm:col-span-2" placeholder="City *"
              value={shipping.city} onChange={e=>setShipping({...shipping, city:e.target.value})}/>
          </div>
          <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Country *"
            value={shipping.country} onChange={e=>setShipping({...shipping, country:e.target.value})}/>

          <label className="mt-2 flex items-start gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="mt-0.5 accent-black" checked={billingSame}
                   onChange={e=>setBillingSame(e.target.checked)} />
            <span>Billing address = Shipping address</span>
          </label>

          {!billingSame && (
            <div className="mt-4 border-t border-black/10 pt-4 space-y-3">
              <h2 className="font-serif text-[20px] md:text-[24px] leading-[1.2]">Billing Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="First Name *"
                  value={billing.firstName} onChange={e=>setBilling({...billing, firstName:e.target.value})}/>
                <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="Last Name *"
                  value={billing.lastName} onChange={e=>setBilling({...billing, lastName:e.target.value})}/>
              </div>
              <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Email *"
                value={billing.email} onChange={e=>setBilling({...billing, email:e.target.value})}/>
              <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Street & Number *"
                value={billing.street} onChange={e=>setBilling({...billing, street:e.target.value})}/>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input className="h-11 px-3 border border-black/10 rounded-none" placeholder="ZIP Code *"
                  value={billing.zip} onChange={e=>setBilling({...billing, zip:e.target.value})}/>
                <input className="h-11 px-3 border border-black/10 rounded-none sm:col-span-2" placeholder="City *"
                  value={billing.city} onChange={e=>setBilling({...billing, city:e.target.value})}/>
              </div>
              <input className="h-11 px-3 border border-black/10 rounded-none w-full" placeholder="Country *"
                value={billing.country} onChange={e=>setBilling({...billing, country:e.target.value})}/>
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-neutral-700">
            <input type="checkbox" className="mt-1 accent-black"
                   checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} />
            <span>I accept the <a href="/terms" className="underline">Terms & Conditions</a> and the <a href="/privacy-policy" className="underline">Privacy Policy</a>.</span>
          </label>

          <div className="border-t border-black/10 pt-6 mt-6">
            <div className="text-xs text-neutral-500 mb-4">
              You will be redirected to Stripe Checkout to complete your payment securely.
              We accept Visa, Mastercard, and PayPal.
            </div>
            <div className="flex justify-end">
              <button
                disabled={!canContinue || isProcessing}
                onClick={handlePayment}
                className="h-12 px-8 rounded-none text-sm font-medium bg-black text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Redirecting to Stripe...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 h-max border border-black/10 p-4">
        <div className="space-y-3">
          {items.map(item=>(
            <div key={item.id} className="flex gap-3">
              <div className="w-[64px] h-[80px] border border-black/10 overflow-hidden" style={{aspectRatio:'4/5', background:'#F5F5F5'}}>
                <OptimizedImage src={item.image || ''} alt="" width={200} height={250} className="w-full h-full" imgClassName="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{item.name}</div>
                <div className="text-sm font-medium">${(item.price / 100).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">{subtotal}</span></div>
        </div>
      </aside>
    </div>
  )
}
