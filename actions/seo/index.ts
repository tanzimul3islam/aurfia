'use server';

import { db } from '@/lib/db';
import { seoMeta } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type SEOMetaRow = {
  id: number;
  page: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noindex: boolean | null;
  priority: number | null;
};

export async function getSeoMeta(): Promise<SEOMetaRow[]> {
  return await db.select().from(seoMeta);
}

export async function getSeoMetaByPage(page: string): Promise<SEOMetaRow | null> {
  const rows = await db.select().from(seoMeta).where(eq(seoMeta.page, page));
  return (rows as SEOMetaRow[])[0] ?? null;
}

export async function saveSeoMeta(data: {
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noindex: boolean;
  priority: number;
}) {
  const existing = await db
    .select()
    .from(seoMeta)
    .where(eq(seoMeta.page, data.page));

  const values = {
    title: data.title || null,
    description: data.description || null,
    keywords: data.keywords || null,
    ogTitle: data.ogTitle || null,
    ogDescription: data.ogDescription || null,
    ogImage: data.ogImage || null,
    canonicalUrl: data.canonicalUrl || null,
    noindex: data.noindex,
    priority: data.priority || null,
  };

  if (existing.length > 0) {
    await db
      .update(seoMeta)
      .set(values)
      .where(eq(seoMeta.page, data.page));
  } else {
    await db.insert(seoMeta).values({ page: data.page, ...values });
  }
}

export async function deleteSeoMeta(page: string) {
  await db.delete(seoMeta).where(eq(seoMeta.page, page));
}
