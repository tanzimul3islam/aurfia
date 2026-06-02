export const necklaceStyleSubcategories = [
  { name: 'Beaded', slug: 'beaded' },
  { name: 'Cuban', slug: 'cuban' },
  { name: 'Initials', slug: 'initials' },
  { name: 'Numbers', slug: 'number' },
  { name: 'Link', slug: 'link' },
  { name: 'Choker', slug: 'choker' },
  { name: 'Lariat', slug: 'lariat' },
  { name: 'Locket', slug: 'locket' },
  { name: 'Tassel', slug: 'tassel' },
] as const;

export const necklaceMaterialSubcategories = [
  { name: 'Topaz', slug: 'topaz' },
  { name: 'Crystal', slug: 'crystal' },
  { name: 'Cubic Zirconia', slug: 'cubic-zirconia' },
  { name: 'Gemstones', slug: 'gemstone' },
  { name: 'Beads', slug: 'bead' },
  { name: 'Resin', slug: 'resin' },
  { name: 'Pearl', slug: 'pearl' },
  { name: 'Moissanite', slug: 'moissanite' },
] as const;

export const necklaceSubcategories = [
  ...necklaceStyleSubcategories,
  ...necklaceMaterialSubcategories,
] as const;

export const necklaceMenuGroups = [
  { label: 'Shop by Style', items: necklaceStyleSubcategories },
  { label: 'Shop by Stone', items: necklaceMaterialSubcategories },
] as const;
