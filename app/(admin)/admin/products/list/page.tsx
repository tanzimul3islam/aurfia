import { getProducts } from "@/actions/products/getProducts";
import Link from "next/link";

export default async function AdminProductList({ searchParams }: {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) {
  const page = Number((await searchParams).page) || 1;
  const limit = 20;

  const { products, total } = await getProducts(page, limit);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-12">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[32px] tracking-[-0.01em]">Products</h1>
          <p className="text-neutral-500 mt-1 text-sm">{total} product{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No products yet</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white border border-black/10 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-14 h-14 border border-black/10 overflow-hidden shrink-0 bg-neutral-50">
                    {product.images.length > 0 ? (
                      <img src={product.images[0].url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No img</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">${(product.priceCents / 100).toFixed(2)}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <Link href={`/admin/products/${product.id}`} className="btn btn-sm">View</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {page > 1 && <Link href={`?page=${page - 1}`} className="btn btn-sm">← Previous</Link>}
          <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page + 1}`} className="btn btn-sm">Next →</Link>}
        </div>
      )}
    </div>
  );
}
