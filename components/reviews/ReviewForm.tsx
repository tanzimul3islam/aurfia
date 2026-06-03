"use client";

import { useState } from "react";
import { createReview } from "@/actions/reviews/createReview";
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productId, onReviewSubmitted }: { productId: number; onReviewSubmitted?: () => void }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!content.trim()) {
      setError("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        productId,
        rating,
        title: title.trim() || undefined,
        content: content.trim(),
      });
      setSuccess(true);
      setRating(0);
      setTitle("");
      setContent("");
      onReviewSubmitted?.();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-zinc-100 pt-6 mt-8">
      <h3 className="font-medium mb-4">Write a Review</h3>

      {success && (
        <p className="text-sm text-emerald-600 mb-4">
          Your review has been submitted. Thank you!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm mb-1 block">Rating</label>
          <StarRating rating={rating} interactive onRate={setRating} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Review title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-3 border border-zinc-200 rounded-none text-sm focus:outline-none focus:border-zinc-900"
          />
        </div>

        <div>
          <textarea
            placeholder="Write your review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            className="w-full px-3 py-2 border border-zinc-200 rounded-none text-sm focus:outline-none focus:border-zinc-900 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-6 bg-zinc-900 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
