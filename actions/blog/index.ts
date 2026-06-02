'use server';

import { db } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAllPosts() {
  try {
    const rows = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return rows;
  } catch {
    return [];
  }
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
}) {
  try {
    await db.insert(blogPosts).values({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.cover_image,
      published: data.published,
    });
    revalidatePath('/admin/blog');
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function updateBlogPost(
  id: number,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    published: boolean;
  },
) {
  try {
    await db
      .update(blogPosts)
      .set({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.cover_image,
        published: data.published,
      })
      .where(eq(blogPosts.id, id));

    revalidatePath('/admin/blog');
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath('/admin/blog');
    return { success: true };
  } catch {
    return { success: false };
  }
}
