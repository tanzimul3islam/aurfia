'use client'
import { getSeoMeta, saveSeoMeta } from '@/actions/seo';
import { useEffect, useState } from 'react';

interface SEOMeta {
  page: string;
  title: string;
  description: string;
  keywords: string;
}

export default function AdminSEO() {
  const [metaTags, setMetaTags] = useState<SEOMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeta, setEditingMeta] = useState<SEOMeta | null>(null);
  const [formData, setFormData] = useState({
    page: '',
    title: '',
    description: '',
    keywords: ''
  });

  useEffect(() => {
    loadMetaTags();
  }, []);

  async function loadMetaTags() {
    try {
      const data: any = await getSeoMeta();
      setMetaTags(data);
    } catch (error) {
      console.error('Error loading meta tags:', error);
    } finally {
      setLoading(false);
    }
  }

  function editMeta(meta: SEOMeta) {
    setFormData({ ...meta });
    setEditingMeta(meta);
  }

  async function saveMeta() {
    try {
      await saveSeoMeta(formData);
      setFormData({ page: '', title: '', description: '', keywords: '' });
      setEditingMeta(null);
      loadMetaTags();
      alert(`SEO meta for "${formData.page}" saved!`);
    } catch (error) {
      console.error('Error saving meta:', error);
      alert('Error saving');
    }
  }

  if (loading) return <div className="container py-12 text-center">Loading SEO tools...</div>;

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h2">SEO Tools</h1>
          <p className="text-neutral-600 mt-1">Manage meta tags and search engine optimization</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setEditingMeta({ page: '', title: '', description: '', keywords: '' })}
        >
          New Meta Tags
        </button>
      </div>

      {editingMeta && (
        <div className="border border-black/10 rounded-sm p-6 mb-6 bg-blue-50">
          <h2 className="text-xl font-medium mb-4">
            {editingMeta.page ? `Edit Meta Tags: ${editingMeta.page}` : 'New Meta Tags'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-black/10 bg-white"
                value={formData.page}
                onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                placeholder="e.g. Homepage, Shop, Product Detail"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title (max. 60 characters)</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-black/10 bg-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="SEO-optimized title"
                maxLength={60}
              />
              <p className="text-xs text-neutral-500 mt-1">{formData.title.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (max. 160 characters)</label>
              <textarea
                className="w-full h-20 px-3 py-2 border border-black/10 bg-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descriptive summary for search engines"
                maxLength={160}
              />
              <p className="text-xs text-neutral-500 mt-1">{formData.description.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-black/10 bg-white"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="jewelry, rings, luxury, gold (comma-separated)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                className="btn btn-primary"
                onClick={saveMeta}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingMeta(null);
                  setFormData({ page: '', title: '', description: '', keywords: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium">Current Meta Tags</h3>
        {metaTags.map((meta, index) => (
          <div key={index} className="border border-black/10 rounded-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium">{meta.page}</h4>
                <p className="text-sm text-neutral-600 mt-1">Title: {meta.title}</p>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => editMeta(meta)}
              >
                Edit
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>Description:</strong> {meta.description}</p>
              <p><strong>Keywords:</strong> {meta.keywords}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Tips */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-sm p-6">
        <h3 className="font-medium mb-2 text-green-800">SEO Tips</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>• Use relevant keywords in Title and Description</p>
          <p>• Every page should have a unique title</p>
          <p>• Description should be 150-160 characters long</p>
          <p>• Test your pages with Google Search Console</p>
        </div>
      </div>
    </div>
  );
}
