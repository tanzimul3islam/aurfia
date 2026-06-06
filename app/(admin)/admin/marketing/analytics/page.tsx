'use client'
import { getAnalyticsSettings, saveAnalyticsSettings } from '@/actions/seo/analytics';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [gaCode, setGaCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAnalyticsSettings()
      setGaCode(data.gaCode || "")
      setIsEnabled(!!data.enabled)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>;
  async function saveAnalytics() {
  const result = await saveAnalyticsSettings(gaCode, isEnabled)
  if (result.success) {
    alert("Analytics saved!");
  } else {
    alert("Error saving!");
  }
}

  return (
    <div className="max-w-4xl">
        <h1 className="h2 mb-2">Analytics</h1>
        <p className="text-neutral-600 mb-8">Google Analytics integration and visitor tracking.</p>

        {/* Google Analytics Setup */}
        <div className="bg-white border border-black/10 rounded-sm p-6 mb-6">
          <h3 className="font-medium mb-4">Google Analytics</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">GA4 Measurement ID</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-black/10 bg-white"
                value={gaCode}
                onChange={(e) => setGaCode(e.target.value)}
                placeholder="GA-XXXXXXXXXX"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Find your Measurement ID in Google Analytics → Admin → Data Streams
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="analytics-enabled"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              <label htmlFor="analytics-enabled" className="text-sm">
                Enable Google Analytics
              </label>
            </div>

            <button
              className="btn btn-primary"
              onClick={saveAnalytics}
            >
              Save
            </button>
          </div>
        </div>

        {/* Analytics Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-black/10 rounded-sm p-6">
            <h3 className="font-medium mb-4">Tracking Features</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Track page views
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                E-Commerce Conversions
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Traffic sources
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Custom Events (coming soon)
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-sm p-6">
            <h3 className="font-medium mb-4">Reports</h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>• Daily visitor statistics</p>
              <p>• Most popular products</p>
              <p>• Conversion funnel</p>
              <p>• UTM campaign tracking</p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-sm p-6">
          <h3 className="font-medium mb-2 text-blue-800">Google Analytics Setup</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1.</strong> Go to <a href="https://analytics.google.com" className="underline" target="_blank">analytics.google.com</a></p>
            <p><strong>2.</strong> Create a new GA4 property for your website</p>
            <p><strong>3.</strong> Copy the Measurement ID (GA-XXXXXXXXXX)</p>
            <p><strong>4.</strong> Paste it above and enable Analytics</p>
            <p><strong>5.</strong> Data will be visible within 24 hours</p>
          </div>
        </div>
    </div>
  );
}
