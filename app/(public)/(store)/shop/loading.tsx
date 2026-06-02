import SkeletonProductCard from "@/components/SkeletonProductCard";

export default function Loading() {
  return (
    <div className="max-w-none pb-16">
      <div className="px-6 flex items-end justify-between mb-4">
        <h2 className="font-serif text-[32px] md:text-[40px]">Shop</h2>
      </div>

      <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </div>
  )
}
