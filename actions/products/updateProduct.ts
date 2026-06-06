'use server';

import { db } from '@/lib/db';
import { products, productImages, productBreadcrumbs, productOptions, seoMeta } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';
import { revalidatePath } from 'next/cache';

export async function updateProduct(formData: FormData, productId: number) {
  const isSuperAdmin = await isSuperAdminSession();
  const isAdmin = await isUserAdmin();
  if (!isSuperAdmin.isLoggedIn && !isAdmin) throw new Error('Unauthorized');

  const title = formData.get('product_title') as string;
  if (!title) throw new Error('Product title is required');

  const description = formData.get('description') as string;
  const sellingPrice = parseFloat(formData.get('selling_price') as string) || 0;
  const priceAmount = formData.get('price_amount')
    ? parseFloat(formData.get('price_amount') as string)
    : null;
  const sku = (formData.get('sku') as string) || null;
  const brand = (formData.get('brand_or_designer') as string) || null;
  const category = (formData.get('category') as string) || null;
  const subcategory = (formData.get('subcategory') as string) || null;
  const readyToShipDays = (formData.get('ready_to_ship_days') as string) || null;
  const qualityLevel = (formData.get('quality_level') as string) || null;
  const detailsJson = (formData.get('details_json') as string) || null;
  const imageUrlsRaw = formData.get('image_urls') as string;
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];
  const variantsRaw = formData.get('variants') as string;
  const variants: { title: string; price: string; sellingPrice: string; imageUrl: string }[] =
    variantsRaw ? JSON.parse(variantsRaw) : [];

  const metaTitle = (formData.get('meta_title') as string) || null;
  const metaDescription = (formData.get('meta_description') as string) || null;

  await db
    .update(products)
    .set({
      productTitle: title,
      description: description || null,
      sellingPrice,
      priceAmount,
      sku,
      brandOrDesigner: brand,
      readyToShipDays,
      qualityLevel,
      detailsJson,
    })
    .where(eq(products.id, productId));

  await db.delete(productBreadcrumbs).where(eq(productBreadcrumbs.productId, productId));
  if (category) {
    const bcValues = [
      { productId, breadcrumb: 'Jewelry', sortOrder: 0 },
      { productId, breadcrumb: category, sortOrder: 1 },
    ];
    if (subcategory) {
      bcValues.push({ productId, breadcrumb: subcategory, sortOrder: 2 });
    }
    await db.insert(productBreadcrumbs).values(bcValues);
  }

  await db.delete(productImages).where(eq(productImages.productId, productId));
  if (imageUrls.length > 0) {
    await db.insert(productImages).values(
      imageUrls.map((url, i) => ({
        productId,
        imageUrl: url,
        sortOrder: i,
      })),
    );
  }

  await db.delete(productOptions).where(eq(productOptions.productId, productId));
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

  const pageKey = `product_${productId}`;
  const existingSeo = await db.select().from(seoMeta).where(eq(seoMeta.page, pageKey));
  if (metaTitle || metaDescription) {
    if (existingSeo.length > 0) {
      await db.update(seoMeta).set({ title: metaTitle, description: metaDescription }).where(eq(seoMeta.page, pageKey));
    } else {
      await db.insert(seoMeta).values({ page: pageKey, title: metaTitle, description: metaDescription });
    }
  } else if (existingSeo.length > 0) {
    await db.delete(seoMeta).where(eq(seoMeta.page, pageKey));
  }

  revalidatePath('/admin/products/list');
  revalidatePath(`/admin/products/${productId}`);
}
