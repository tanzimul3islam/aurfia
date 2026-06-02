'use client'

export default function Error() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h2 className="font-serif text-[32px] md:text-[40px] mb-4">Something went wrong</h2>
        <p className="text-neutral-600 mb-8">Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="h-11 px-6 bg-black text-white rounded-none hover:opacity-95 text-sm font-medium"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
