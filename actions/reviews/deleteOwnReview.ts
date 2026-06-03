"use server";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const deleteOwnReview = async (reviewId: number) => {
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
    throw new Error("You can only delete your own reviews");
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId));

  revalidatePath(`/product/${review.productId}`);
};
