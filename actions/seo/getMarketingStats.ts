'use server';

import { db } from '@/lib/db';
import { orders as ordersTable, orderItems } from '@/db/schema';
import { desc, inArray, gte } from 'drizzle-orm';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const getDateFromTimeRange = (range: TimeRange) => {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '1y':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
    default:
      return new Date(0).toISOString();
  }
};

export const getMarketingStats = async (timeRange: TimeRange) => {
  const fromDate = getDateFromTimeRange(timeRange);

  const ordersData = await db
    .select()
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, fromDate))
    .orderBy(desc(ordersTable.createdAt));

  const totalOrders = ordersData.length;
  const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const orderIds = ordersData.map((o) => o.id);
  let items: (typeof orderItems.$inferSelect)[] = [];
  if (orderIds.length > 0) {
    items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));
  }

  const topProductsMap: Record<string, { name: string; sales: number; revenue: number }> = {};
  items.forEach((item) => {
    const qty = item.quantity || 0;
    const price = item.price || 0;
    const key = item.name ?? 'Unknown';
    if (!topProductsMap[key]) topProductsMap[key] = { name: key, sales: 0, revenue: 0 };
    topProductsMap[key].sales += qty;
    topProductsMap[key].revenue += price * qty;
  });

  const topProducts = Object.values(topProductsMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate: 0,
    topProducts,
    trafficSources: [],
  };
};
