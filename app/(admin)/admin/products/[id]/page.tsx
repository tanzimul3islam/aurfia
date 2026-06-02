import { getProductById } from '@/actions/products/getProductById';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return (
      <div className="container py-12 text-center text-neutral-500">
        <h1 className="font-serif text-2xl mb-2">Product not found</h1>
        <Link href="/admin/products/list" className="text-sm text-neutral-600 underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/admin/products/list" className="text-sm text-neutral-500 hover:text-neutral-700 mb-6 inline-block">← Back to products</Link>
      <div className="bg-white border border-black/10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">{product.name}</h1>
            {product.sku && <p className="text-sm text-neutral-500">SKU: {product.sku}</p>}
          </div>
          <p className="text-xl font-medium">${(product.priceCents / 100).toFixed(2)} <span className="text-sm text-neutral-500">{product.currency}</span></p>
        </div>

        <p className="text-neutral-700 mb-6 leading-relaxed">{product.description}</p>

        <div className="text-sm text-neutral-500 mb-6">
          Stock: {product.stock > 0 ? <span className="text-green-700">{product.stock} available</span> : <span className="text-red-600">Unavailable</span>}
        </div>

        {product.images.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 text-sm text-neutral-600 uppercase tracking-wider">Images</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {product.images.map((img) => (
                <div key={img.id} className="border border-black/10 overflow-hidden">
                  <img src={img.url} alt="" className="w-full aspect-[4/5] object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
