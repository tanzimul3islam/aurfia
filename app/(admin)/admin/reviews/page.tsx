import { getAllReviews, deleteReview } from "@/actions/reviews/adminReviews";
import DeleteReviewButton from "./DeleteReviewButton";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <h1 className="font-serif text-[28px] mb-1">Reviews</h1>
      <p className="text-sm text-zinc-500 mb-8">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {reviews.length === 0 && (
          <p className="text-sm text-zinc-400">No reviews yet.</p>
        )}

        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-zinc-100 p-4 flex items-start justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{r.userName}</span>
                <span className="text-xs text-zinc-400">
                  {new Date(r.createdAt!).toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < r.rating ? "text-amber-400" : "text-zinc-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mb-1">
                Product: {r.productTitle ?? `#${r.productId}`}
              </p>
              {r.title && (
                <p className="text-sm font-medium">{r.title}</p>
              )}
              <p className="text-sm text-zinc-600">{r.content}</p>
            </div>
            <DeleteReviewButton reviewId={r.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
