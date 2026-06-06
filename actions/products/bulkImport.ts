'use server';

import { db } from '@/lib/db';
import { products, productBreadcrumbs, productOptions } from '@/db/schema';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';

export async function bulkImport(formData: FormData) {
  const isSuperAdmin = await isSuperAdminSession();
  const isAdmin = await isUserAdmin();
  if (!isSuperAdmin.isLoggedIn && !isAdmin) throw new Error('Unauthorized');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const text = await file.text();
  const { data, errors: parseErrors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parseErrors.length) {
    return { created: 0, errors: parseErrors.map((e) => e.message) };
  }

  let created = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i] as Record<string, string>;
    try {
      if (!row.product_title || !row.product_title.trim()) {
        errors.push(`Row ${i + 1}: missing product_title`);
        continue;
      }

      const [result] = await db
        .insert(products)
        .values({
          productTitle: row.product_title.trim(),
          description: row.description || null,
          sellingPrice: parseFloat(row.selling_price) || 0,
          priceAmount: row.price_amount ? parseFloat(row.price_amount) : null,
          sku: row.sku || null,
          brandOrDesigner: row.brand_or_designer || null,
          priceCurrency: 'USD',
          readyToShipDays: row.ready_to_ship_days || null,
          qualityLevel: row.quality_level || null,
          detailsJson: row.details_json || null,
          url: row.url || null,
          shippingJson: row.shipping_json || null,
          returnsJson: row.returns_json || null,
        })
        .returning({ id: products.id });

      const productId = result.id;

      if (row.category) {
        const bcValues = [
          { productId, breadcrumb: 'Jewelry', sortOrder: 0 },
          { productId, breadcrumb: row.category, sortOrder: 1 },
        ];
        if (row.subcategory) {
          bcValues.push({
            productId,
            breadcrumb: row.subcategory,
            sortOrder: 2,
          });
        }
        await db.insert(productBreadcrumbs).values(bcValues);
      }

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

      created++;
    } catch (err) {
      errors.push(
        `Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  revalidatePath('/admin/products/list');
  return { created, errors: errors.length > 0 ? errors : undefined };
}
