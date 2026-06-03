"use client";

import { useEffect, useState } from "react";
import { getProductReviews } from "@/actions/reviews/getProductReviews";
import type { ProductReviewsResult } from "@/actions/reviews/getProductReviews";
import { deleteOwnReview } from "@/actions/reviews/deleteOwnReview";
import { updateOwnReview } from "@/actions/reviews/updateOwnReview";
import StarRating from "./StarRating";
import { useSession } from "@/lib/auth-client";
import { Pencil, Trash2, X, Check } from "lucide-react";

export default function ReviewList({ productId, refreshKey = 0 }: { productId: number; refreshKey?: number }) {
  const { data: session } = useSession();
  const [data, setData] = useState<ProductReviewsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const refresh = () => {
    getProductReviews(productId).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [productId, refreshKey]);

  const startEdit = (review: ProductReviewsResult["reviews"][number]) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditTitle(review.title ?? "");
    setEditContent(review.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (reviewId: number) => {
    try {
      await updateOwnReview(reviewId, {
        rating: editRating,
        title: editTitle || undefined,
        content: editContent,
      });
      setEditingId(null);
      refresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      setConfirmDeleteId(null);
      await deleteOwnReview(reviewId);
      refresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) {
    return <div className="text-sm text-zinc-400">Loading reviews...</div>;
  }

  if (!data || data.totalReviews === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <>
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <span className="text-2xl font-medium">{data.averageRating}</span>
        <div>
          <StarRating rating={data.averageRating} />
          <span className="text-sm text-zinc-500">
            {data.totalReviews} review{data.totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Reviews */}
      {data.reviews.map((review) => {
        const isOwn = session?.user.id === review.userId;
        const isEditing = editingId === review.id;

        if (isEditing) {
          return (
            <div key={review.id} className="pb-4 border-b border-zinc-100 space-y-3">
              <div>
                <StarRating rating={editRating} interactive onRate={setEditRating} size={16} />
              </div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Review title (optional)"
                className="w-full h-9 px-3 border border-zinc-200 rounded-none text-sm focus:outline-none focus:border-zinc-900"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 border border-zinc-200 rounded-none text-sm focus:outline-none focus:border-zinc-900 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(review.id)}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                >
                  <Check size={14} /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          );
        }

        return (
          <div key={review.id} className="pb-4 border-b border-zinc-100 last:border-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} size={14} />
                <span className="text-sm font-medium">{review.userName}</span>
                {review.isVerifiedPurchase && (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 border border-emerald-200 px-1.5 py-0.5">
                    Verified
                  </span>
                )}
              </div>

              {isOwn && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(review)}
                    className="text-zinc-400 hover:text-zinc-700 transition-colors"
                    aria-label="Edit review"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(review.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                    aria-label="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {review.title && (
              <h4 className="text-sm font-medium mt-1">{review.title}</h4>
            )}
            <p className="text-sm text-zinc-600 mt-0.5 leading-relaxed">
              {review.content}
            </p>
            {review.createdAt && (
              <p className="text-xs text-zinc-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        );
      })}
    </div>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <p className="text-sm text-zinc-800 mb-5">Delete this review?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="h-9 px-4 text-xs text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="h-9 px-4 text-xs text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
