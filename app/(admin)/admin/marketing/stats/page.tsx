'use client';
import { getMarketingStats } from '@/actions/seo/getMarketingStats';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { getMarketingStats } from '@/actions/getMarketingStats'; // server action

export default function AdminMarketingStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    setLoading(true);
    getMarketingStats(timeRange)
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [timeRange]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>;
  if (!stats) return null;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="h2">Marketing Stats</h1>
        <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)} className="border border-black/10 px-3 py-1.5 text-sm bg-white">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="text-sm text-neutral-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="text-sm text-neutral-600 mb-2">Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="text-sm text-neutral-600 mb-2">Avg Order Value</h3>
          <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="text-sm text-neutral-600 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="font-medium mb-4">Top Products</h3>
          <div className="space-y-4">
            {stats.topProducts.map((p: any) => (
              <div key={p.name} className="flex justify-between">
                <div>{p.name} ({p.sales} sales)</div>
                <div>${p.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="p-6 border rounded-sm bg-white">
          <h3 className="font-medium mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {stats.trafficSources.map((t: any) => (
              <div key={t.source} className="flex justify-between">
                <div className="flex-1">
                  <p>{t.source}</p>
                  <div className="bg-neutral-200 h-2 rounded-full mt-1">
                    <div className="bg-black h-2 rounded-full" style={{ width: `${t.percentage}%` }} />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p>{t.visitors}</p>
                  <p className="text-sm text-neutral-600">{t.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
