import { getProductById } from '@/actions/products/getProductById';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="container py-12 text-center text-neutral-500">
        <h1 className="font-serif text-2xl mb-2">Product not found</h1>
        <Link href="/admin/products/list" className="text-sm underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/admin/products/list"
        className="text-sm text-neutral-500 hover:text-neutral-700 mb-6 inline-block"
      >
        ← Back to products
      </Link>

      <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">
        Edit Product
      </h1>
      <p className="text-neutral-500 text-sm mb-8">{product.name}</p>

      <div className="bg-white border border-black/10 p-6 md:p-8">
        <ProductForm
          isEdit
          productId={product.id}
          initialData={{
            productTitle: product.name,
            description: product.description,
            sellingPrice: (product.priceCents / 100).toFixed(2),
            priceAmount: product.compareAtCents
              ? (product.compareAtCents / 100).toFixed(2)
              : '',
            category: product.category || '',
            imageUrls: product.images.map((img) => img.url),
          }}
          initialVariants={product.variants.map((v) => ({
            tempId: `existing-${v.id}`,
            title: v.title || '',
            price: v.priceCents ? (v.priceCents / 100).toFixed(2) : '',
            sellingPrice: v.sellingPriceCents
              ? (v.sellingPriceCents / 100).toFixed(2)
              : '',
            imageUrl: v.imageUrl || '',
          }))}
        />
      </div>
    </div>
  );
}
