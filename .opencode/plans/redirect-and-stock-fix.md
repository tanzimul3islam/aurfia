# Fix: Remove NEXT_REDIRECT popup and stock option

## Problem

1. `redirect()` in server actions throws `NEXT_REDIRECT` error caught by `try/catch` in `ProductForm.tsx`, showing as an alert popup.
2. Stock (`minimum_order_quantity`) still referenced in server actions even though it's removed from the form.

## Changes

### 1. `actions/products/createProduct.ts`
- Remove `import { redirect } from 'next/navigation'`
- Remove `stock` variable and `minimumOrderQuantity` from insert values
- Remove `redirect('/admin/products/list')` at end
- Keep `revalidatePath` only

### 2. `actions/products/updateProduct.ts`
- Same changes as createProduct

### 3. `actions/products/bulkImport.ts`
- Remove `minimumOrderQuantity` from insert values

### 4. `components/admin/ProductForm.tsx`
- After successful server action (in try block, after await), add:
  ```tsx
  window.location.href = '/admin/products/list';
  ```
- This navigates client-side instead of depending on server-side `redirect()`

## No new files needed

## Verification
- `npm run build` should pass
- Creating a product should redirect to list without error popup
- No stock field in form or server actions
