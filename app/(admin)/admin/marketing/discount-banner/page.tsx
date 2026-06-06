'use client';

import { getDiscountBanner, saveDiscountBanner } from '@/actions/site/discount-banner';
import Toast from '@/components/Toast';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDiscountBanner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ text: '', open: false });
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [link, setLink] = useState('');
  const [bgColor, setBgColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    async function load() {
      const banner = await getDiscountBanner();
      setText(banner.discountBannerText || '');
      setEnabled(!!banner.discountBannerEnabled);
      setLink(banner.discountBannerLink || '');
      setBgColor(banner.discountBannerBgColor || '#000000');
      setTextColor(banner.discountBannerTextColor || '#ffffff');
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveDiscountBanner({
        discountBannerText: text,
        discountBannerEnabled: enabled,
        discountBannerLink: link,
        discountBannerBgColor: bgColor,
        discountBannerTextColor: textColor,
      });
      setToast({ text: 'Discount banner saved!', open: true });
    } catch {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">Discount Banner</h1>
      <p className="text-neutral-500 text-sm mb-8">Configure the announcement banner shown at the top of the store.</p>

      <div className="space-y-6">
        {/* Preview */}
        <div className="bg-white border border-black/10 p-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Preview</h3>
          <div
            className="w-full text-center text-sm py-2 px-4 leading-relaxed rounded-sm"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {link ? (
              <a href={link} className="hover:underline">{text || 'Banner text preview'}</a>
            ) : (
              <span>{text || 'Banner text preview'}</span>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white border border-black/10 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="enabled" className="text-sm font-medium">Enable Discount Banner</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Banner Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Free shipping on orders over $100"
              className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /shop or https://..."
              className="w-full border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 border border-black/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 border border-black/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-black/30 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0E0E0E] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Banner'}
        </button>
      </div>

      <Toast text={toast.text} open={toast.open} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
