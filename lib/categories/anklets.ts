export const ankletsSubcategories = [
  { name: 'All Anklets', slug: 'anklets' },
] as const;

export const ankletsMenuGroups = [
  { label: 'Shop Anklets', items: ankletsSubcategories },
] as const;
