'use client';

import { Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/products/createProduct';
import { updateProduct } from '@/actions/products/updateProduct';
import { uploadProductImage } from '@/actions/products/uploadImage';

interface ImageItem {
  url: string;
  id: string;
}

interface VariantItem {
  tempId: string;
  title: string;
  price: string;
  sellingPrice: string;
  imageUrl: string;
}

interface ProductFormData {
  productTitle: string;
  description: string;
  sellingPrice: string;
  priceAmount: string;
  category: string;
  imageUrls: string[];
  metaTitle: string;
  metaDescription: string;
}

interface Props {
  initialData?: ProductFormData;
  initialVariants?: VariantItem[];
  productId?: number;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, initialVariants, productId, isEdit }: Props) {
  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      productTitle: '',
      description: '',
      sellingPrice: '',
      priceAmount: '',
      category: '',
      imageUrls: [],
      metaTitle: '',
      metaDescription: '',
    },
  );
  const [images, setImages] = useState<ImageItem[]>(
    (initialData?.imageUrls || []).map((url, i) => ({ url, id: `existing-${i}` })),
  );
  const [variants, setVariants] = useState<VariantItem[]>(initialVariants || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const variantFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const result = await uploadProductImage(fd);
        setImages((prev) => [
          ...prev,
          { url: result.url, id: crypto.randomUUID() },
        ]);
      } catch {
        console.error('Failed to upload image');
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleVariantImageUpload = async (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    try {
      const result = await uploadProductImage(fd);
      setVariants((prev) =>
        prev.map((v) =>
          v.tempId === tempId ? { ...v, imageUrl: result.url } : v,
        ),
      );
    } catch {
      console.error('Failed to upload variant image');
    }
    if (variantFileRefs.current[tempId]) variantFileRefs.current[tempId]!.value = '';
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        title: '',
        price: '',
        sellingPrice: '',
        imageUrl: '',
      },
    ]);
  };

  const updateVariant = (tempId: string, field: keyof VariantItem, value: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)),
    );
  };

  const removeVariant = (tempId: string) => {
    setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();
    fd.append('product_title', form.productTitle);
    fd.append('description', form.description);
    fd.append('selling_price', form.sellingPrice);
    fd.append('price_amount', form.priceAmount);
    fd.append('category', form.category);
    fd.append('image_urls', JSON.stringify(images.map((img) => img.url)));
    fd.append('variants', JSON.stringify(variants.map(({ tempId, ...v }) => v)));
    fd.append('meta_title', form.metaTitle);
    fd.append('meta_description', form.metaDescription);

    try {
      if (isEdit && productId) {
        await updateProduct(fd, productId);
      } else {
        await createProduct(fd);
      }
      router.push('/admin/products/list');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-medium text-sm text-neutral-500 uppercase tracking-wider">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              name="productTitle"
              value={form.productTitle}
              onChange={handleChange}
              required
              className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30 resize-vertical"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Selling Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            name="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={form.sellingPrice}
            onChange={handleChange}
            required
            className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Compare-at Price ($)
          </label>
          <input
            name="priceAmount"
            type="number"
            step="0.01"
            min="0"
            value={form.priceAmount}
            onChange={handleChange}
            className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Earrings, Rings, Necklaces"
            className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium text-sm text-neutral-500 uppercase tracking-wider pt-2">
            Variants / Options
          </h3>

          {variants.length === 0 && (
            <p className="text-sm text-neutral-400">No variants added yet.</p>
          )}

          {variants.map((v) => (
            <div key={v.tempId} className="border border-black/10 p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Title</label>
                    <input
                      value={v.title}
                      onChange={(e) => updateVariant(v.tempId, 'title', e.target.value)}
                      placeholder="e.g. Size 7, Gold"
                      className="w-full border border-black/10 px-2 py-1.5 text-sm focus:outline-none focus:border-black/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={v.price}
                      onChange={(e) => updateVariant(v.tempId, 'price', e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-black/10 px-2 py-1.5 text-sm focus:outline-none focus:border-black/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={v.sellingPrice}
                      onChange={(e) => updateVariant(v.tempId, 'sellingPrice', e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-black/10 px-2 py-1.5 text-sm focus:outline-none focus:border-black/30"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(v.tempId)}
                  className="shrink-0 text-xs text-red-500 hover:text-red-700 pt-5"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-3">
                {v.imageUrl ? (
                  <div className="relative w-12 h-12 border border-black/10 overflow-hidden group">
                    <img src={v.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => updateVariant(v.tempId, 'imageUrl', '')}
                      className="absolute top-0.5 right-0.5 bg-white/80 rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="w-12 h-12 border border-dashed border-black/20 flex items-center justify-center cursor-pointer hover:border-black/40 text-neutral-400 text-lg">
                    +
                    <input
                      ref={(el) => { variantFileRefs.current[v.tempId] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(v.tempId, e)}
                      className="hidden"
                    />
                  </label>
                )}
                <span className="text-xs text-neutral-400">Variant image (optional)</span>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-neutral-600 border border-dashed border-black/20 px-4 py-2 hover:border-black/40 transition-colors"
          >
            + Add Variant
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium text-sm text-neutral-500 uppercase tracking-wider pt-2">
            Images
          </h3>

          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative w-24 h-24 border border-black/10 overflow-hidden group">
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}

            {uploading && (
              <div className="w-24 h-24 border border-black/10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            )}

            <label className="w-24 h-24 border border-dashed border-black/20 flex items-center justify-center cursor-pointer hover:border-black/40 transition-colors text-neutral-400 hover:text-neutral-600">
              <span className="text-2xl">+</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-xs text-neutral-400">
            Upload images to Cloudinary. Supported: JPG, PNG, WebP.
          </p>
        </div>

        {/* SEO section */}
        <div className="md:col-span-2 space-y-4">
          <details className="group">
            <summary className="font-medium text-sm text-neutral-500 uppercase tracking-wider pt-2 cursor-pointer hover:text-neutral-700">
              SEO Settings
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Title (max. 60 chars)
                </label>
                <input
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  placeholder="Leave empty to use product title"
                  className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
                />
                <p className={`text-xs mt-1 ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-neutral-500'}`}>
                  {form.metaTitle.length}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Description (max. 160 chars)
                </label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  placeholder="Brief description for search engine results"
                  className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30 resize-none"
                />
                <p className={`text-xs mt-1 ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-neutral-500'}`}>
                  {form.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="border-t border-black/10 pt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#0E0E0E] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : isEdit
              ? 'Update Product'
              : 'Create Product'}
        </button>

        <a
          href="/admin/products/list"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
