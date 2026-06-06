import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">
        Add Product
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Create a new product in your catalog.
      </p>

      <div className="bg-white border border-black/10 p-6 md:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
