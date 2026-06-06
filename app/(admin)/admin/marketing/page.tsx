import Link from "next/link";

export default function AdminMarketing() {
  return (
    <div className="max-w-4xl">
        <h1 className="h2 mb-2">Marketing</h1>
        <p className="text-neutral-600 mb-8">Marketing tools for SEO, analytics, and statistics.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SEO Tools */}
          <Link href="/admin/marketing/seo" className="bg-white border border-black/10 rounded-sm p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-2">SEO Tools</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Edit meta tags, manage sitemap, search engine optimization.
            </p>
            <span className="text-sm text-blue-600">Manage →</span>
          </Link>

          {/* Analytics */}
          <Link href="/admin/marketing/analytics" className="bg-white border border-black/10 rounded-sm p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-2">Analytics</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Google Analytics integration, visitor tracking, conversion measurement.
            </p>
            <span className="text-sm text-blue-600">Configure →</span>
          </Link>

          {/* Marketing Statistics */}
          <Link href="/admin/marketing/stats" className="bg-white border border-black/10 rounded-sm p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-2">Marketing Statistics</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Sales, conversions, customer analysis, marketing ROI.
            </p>
            <span className="text-sm text-blue-600">View →</span>
          </Link>
        </div>

        {/* Quick Marketing Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-sm p-6">
          <h3 className="font-medium mb-2 text-blue-800">Marketing Tips</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>SEO:</strong> Use relevant keywords in product descriptions</p>
            <p>• <strong>Analytics:</strong> Track your visitor sources and conversions</p>
            <p>• <strong>Social Media:</strong> Share your products on Instagram and Facebook</p>
          </div>
        </div>
    </div>
  );
}
