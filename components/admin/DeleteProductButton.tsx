'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteProduct } from '@/actions/products/deleteProduct';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-sm btn-red">
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm mx-4 p-6 shadow-lg">
            <h3 className="font-medium text-base mb-2">Delete Product</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pending) return;
                  const fd = new FormData(e.currentTarget);
                  startTransition(async () => {
                    await deleteProduct(fd);
                    setOpen(false);
                  });
                }}
              >
                <input type="hidden" name="id" value={productId} />
                <button type="submit" disabled={pending} className="btn btn-sm btn-red disabled:opacity-50">
                  {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Delete'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
