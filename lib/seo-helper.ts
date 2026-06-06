import { getSeoMetaByPage } from '@/actions/seo';
import type { Metadata } from 'next';

type MetaInput = {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
};

export async function buildPageMetadata(pageKey: string, fallback?: MetaInput): Promise<Metadata> {
  const meta = await getSeoMetaByPage(pageKey);

  if (!meta && !fallback) return {};

  const title = meta?.title || fallback?.title;
  const description = meta?.description || fallback?.description;
  const ogTitle = meta?.ogTitle || title;
  const ogDescription = meta?.ogDescription || description;
  const ogImage = meta?.ogImage || fallback?.image;
  const canonical = meta?.canonicalUrl || fallback?.canonical;
  const noindex = meta?.noindex ?? fallback?.noindex ?? false;

  const md: Metadata = {};

  if (title) {
    md.title = title;
  }

  if (description) {
    md.description = description;
  }

  const og: Record<string, unknown> = {};
  if (ogTitle) og.title = ogTitle;
  if (ogDescription) og.description = ogDescription;
  if (ogImage) {
    og.images = [{ url: ogImage, width: 1200, height: 630 }];
  }
  if (Object.keys(og).length > 0) {
    md.openGraph = og as Metadata['openGraph'];
  }

  if (noindex) {
    md.robots = { index: false, follow: false };
  }

  if (canonical) {
    md.alternates = { canonical };
  }

  return md;
}
