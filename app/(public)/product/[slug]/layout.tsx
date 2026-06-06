import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/product-helpers';
import { buildPageMetadata } from '@/lib/seo-helper';

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildPageMetadata('Product Detail');
  }

  const title = `${product.name} | AURFIA`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Shop ${product.name} at AURFIA. Premium sterling silver jewelry.`;
  const image = product.images[0]?.url;

  const metaFromDb = await buildPageMetadata('Product Detail');

  return {
    title,
    description,
    openGraph: {
      title: product.name,
      description: description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      ...((metaFromDb.openGraph as Record<string, unknown>) || {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${slug}`,
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
