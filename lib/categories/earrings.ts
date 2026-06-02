export const earringsStyleSubcategories = [
  { name: 'Studs', slug: 'stud' },
  { name: 'Drops', slug: 'drop' },
  { name: 'Threaders', slug: 'threader' },
  { name: 'Ear Cuffs', slug: 'ear-cuff' },
  { name: 'Singles', slug: 'single' },
  { name: 'Clusters', slug: 'cluster' },
  { name: 'Clip-Ons', slug: 'clip' },
  { name: 'Hooks', slug: 'hook' },
  { name: 'Huggies', slug: 'huggie' },
  { name: 'Hoops', slug: 'hoop' },
] as const;

export const earringsMaterialSubcategories = [
  { name: 'Topaz', slug: 'topaz' },
  { name: 'Crystal', slug: 'crystal' },
  { name: 'Pearl', slug: 'pearl' },
  { name: 'Cubic Zirconia', slug: 'cubic-zirconia' },
  { name: 'Opal', slug: 'opal' },
  { name: 'Gemstones', slug: 'gemstone' },
  { name: 'Moissanite', slug: 'moissanite' },
  { name: 'Beads', slug: 'bead' },
] as const;

export const earringsSubcategories = [
  ...earringsStyleSubcategories,
  ...earringsMaterialSubcategories,
] as const;

export const earringsMenuGroups = [
  { label: 'Shop by Style', items: earringsStyleSubcategories },
  { label: 'Shop by Stone', items: earringsMaterialSubcategories },
] as const;

export type EarringsSubcategory = typeof earringsSubcategories[number];
