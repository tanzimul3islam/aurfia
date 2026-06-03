"use server";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const updateOwnReview = async (
  reviewId: number,
  data: { rating: number; title?: string; content: string }
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("You must be signed in");
  }

  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId));

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== session.user.id) {
    throw new Error("You can only edit your own reviews");
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  await db
    .update(reviews)
    .set({
      rating: data.rating,
      title: data.title ?? null,
      content: data.content,
    })
    .where(eq(reviews.id, reviewId));

  revalidatePath(`/product/${review.productId}`);
};
