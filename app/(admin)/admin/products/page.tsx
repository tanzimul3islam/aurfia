import Link from "next/link";

export default function AdminProducts() {
  return (
    <div className="max-w-3xl">
        <h1 className="font-serif text-[32px] tracking-[-0.01em] mb-2">Products</h1>
        <p className="text-neutral-600 mb-10">Manage your product catalog.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/products/list" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Manage Products</h3>
            <p className="text-sm text-neutral-500">View and manage all products</p>
          </Link>

          <Link href="/admin/products/new" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Add Product</h3>
            <p className="text-sm text-neutral-500">Create a new product with images</p>
          </Link>

          <Link href="/admin/products/import" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Bulk Import</h3>
            <p className="text-sm text-neutral-500">Import products from a CSV file</p>
          </Link>

          <Link href="/admin/media" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Media Library</h3>
            <p className="text-sm text-neutral-500">Upload and browse Cloudinary images</p>
          </Link>
        </div>
    </div>
  );
}
