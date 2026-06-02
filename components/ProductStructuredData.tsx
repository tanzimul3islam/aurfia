'use client';

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    description: string;
    price_cents: number;
    currency: string;
    stock: number;
    sku: string | null;
    images?: { url: string; alt?: string }[];
  };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map(img => img.url) || [],
    offers: {
      '@type': 'Offer',
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: product.currency || 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      condition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'AURFIA',
      },
    },
    brand: {
      '@type': 'Brand',
      name: 'AURFIA',
    },
    category: 'Fashion',
    sku: product.sku || String(product.id),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
