import { getAllProducts } from '@/lib/product-helpers'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticPages = [
    '',
    '/shop',
    '/search',
    '/bag',
    '/checkout',
    '/checkout/success',
    '/terms',
    '/privacy-policy',
    '/legal-notice',
    '/contact',
    '/shipping-returns',
    '/wishlist',
  ]

  let dbProducts: any[] = []
  try {
    dbProducts = await getAllProducts()
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  const sitemap: MetadataRoute.Sitemap = [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    })),
    ...dbProducts.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  return sitemap
}
