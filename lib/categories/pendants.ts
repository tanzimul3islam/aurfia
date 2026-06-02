export const pendantsSubcategories = [
  { name: 'All Pendants', slug: 'pendants' },
] as const;

export const pendantsMenuGroups = [
  { label: 'Shop Pendants', items: pendantsSubcategories },
] as const;
