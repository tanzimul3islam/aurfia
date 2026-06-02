export const braceletStyleSubcategories = [
  { name: 'Beaded', slug: 'beaded' },
  { name: 'Adjustable', slug: 'adjustable' },
  { name: 'Link', slug: 'link' },
  { name: 'Charm', slug: 'charm' },
  { name: 'Ring Bracelet', slug: 'ring' },
] as const;

export const braceletMaterialSubcategories = [
  { name: 'Crystal', slug: 'crystal' },
  { name: 'Cubic Zirconia', slug: 'cubic-zirconia' },
  { name: 'Gemstones', slug: 'gemstone' },
  { name: 'Beads', slug: 'bead' },
  { name: 'Pearls', slug: 'pearl' },
  { name: 'Moissanite', slug: 'moissanite' },
] as const;

export const braceletSubcategories = [
  ...braceletStyleSubcategories,
  ...braceletMaterialSubcategories,
] as const;

export const braceletMenuGroups = [
  { label: 'Shop by Style', items: braceletStyleSubcategories },
  { label: 'Shop by Stone', items: braceletMaterialSubcategories },
] as const;
