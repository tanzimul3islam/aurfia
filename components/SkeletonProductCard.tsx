export default function SkeletonProductCard() {
  return (
    <div>
      <div className="w-full bg-neutral-50" style={{aspectRatio: '4/5'}}>
        <div className="w-full h-full animate-pulse bg-neutral-100" />
      </div>
      <div className="pt-3 pb-4 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-4/5 bg-neutral-100 animate-pulse rounded-sm" />
            <div className="h-4 w-1/3 bg-neutral-100 animate-pulse rounded-sm" />
          </div>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <div className="w-8 h-8 bg-neutral-100 animate-pulse rounded-full" />
            <div className="w-8 h-8 bg-neutral-100 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
