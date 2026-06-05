'use server';

import { db } from '@/lib/db';
import { chatDocuments, chatDocumentChunks, products, productBreadcrumbs } from '@/db/schema';
import { chunkDocument, chunkProductText } from '@/lib/chat/document-chunker';
import { embedBatch } from '@/lib/chat/embeddings';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';

export async function uploadDocument(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const fileType = formData.get('fileType') as string | null;

  if (!title || !content) {
    return { error: 'Title and content are required.' };
  }

  const chunks = chunkDocument(content, title);

  const [doc] = await db
    .insert(chatDocuments)
    .values({
      title,
      content,
      fileType,
      chunkCount: chunks.length,
    })
    .returning();

  const texts = chunks.map((c) => c.content);
  const embeddings = await embedBatch(texts);

  for (let i = 0; i < chunks.length; i++) {
    await db.insert(chatDocumentChunks).values({
      documentId: doc.id,
      content: chunks[i].content,
      embedding: embeddings[i],
      metadata: chunks[i].metadata,
    });
  }

  revalidatePath('/admin/chatbot/documents');
  return { success: true, docId: doc.id };
}

export async function listDocuments() {
  const docs = await db
    .select()
    .from(chatDocuments)
    .orderBy(chatDocuments.createdAt);
  return docs;
}

export async function deleteDocument(docId: number) {
  await db.delete(chatDocumentChunks).where(eq(chatDocumentChunks.documentId, docId));
  await db.delete(chatDocuments).where(eq(chatDocuments.id, docId));
  revalidatePath('/admin/chatbot/documents');
  return { success: true };
}

export async function reindexProducts() {
  await db.delete(chatDocumentChunks).where(
    sql`${chatDocumentChunks.metadata}::jsonb @> '{"type":"product"}'`
  );

  const allProducts = await db
    .select({
      id: products.id,
      productTitle: products.productTitle,
      description: products.description,
      brandOrDesigner: products.brandOrDesigner,
      detailsJson: products.detailsJson,
    })
    .from(products);

  const breadcrumbs = await db
    .select()
    .from(productBreadcrumbs)
    .where(eq(productBreadcrumbs.sortOrder, 1));

  const catMap = new Map<number, string>();
  for (const b of breadcrumbs) {
    if (b.breadcrumb) catMap.set(b.productId, b.breadcrumb);
  }

  let totalChunks = 0;
  for (const p of allProducts) {
    const chunks = chunkProductText(
      p.id,
      p.productTitle ?? 'Untitled',
      p.description,
      p.brandOrDesigner,
      catMap.get(p.id) ?? null,
      p.detailsJson
    );

    if (chunks.length === 0) continue;

    const texts = chunks.map((c) => c.content);
    const embeddings = await embedBatch(texts);

    for (let i = 0; i < chunks.length; i++) {
      await db.insert(chatDocumentChunks).values({
        content: chunks[i].content,
        embedding: embeddings[i],
        metadata: chunks[i].metadata,
      });
      totalChunks++;
    }
  }

  revalidatePath('/admin/chatbot');
  return { success: true, productCount: allProducts.length, chunkCount: totalChunks };
}
