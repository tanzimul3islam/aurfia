'use client'
import { getSeoMeta, saveSeoMeta, deleteSeoMeta } from '@/actions/seo';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface SEOMetaForm {
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noindex: boolean;
  priority: number;
}

const emptyForm = (): SEOMetaForm => ({
  page: '', title: '', description: '', keywords: '',
  ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '',
  noindex: false, priority: 0.8,
});

const PAGE_PRESETS = [
  'Homepage', 'Shop', 'Product Detail', 'Cart', 'Checkout',
  'Wishlist', 'Search', 'Contact', 'Terms', 'Privacy Policy',
  'Shipping & Returns', 'Legal Notice', 'About',
];

export default function AdminSEO() {
  const [metaTags, setMetaTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeta, setEditingMeta] = useState<SEOMetaForm | null>(null);
  const [formData, setFormData] = useState<SEOMetaForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'general' | 'social' | 'advanced'>('general');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => { loadMetaTags(); }, []);

  const loadMetaTags = useCallback(async () => {
    try {
      const data = await getSeoMeta();
      setMetaTags(data);
    } catch (error) {
      console.error('Error loading meta tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  function editMeta(meta: any) {
    setFormData({
      page: meta.page || '',
      title: meta.title || '',
      description: meta.description || '',
      keywords: meta.keywords || '',
      ogTitle: meta.ogTitle || '',
      ogDescription: meta.ogDescription || '',
      ogImage: meta.ogImage || '',
      canonicalUrl: meta.canonicalUrl || '',
      noindex: meta.noindex ?? false,
      priority: meta.priority ?? 0.8,
    });
    setEditingMeta(meta);
    setTab('general');
  }

  async function saveMeta() {
    if (!formData.page) { alert('Page field is required'); return; }
    setSaving(true);
    try {
      await saveSeoMeta(formData);
      setEditingMeta(null);
      setFormData(emptyForm());
      loadMetaTags();
    } catch (error) {
      console.error('Error saving meta:', error);
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(page: string) {
    try {
      await deleteSeoMeta(page);
      setDeleteTarget(null);
      loadMetaTags();
    } catch {
      alert('Error deleting');
    }
  }

  function newMeta() {
    setFormData(emptyForm());
    setEditingMeta(emptyForm());
    setTab('general');
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h2">SEO Tools</h1>
          <p className="text-neutral-600 mt-1">Manage meta tags, social previews, and search engine settings</p>
        </div>
        <button className="btn btn-primary" onClick={newMeta}>New Meta Tags</button>
      </div>

      {editingMeta && (
        <div className="border border-black/10 rounded-sm p-6 mb-6 bg-blue-50/40">
          <h2 className="text-xl font-medium mb-4">
            {editingMeta.page ? `Edit: ${editingMeta.page}` : 'New Meta Tags'}
          </h2>

          {/* Tab bar */}
          <div className="flex gap-1 mb-6 border-b border-black/10">
            {(['general', 'social', 'advanced'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                  tab === t ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t === 'general' ? 'General' : t === 'social' ? 'Social & OG' : 'Advanced'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Page selector */}
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {PAGE_PRESETS.map((p) => (
                  <button key={p} type="button" onClick={() => setFormData({ ...formData, page: p })}
                    className={`text-xs px-2 py-1 border rounded-sm ${
                      formData.page === p ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <input type="text" className="w-full h-10 px-3 border border-black/10 bg-white text-sm"
                value={formData.page} onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                placeholder="Or type a custom page key..." />
            </div>

            {tab === 'general' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title (max. 60 chars)</label>
                  <input type="text" className="w-full h-10 px-3 border border-black/10 bg-white text-sm"
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="SEO-optimized title" maxLength={60} />
                  <p className={`text-xs mt-1 ${formData.title.length > 60 ? 'text-red-500' : 'text-neutral-500'}`}>
                    {formData.title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description (max. 160 chars)</label>
                  <textarea className="w-full h-20 px-3 py-2 border border-black/10 bg-white text-sm resize-none"
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descriptive summary for search engines" maxLength={160} />
                  <p className={`text-xs mt-1 ${formData.description.length > 160 ? 'text-red-500' : 'text-neutral-500'}`}>
                    {formData.description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
                  <input type="text" className="w-full h-10 px-3 border border-black/10 bg-white text-sm"
                    value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="jewelry, rings, luxury, silver" />
                </div>
              </>
            )}

            {tab === 'social' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">OG Title (overrides meta title for social shares)</label>
                  <input type="text" className="w-full h-10 px-3 border border-black/10 bg-white text-sm"
                    value={formData.ogTitle} onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                    placeholder="Leave empty to use meta title" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">OG Description</label>
                  <textarea className="w-full h-16 px-3 py-2 border border-black/10 bg-white text-sm resize-none"
                    value={formData.ogDescription} onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    placeholder="Leave empty to use meta description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">OG Image URL</label>
                  <input type="text" className="w-full h-10 px-3 border border-black/10 bg-white text-sm font-mono text-xs"
                    value={formData.ogImage} onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="https://example.com/og-image.jpg" />
                  {formData.ogImage && (
                    <div className="mt-2 border border-black/10 rounded-sm overflow-hidden w-[200px]">
                      <img src={formData.ogImage} alt="OG preview" className="w-full h-auto"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'advanced' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Canonical URL</label>
                  <input type="url" className="w-full h-10 px-3 border border-black/10 bg-white text-sm font-mono text-xs"
                    value={formData.canonicalUrl} onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder="https://aurfia.com/shop/rings" />
                  <p className="text-xs text-neutral-500 mt-1">Override the default canonical URL for this page.</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-black w-4 h-4"
                      checked={formData.noindex} onChange={(e) => setFormData({ ...formData, noindex: e.target.checked })} />
                    <span className="text-sm font-medium">Block from search engines (noindex)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sitemap Priority: {formData.priority.toFixed(1)}</label>
                  <input type="range" min="0" max="1" step="0.1" value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseFloat(e.target.value) })}
                    className="w-full max-w-xs accent-black" />
                  <p className="text-xs text-neutral-500 mt-1">Higher values signal importance to search engines.</p>
                </div>
              </>
            )}

            {/* Live preview */}
            {(formData.title || formData.description) && (
              <div className="border border-black/10 rounded-sm p-4 bg-white">
                <p className="text-xs font-medium text-neutral-500 uppercase mb-2">Google Preview</p>
                <div className="text-sm">
                  <p className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer truncate">
                    {formData.title || 'AURFIA — Fine Jewelry'}
                  </p>
                  <p className="text-[#006621] text-xs truncate">
                    {formData.canonicalUrl || 'aurfia.com'}{formData.page ? `/${formData.page.toLowerCase().replace(/\s+/g, '-')}` : ''}
                  </p>
                  <p className="text-[#545454] text-sm leading-snug mt-0.5 line-clamp-2">
                    {formData.description || 'Discover timeless fine jewelry at AURFIA.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button className="btn btn-primary" onClick={saveMeta} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={() => { setEditingMeta(null); setFormData(emptyForm()); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current entries */}
      <div className="space-y-3">
        <h3 className="font-medium">Current Meta Tags ({metaTags.length})</h3>
        {metaTags.length === 0 && (
          <p className="text-sm text-neutral-400">No meta tags saved yet. Create your first one above.</p>
        )}
        {metaTags.map((meta, index) => (
          <div key={meta.id || index} className="border border-black/10 rounded-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">{meta.page}</h4>
                {meta.title && <p className="text-xs text-neutral-500 mt-0.5">{meta.title}</p>}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => editMeta(meta)}>Edit</button>
                <button className="btn btn-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  onClick={() => setDeleteTarget(meta.page)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
              {meta.description && <span>Desc: {meta.description.slice(0, 60)}...</span>}
              {meta.noindex && <span className="text-orange-600 font-medium">noindex</span>}
              {meta.priority && <span>Priority: {meta.priority}</span>}
              {meta.ogImage && <span>OG Image ✓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Tips */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-sm p-6">
        <h3 className="font-medium mb-2 text-green-800">SEO Tips</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Every page should have a unique title and description</p>
          <p>• Use OG Image for better social sharing (1200×630px recommended)</p>
          <p>• Set canonical URLs to avoid duplicate content issues</p>
          <p>• Use noindex for thin pages or admin pages</p>
          <p>• Test your pages with Google Search Console</p>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete SEO Meta"
        message={`Are you sure you want to delete SEO meta for "${deleteTarget}"?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (!deleteTarget) return;
          return handleDelete(deleteTarget);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
