import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        <h1 className="font-serif text-[32px] tracking-[-0.01em] mb-2">Dashboard</h1>
        <p className="text-neutral-600 mb-10">Overview and quick access to store management.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/orders" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Orders</h3>
            <p className="text-sm text-neutral-500">View and manage customer orders</p>
          </Link>
          <Link href="/admin/products/list" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Products</h3>
            <p className="text-sm text-neutral-500">Browse and manage your catalog</p>
          </Link>
          <Link href="/admin/marketing" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Marketing</h3>
            <p className="text-sm text-neutral-500">SEO, analytics, and stats</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
