import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-serif text-[48px] md:text-[64px] mb-4">404</h1>
        <h2 className="font-serif text-[32px] md:text-[40px] mb-4">Page not found</h2>
        <p className="text-neutral-600 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-block h-11 px-6 bg-black text-white rounded-none hover:opacity-95 text-sm font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
