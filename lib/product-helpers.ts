import { db } from '@/lib/db';
import { products, productImages, productBreadcrumbs, productOptions } from '@/db/schema';
import { eq, inArray, desc, like, asc } from 'drizzle-orm';

// ─── Types that match what the existing UI expects ─────────────────

export type ProductCardItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: string[];
};

export type ProductWithImages = {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  compareAtCents: number | null;
  stock: number;
  featured: boolean;
  category: string | null;
  subcategory: string | null;
  createdAt: Date;
  images: { id: number; url: string; alt: string | null; sort: number; productId: number }[];
};

export type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  compareAtCents: number | null;
  stock: number;
  featured: boolean;
  sku: string | null;
  category: string | null;
  subcategory: string | null;
  images: { id: number; url: string; sort: number; productId: number }[];
  variants: {
    id: number;
    title: string | null;
    priceCents: number;
    sellingPriceCents: number;
    imageUrl: string | null;
  }[];
};

// ─── Helpers ───────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-+/g, '-');
}

function toCents(amount: number | null): number {
  return Math.round((amount ?? 0) * 100);
}

export type CategoryNode = {
  name: string;
  slug: string;
  count: number;
  subcategories: { name: string; slug: string; count: number }[];
};

// ─── Queries ───────────────────────────────────────────────────────

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const allBreadcrumbs = await db.select().from(productBreadcrumbs);
  const map = new Map<string, { name: string; productIds: Set<number>; subcategories: Map<string, { name: string; productIds: Set<number> }> }>();

  for (const b of allBreadcrumbs) {
    if (b.sortOrder === 1 && b.breadcrumb) {
      if (!map.has(b.breadcrumb)) {
        map.set(b.breadcrumb, { name: b.breadcrumb, productIds: new Set(), subcategories: new Map() });
      }
      map.get(b.breadcrumb)!.productIds.add(b.productId);
    }
    if (b.sortOrder === 2 && b.breadcrumb) {
      const parent = allBreadcrumbs.find((x) => x.productId === b.productId && x.sortOrder === 1);
      if (parent?.breadcrumb && map.has(parent.breadcrumb)) {
        const cat = map.get(parent.breadcrumb)!;
        if (!cat.subcategories.has(b.breadcrumb)) {
          cat.subcategories.set(b.breadcrumb, { name: b.breadcrumb, productIds: new Set() });
        }
        cat.subcategories.get(b.breadcrumb)!.productIds.add(b.productId);
      }
    }
  }

  return Array.from(map.values())
    .filter((c) => c.productIds.size > 0)
    .map((c) => ({
      name: c.name,
      slug: slugify(c.name),
      count: c.productIds.size,
      subcategories: Array.from(c.subcategories.values())
        .filter((s) => s.productIds.size > 0)
        .map((s) => ({ name: s.name, slug: slugify(s.name), count: s.productIds.size }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllProducts(): Promise<ProductWithImages[]> {
  const dbProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.id));

  return attachImagesAndBreadcrumbs(dbProducts);
}

export async function getProductById(id: number): Promise<ProductDetail | null> {
  const [match] = await db.select().from(products).where(eq(products.id, id));
  if (!match) return null;

  const allBreadcrumbs = await db
    .select()
    .from(productBreadcrumbs)
    .where(eq(productBreadcrumbs.productId, match.id));

  const allImages = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, match.id))
    .orderBy(asc(productImages.sortOrder));

  const allOptions = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, match.id));

  const category = allBreadcrumbs.find((b) => b.sortOrder === 1)?.breadcrumb ?? null;
  const subcategory = allBreadcrumbs.find((b) => b.sortOrder === 2)?.breadcrumb ?? null;

  return buildProductDetail(match, slugify(match.productTitle ?? ''), category, subcategory, allImages, allOptions);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const allProducts = await db.select().from(products);
  const match = allProducts.find((p) => slugify(p.productTitle ?? '') === slug);
  if (!match) return null;

  const allBreadcrumbs = await db
    .select()
    .from(productBreadcrumbs)
    .where(eq(productBreadcrumbs.productId, match.id));

  const allImages = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, match.id))
    .orderBy(asc(productImages.sortOrder));

  const allOptions = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, match.id));

  const category = allBreadcrumbs.find((b) => b.sortOrder === 1)?.breadcrumb ?? null;
  const subcategory = allBreadcrumbs.find((b) => b.sortOrder === 2)?.breadcrumb ?? null;

  return buildProductDetail(match, slug, category, subcategory, allImages, allOptions);
}

function buildProductDetail(
  match: typeof products.$inferSelect,
  slug: string,
  category: string | null,
  subcategory: string | null,
  allImages: typeof productImages.$inferSelect[],
  allOptions: typeof productOptions.$inferSelect[],
): ProductDetail {
  return {
    id: match.id,
    name: match.productTitle ?? '',
    slug,
    description: match.description ?? '',
    priceCents: toCents(match.sellingPrice),
    currency: 'USD',
    compareAtCents: match.priceAmount ? toCents(match.priceAmount) : null,
    stock: match.minimumOrderQuantity ?? 0,
    featured: false,
    sku: match.sku ?? null,
    category,
    subcategory,
    images: allImages.map((img) => ({
      id: img.id,
      url: img.imageUrl ?? '',
      sort: img.sortOrder ?? 0,
      productId: img.productId,
    })),
    variants: allOptions.map((opt) => ({
      id: opt.id,
      title: opt.title ?? null,
      priceCents: toCents(opt.price),
      sellingPriceCents: toCents(opt.sellingPrice),
      imageUrl: opt.imageUrl ?? null,
    })),
  };
}

