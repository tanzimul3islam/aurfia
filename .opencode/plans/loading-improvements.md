# Loading State Improvements

## 1. Redesign `SkeletonProductCard.tsx` — match current `ProductCard` style

**Changes:**
- Remove `border`, `rounded-sm`, `overflow-hidden` wrapper
- Use clean `bg-neutral-50` image area (matches `bg-neutral-50` in ProductCard)
- Remove `ml-4` grid → use `pt-3 pb-4 px-1` with flex layout (matching current footer)
- Replace icon squares with `rounded-full` placeholders
- Use `bg-neutral-100` with `animate-pulse` throughout

**New design:**
```tsx
export default function SkeletonProductCard() {
  return (
    <div>
      <div className="w-full bg-neutral-50" style={{aspectRatio: '4/5'}}>
        <div className="w-full h-full animate-pulse bg-neutral-100" />
      </div>
      <div className="pt-3 pb-4 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-4/5 bg-neutral-100 animate-pulse rounded-sm" />
            <div className="h-4 w-1/3 bg-neutral-100 animate-pulse rounded-sm" />
          </div>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <div className="w-8 h-8 bg-neutral-100 animate-pulse rounded-full" />
            <div className="w-8 h-8 bg-neutral-100 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 2. Update `shop/loading.tsx` — current grid spacing

**Changes:**
- Update grid to `px-4 md:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4`
- Keep skeleton cards

## 3. Shop page (`shop/page.tsx`) — replace inline text loading

**Changes:**
- Replace "Loading products..." text with skeleton grid:
```tsx
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
```
- Add `import SkeletonProductCard from '@/components/SkeletonProductCard';`

## 4. Search page (`search/page.tsx`) — skeleton grid

**Changes:**
- Replace "Searching..." text with skeleton grid matching search layout:
```tsx
{loading && (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
)}
```
- Add `import SkeletonProductCard from '@/components/SkeletonProductCard';`

## 5. Product detail page (`product/[slug]/page.tsx`) — layout skeleton

**Changes:**
- Replace "Loading product..." text with a 2-column skeleton (image left, info right):
```tsx
if (loading) {
  return (
    <div className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="w-full bg-neutral-50" style={{aspectRatio: '4/5'}}>
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
}
```

## 6. Checkout page (`checkout/page.tsx`) — already has "Loading checkout..." text

**Changes:**
- The checkout page already uses a mounted guard. The "Loading checkout..." text is fine for now since the form only shows after hydration. No changes needed.

## Files to modify
1. `components/SkeletonProductCard.tsx` — redesign
2. `app/(public)/(store)/shop/loading.tsx` — grid spacing
3. `app/(public)/(store)/shop/page.tsx` — add import + skeleton grid
4. `app/(public)/search/page.tsx` — add import + skeleton grid
5. `app/(public)/product/[slug]/page.tsx` — layout skeleton
