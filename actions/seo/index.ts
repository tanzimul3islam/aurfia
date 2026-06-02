'use server';

import { db } from '@/lib/db';
import { seoMeta } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getSeoMeta() {
  return await db.select().from(seoMeta);
}

export async function saveSeoMeta(data: {
  page: string;
  title: string;
  description: string;
  keywords: string;
}) {
  const existing = await db
    .select()
    .from(seoMeta)
    .where(eq(seoMeta.page, data.page));

  if (existing.length > 0) {
    await db
      .update(seoMeta)
      .set({
        title: data.title,
        description: data.description,
        keywords: data.keywords,
      })
      .where(eq(seoMeta.page, data.page));
  } else {
    await db.insert(seoMeta).values(data);
  }
}
