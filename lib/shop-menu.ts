import { earringsMenuGroups, necklaceMenuGroups, ringsMenuGroups, braceletMenuGroups, pendantsMenuGroups, chainsMenuGroups, banglesMenuGroups, ankletsMenuGroups, jewelrySetsMenuGroups, hairJewelryMenuGroups } from '@/lib/categories';

export type ShopMenuCategory = {
  id: string;
  label: string;
  href: string;
  groups: ReadonlyArray<{
    label: string;
    items: ReadonlyArray<{ name: string; slug: string }>;
  }>;
};

export const shopMenuCategories: ReadonlyArray<ShopMenuCategory> = [
  {
    id: 'earrings',
    label: 'Earrings',
    href: '/shop?category=earrings',
    groups: earringsMenuGroups,
  },
  {
    id: 'necklace',
    label: 'Necklaces',
    href: '/shop?category=necklaces',
    groups: necklaceMenuGroups,
  },
  {
    id: 'rings',
    label: 'Rings',
    href: '/shop?category=rings',
    groups: ringsMenuGroups,
  },
  {
    id: 'bracelet',
    label: 'Bracelet',
    href: '/shop?category=bracelet',
    groups: braceletMenuGroups,
  },
  {
    id: 'pendants',
    label: 'Pendants',
    href: '/shop?category=pendants',
    groups: pendantsMenuGroups,
  },
  {
    id: 'chains',
    label: 'Chains',
    href: '/shop?category=chains',
    groups: chainsMenuGroups,
  },
  {
    id: 'bangles',
    label: 'Bangles',
    href: '/shop?category=bangles',
    groups: banglesMenuGroups,
  },
  {
    id: 'anklets',
    label: 'Anklets',
    href: '/shop?category=anklets',
    groups: ankletsMenuGroups,
  },
  {
    id: 'jewelry-sets',
    label: 'Jewelry Sets',
    href: '/shop?category=jewelry-sets',
    groups: jewelrySetsMenuGroups,
  },
  {
    id: 'hair-jewelry',
    label: 'Hair Jewelry',
    href: '/shop?category=hair-jewelry',
    groups: hairJewelryMenuGroups,
  },
] as const;
