# Add variant support to CSV bulk import

## Changes

### 1. `actions/products/bulkImport.ts`
- Add `import { productOptions } from '@/db/schema'`
- After breadcrumbs insert (line ~73), add variant parsing loop:

```ts
const variantPattern = /^variant_(\d+)_(\w+)$/;
const variantsByIndex = new Map<number, { title?: string; price?: string; sellingPrice?: string }>();

for (const [key, value] of Object.entries(row)) {
  if (!value) continue;
  const match = key.match(variantPattern);
  if (match) {
    const idx = parseInt(match[1]);
    const field = match[2];
    if (!variantsByIndex.has(idx)) variantsByIndex.set(idx, {});
    const v = variantsByIndex.get(idx)!;
    if (field === 'title') v.title = value;
    else if (field === 'price') v.price = value;
    else if (field === 'selling_price') v.sellingPrice = value;
  }
}

for (const [, v] of variantsByIndex) {
  if (v.title) {
    await db.insert(productOptions).values({
      productId,
      title: v.title,
      price: v.price ? parseFloat(v.price) : null,
      sellingPrice: v.sellingPrice ? parseFloat(v.sellingPrice) : null,
    });
  }
}
```

### 2. `public/demo-product-import.csv`
Replace with variant columns:

```csv
product_title,description,selling_price,price_amount,category,variant_1_title,variant_1_price,variant_1_selling_price,variant_2_title,variant_2_price,variant_2_selling_price
"Silver Hoop Earrings","Classic sterling silver hoop earrings. Hypoallergenic and tarnish-resistant.",29.99,39.99,Earrings,"Size 6",29.99,29.99,"Size 7",29.99,29.99
"Gold Chain Necklace","14k gold layered chain necklace with adjustable clasp.",89.99,119.99,Necklaces,"16 inch",89.99,89.99,"18 inch",89.99,94.99
"Rose Gold Stacking Ring","Thin rose gold stacking ring. Comfort-fit band.",24.99,34.99,Rings,Size 6,24.99,24.99,Size 7,24.99,24.99
"Pearl Drop Earrings","Freshwater pearl drop earrings with sterling silver posts.",39.99,49.99,Earrings,,,,
"Leather Wrap Bracelet","Genuine leather wrap bracelet with magnetic closure.",19.99,29.99,Bracelets,,,,
```

### 3. `app/(admin)/admin/products/import/page.tsx`
Update instructions to add: "Optional columns: variant_1_title, variant_1_price, variant_1_selling_price (supports up to 5 variants per product)"
