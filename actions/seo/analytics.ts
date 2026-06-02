'use server';

import { db } from '@/lib/db';
import { analyticsSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function saveAnalyticsSettings(gaCode: string, enabled: boolean) {
  try {
    await db
      .insert(analyticsSettings)
      .values({
        id: 'default',
        gaCode,
        enabled,
      })
      .onConflictDoUpdate({
        target: analyticsSettings.id,
        set: { gaCode, enabled },
      });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export async function getAnalyticsSettings() {
  const result = await db.select().from(analyticsSettings).limit(1);
  return result[0] || { id: 'default', gaCode: '', enabled: false };
}
