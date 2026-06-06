'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadProductImage } from '@/actions/products/uploadImage';
import { getCloudinaryGallery } from '@/actions/products/importProductsFromCloudinary';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  url: string;
  public_id: string;
}

export default function MediaPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const images = await getCloudinaryGallery();
      setGallery(images);
    } catch {
      console.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        await uploadProductImage(fd);
      } catch {
        console.error('Failed to upload image');
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    loadGallery();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setSelected(url);
    setTimeout(() => setSelected(null), 1500);
  };

  return (
    <div className="container max-w-5xl py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">
            Media Library
          </h1>
          <p className="text-neutral-500 text-sm">
            Upload and manage product images on Cloudinary.
          </p>
        </div>

        <label className="bg-[#0E0E0E] text-white px-4 py-2 text-sm cursor-pointer hover:opacity-90 inline-flex items-center gap-2">
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="bg-white border border-black/10 p-12 text-center text-neutral-400">
          <p className="text-sm">
            No images yet. Upload your first product image.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map((img) => (
            <div
              key={img.public_id}
              className="relative group border border-black/10 overflow-hidden bg-neutral-50 cursor-pointer"
              style={{ aspectRatio: '1' }}
              onClick={() => copyUrl(img.url)}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {selected === img.url ? 'Copied!' : 'Click to copy URL'}
                </span>
              </div>
            </div>
          ))}

          {uploading && (
            <div className="border border-dashed border-black/20 flex items-center justify-center text-xs text-neutral-400">
              Uploading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
