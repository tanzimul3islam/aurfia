'use server';

/**
 * Scrapes a Tomade.com product page and returns CSV-ready data
 */
export async function scrapeTomadeProducts(url: string) {
  if (!url) throw new Error('No URL provided');

  try {
    // Fetch HTML
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch URL');
    const html = await response.text();

    // Single product object
    const product: {
      name: string;
      description: string;
      price: string;
      images: string[];
    } = {
      name: '',
      description: '',
      price: '',
      images: [],
    };

    // Name extraction
    const nameMatch = html.match(/<h1[^>]*>([^<]+)</) || html.match(/<title>([^<]+)</);
    if (nameMatch) product.name = nameMatch[1].trim();

    // Price extraction
    const priceMatch = html.match(/\$\s*([0-9.]+)/) || html.match(/([0-9]+\.?[0-9]*)\s*USD/);
    if (priceMatch) product.price = priceMatch[1];

    // Description extraction (meta description)
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    if (descMatch) product.description = descMatch[1].trim();

    // Images extraction
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
    for (const match of imgMatches) {
      const srcMatch = match.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1].includes('tomade.com')) {
        product.images.push(srcMatch[1]);
      }
    }

    // Prepare CSV row
    const csvRow = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: '50', // default
      image1: product.images[0] || '',
      image2: product.images[1] || '',
      sku: `SKU-${Date.now()}`,
    };

    return { success: true, csvRow, message: 'Product scraped successfully' };
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message || 'Scraping failed');
  }
}
