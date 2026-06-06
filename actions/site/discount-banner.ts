'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { isSuperAdminSession } from '../auth/isSuperAdminSession';
import { isUserAdmin } from '../auth/isUserAdmin';

export async function getDiscountBanner() {
  const result = await db.select().from(siteSettings).limit(1);
  return result[0] || {
    id: 'default',
    discountBannerText: '',
    discountBannerEnabled: false,
    discountBannerLink: null,
    discountBannerBgColor: '#000000',
    discountBannerTextColor: '#ffffff',
  };
}

export async function saveDiscountBanner(data: {
  discountBannerText: string;
  discountBannerEnabled: boolean;
  discountBannerLink: string;
  discountBannerBgColor: string;
  discountBannerTextColor: string;
}) {
  const superAdmin = await isSuperAdminSession();
  const admin = await isUserAdmin();
  if (!superAdmin.isLoggedIn && !admin) throw new Error('Unauthorized');

  await db
    .insert(siteSettings)
    .values({ id: 'default', ...data })
    .onConflictDoUpdate({ target: siteSettings.id, set: data });

  return { success: true };
}
