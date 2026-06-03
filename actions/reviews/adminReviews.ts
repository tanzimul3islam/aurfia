"use server";

import { db } from "@/lib/db";
import { reviews, products } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { isUserAdmin } from "@/actions/auth/isUserAdmin";
import { isSuperAdminSession } from "@/actions/auth/isSuperAdminSession";
import { revalidatePath } from "next/cache";

export const getAllReviews = async () => {
  const admin = await isUserAdmin();
  const superAdmin = await isSuperAdminSession();
  if (!admin && !superAdmin.isLoggedIn) {
    throw new Error("Unauthorized");
  }

  return db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      productTitle: products.productTitle,
      userName: reviews.userName,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.createdAt));
};

export const deleteReview = async (reviewId: number) => {
  const admin = await isUserAdmin();
  const superAdmin = await isSuperAdminSession();
  if (!admin && !superAdmin.isLoggedIn) {
    throw new Error("Unauthorized");
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId));
  revalidatePath("/admin/reviews");
};
