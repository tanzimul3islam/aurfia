# Checkout Fix Plan

## Issue 1: Hydration Error (subtotal $0.00 vs real value)

### Root Cause
- `const subtotal = '$' + (getTotalPrice() / 100).toFixed(2)` — Zustand's localStorage persistence returns 0 on the server (SSR), so server renders `$0.00`, client renders real value like `$393.48`

### Fix (checkout/page.tsx)
1. Add `const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])`
2. Change `subtotal` to: `const subtotal = mounted ? '$' + (getTotalPrice() / 100).toFixed(2) : ''`
3. Show a loading state when not mounted: `if (!mounted) return <div className="container py-12 text-center"><div className="text-lg">Loading checkout...</div></div>`
4. Wrap `items.length === 0` redirect guard with `mounted` check: `if (mounted && items.length === 0) router.push('/cart')`

## Issue 2: Fake card fields — no Stripe Checkout visible

### Root Cause
- Step 2 has fake card inputs (Card Number, MM/YY, CVC on lines 167-174) that are NOT connected to Stripe
- The `handlePayment()` calls `checkoutAction()` which creates a Stripe Checkout Session — it redirects regardless of fake field values
- Fake fields are misleading; user fills them in but gets redirected to Stripe's site anyway

### Fix (checkout/page.tsx)
- Remove the 2-step flow entirely (no Step 1/Step 2)
- Single page: shipping address form + "Continue to Payment" button
- Remove radio buttons, fake card fields, fake PayPal button
- Add terms acceptance checkbox
- Add info text: "You will be redirected to Stripe Checkout to complete your payment securely. We accept Visa, Mastercard, and PayPal."
- Button text: "Continue to Payment" or "Redirecting to Stripe..." when processing

## Files to Change
- `app/(public)/checkout/page.tsx` — both fixes above
