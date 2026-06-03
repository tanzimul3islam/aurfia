"use server";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const createReview = async (formData: {
  productId: number;
  rating: number;
  title?: string;
  content: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("You must be signed in to leave a review");
  }

  if (formData.rating < 1 || formData.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  await db.insert(reviews).values({
    productId: formData.productId,
    userId: session.user.id,
    userName: session.user.name,
    rating: formData.rating,
    title: formData.title ?? null,
    content: formData.content,
    isVerifiedPurchase: false,
  });

  revalidatePath(`/product/${formData.productId}`);
};
