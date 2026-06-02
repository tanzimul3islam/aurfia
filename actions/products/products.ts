'use server';

export async function createProductAction(_formData: FormData) {
  // product.db is read-only. New products are added via the import pipeline.
  throw new Error('Adding products directly is not supported. Use the import system.');
}
