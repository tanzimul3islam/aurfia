# Add Product Variants/Options to Admin Form

## Changes

### 1. `components/admin/ProductForm.tsx`
- Add `VariantItem` interface (tempId, title, price, sellingPrice, imageUrl)
- Add `initialVariants` to Props interface
- Add `variants` state (initialized from `initialVariants || []`)
- Add variant management functions: `addVariant`, `updateVariant`, `removeVariant`, `handleVariantImageUpload`
- Add "Variants / Options" section in JSX after Category field, before Images section:
  - Each variant row: Title input, Price input, Selling Price input, optional image upload, Remove button
  - "Add Variant" button at bottom
- On submit: `fd.append('variants', JSON.stringify(variants.map(({ tempId, ...v }) => v)))`
- Remove `tempId` from JSON sent to server (it's client-only for React keys)

### 2. `actions/products/createProduct.ts`
- Add `import { productOptions } from '@/db/schema'`
- Parse `variants` JSON from formData
- After breadcrumbs/images insert, insert into `productOptions`:
```ts
const variantsRaw = formData.get('variants') as string;
const variants: { title: string; price: string; sellingPrice: string; imageUrl: string }[] =
  variantsRaw ? JSON.parse(variantsRaw) : [];

for (const v of variants) {
  if (v.title) {
    await db.insert(productOptions).values({
      productId,
      title: v.title,
      price: v.price ? parseFloat(v.price) : null,
      sellingPrice: v.sellingPrice ? parseFloat(v.sellingPrice) : null,
      imageUrl: v.imageUrl || null,
    });
  }
}
```

### 3. `actions/products/updateProduct.ts`
- Same import and parsing as createProduct
- After breadcrumbs/images, delete existing options then re-insert:
```ts
await db.delete(productOptions).where(eq(productOptions.productId, productId));
// then insert loop same as createProduct
```

### 4. `app/(admin)/admin/products/[id]/edit/page.tsx`
- Pass `initialVariants` to ProductForm:
```tsx
initialVariants: product.variants.map((v) => ({
  tempId: `existing-${v.id}`,
  title: v.title || '',
  price: v.priceCents ? (v.priceCents / 100).toFixed(2) : '',
  sellingPrice: v.sellingPriceCents ? (v.sellingPriceCents / 100).toFixed(2) : '',
  imageUrl: v.imageUrl || '',
}))
```

## No other files need changes

- `bulkImport.ts` — CSV import doesn't handle variants (images uploaded separately)
- `deleteProduct.ts` — already deletes productOptions (cascade)
- `public/demo-product-import.csv` — no change needed