export async function getProductsByCategory(
  category?: string | null,
  subcategory?: string | null,
): Promise<ProductWithImages[]> {
  const allProducts = await db.select().from(products).orderBy(desc(products.id));
  const allBreadcrumbs = await db.select().from(productBreadcrumbs);

  // Filter by breadcrumbs
  let ids: Set<number>;

  if (category && subcategory) {
    const catIds = allBreadcrumbs
      .filter((b) => b.sortOrder === 1 && b.breadcrumb?.toLowerCase() === category.toLowerCase())
      .map((b) => b.productId);
    const subIds = allBreadcrumbs
      .filter((b) => b.sortOrder === 2 && b.breadcrumb?.toLowerCase().includes(subcategory.toLowerCase().replace(/-/g, ' ')))
      .map((b) => b.productId);
    ids = new Set(catIds.filter((id) => subIds.includes(id)));
  } else if (category) {
    ids = new Set(
      allBreadcrumbs
        .filter((b) => b.sortOrder === 1 && b.breadcrumb?.toLowerCase() === category.toLowerCase())
        .map((b) => b.productId),
    );
  } else {
    ids = new Set(allProducts.map((p) => p.id));
  }

  const filtered = allProducts.filter((p) => ids.has(p.id));
  return attachImagesAndBreadcrumbs(filtered);
}

export async function searchProducts(query: string): Promise<ProductWithImages[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const all = await db.select().from(products);
  const matched = all.filter(
    (p) =>
      p.productTitle?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.brandOrDesigner?.toLowerCase().includes(q),
  );

  return attachImagesAndBreadcrumbs(matched);
}

export async function getFavorites(slugs: string[]): Promise<ProductWithImages[]> {
  if (!slugs.length) return [];

  const all = await db.select().from(products);
  const matched = all.filter((p) => slugs.includes(slugify(p.productTitle ?? '')));
  return attachImagesAndBreadcrumbs(matched);
}

export async function getLatestProducts(limit = 8): Promise<ProductCardItem[]> {
  const dbProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.id))
    .limit(limit);

  const ids = dbProducts.map((p) => p.id);
  const allImages = ids.length
    ? await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, ids))
    : [];

  return dbProducts.map((p) => ({
    id: p.id,
    name: p.productTitle ?? '',
    slug: slugify(p.productTitle ?? ''),
    price: toCents(p.sellingPrice),
    images: allImages
      .filter((img) => img.productId === p.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img) => img.imageUrl ?? ''),
  }));
}

export async function getProductCardBySlug(slug: string): Promise<ProductCardItem | null> {
  const all = await db.select().from(products);
  const match = all.find((p) => slugify(p.productTitle ?? '') === slug);
  if (!match) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, match.id))
    .orderBy(asc(productImages.sortOrder));

  return {
    id: match.id,
    name: match.productTitle ?? '',
    slug,
    price: toCents(match.sellingPrice),
    images: images.map((img) => img.imageUrl ?? ''),
  };
}

// ─── Internal ──────────────────────────────────────────────────────

async function attachImagesAndBreadcrumbs(
  dbProducts: (typeof products.$inferSelect)[],
): Promise<ProductWithImages[]> {
  if (!dbProducts.length) return [];

  const ids = dbProducts.map((p) => p.id);

  const [allImages, allBreadcrumbs] = await Promise.all([
    ids.length
      ? db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, ids))
      : Promise.resolve([]),
    ids.length
      ? db
          .select()
          .from(productBreadcrumbs)
          .where(inArray(productBreadcrumbs.productId, ids))
      : Promise.resolve([]),
  ]);

  return dbProducts.map((p) => ({
    id: p.id,
    name: p.productTitle ?? '',
    slug: slugify(p.productTitle ?? ''),
    description: p.description ?? '',
    priceCents: toCents(p.sellingPrice),
    currency: 'USD',
    compareAtCents: p.priceAmount ? toCents(p.priceAmount) : null,
    stock: p.minimumOrderQuantity ?? 0,
    featured: false,
    category: allBreadcrumbs.find((b) => b.productId === p.id && b.sortOrder === 1)?.breadcrumb ?? null,
    subcategory: allBreadcrumbs.find((b) => b.productId === p.id && b.sortOrder === 2)?.breadcrumb ?? null,
    createdAt: new Date(),
    images: allImages
      .filter((img) => img.productId === p.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img, idx) => ({
        id: img.id,
        url: img.imageUrl ?? '',
        alt: null,
        sort: img.sortOrder ?? idx,
        productId: img.productId,
      })),
  }));
}

export async function getSliderImages(): Promise<string[]> {
  const allImages = await db
    .select({ url: productImages.imageUrl })
    .from(productImages)
    .where(eq(productImages.sortOrder, 0))
    .limit(5);

  return allImages.map((i) => i.url ?? '').filter(Boolean);
}
