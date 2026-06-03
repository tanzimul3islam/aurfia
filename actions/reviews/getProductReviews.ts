"use server";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type ProductReviewsResult = {
  reviews: {
    id: number;
    userId: string;
    userName: string;
    rating: number;
    title: string | null;
    content: string;
    isVerifiedPurchase: boolean | null;
    createdAt: string | null;
  }[];
  averageRating: number;
  totalReviews: number;
};

export const getProductReviews = async (
  productId: number
): Promise<ProductReviewsResult> => {
  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(sql`${reviews.createdAt} DESC`);

  const rows = result.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    title: r.title,
    content: r.content,
    isVerifiedPurchase: r.isVerifiedPurchase,
    createdAt: r.createdAt,
  }));

  const avg =
    rows.length > 0
      ? rows.reduce((sum, r) => sum + r.rating, 0) / rows.length
      : 0;

  return {
    reviews: rows,
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: rows.length,
  };
};
