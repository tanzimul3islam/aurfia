export const chainsSubcategories = [
  { name: 'All Chains', slug: 'chains' },
] as const;

export const chainsMenuGroups = [
  { label: 'Shop Chains', items: chainsSubcategories },
] as const;
