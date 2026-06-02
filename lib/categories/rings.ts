export const ringsStyleSubcategories = [
  { name: 'Band', slug: 'band' },
  { name: 'Statement', slug: 'statement' },
  { name: 'Engagement', slug: 'engagement' },
  { name: 'Couple', slug: 'couple' },
  { name: 'Men\'s', slug: 'mens' },
  { name: 'Signet', slug: 'signet' },
  { name: 'Midi', slug: 'midi' },
  { name: 'Multistone', slug: 'multistone' },
  { name: 'Beaded', slug: 'bead' },
] as const;

export const ringsMaterialSubcategories = [
  { name: 'Topaz', slug: 'topaz' },
  { name: 'Crystal', slug: 'crystal' },
  { name: 'Cubic Zirconia', slug: 'cubic-zirconia' },
  { name: 'Gemstones', slug: 'gemstone' },
  { name: 'Moissanite', slug: 'moissanite' },
  { name: 'Pearls', slug: 'pearl' },
] as const;

export const ringsSubcategories = [
  ...ringsStyleSubcategories,
  ...ringsMaterialSubcategories,
] as const;

export const ringsMenuGroups = [
  { label: 'Shop by Style', items: ringsStyleSubcategories },
  { label: 'Shop by Stone', items: ringsMaterialSubcategories },
] as const;
