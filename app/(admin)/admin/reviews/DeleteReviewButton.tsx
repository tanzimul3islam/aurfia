"use client";

import { useTransition } from "react";
import { deleteReview } from "@/actions/reviews/adminReviews";
import { useRouter } from "next/navigation";

export default function DeleteReviewButton({
  reviewId,
}: {
  reviewId: number;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this review?")) return;
        startTransition(async () => {
          await deleteReview(reviewId);
          router.refresh();
        });
      }}
      className="shrink-0 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
