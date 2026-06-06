'use client';

import { useEffect, useState } from 'react';

interface BannerData {
  discountBannerText: string | null;
  discountBannerEnabled: boolean | null;
  discountBannerLink: string | null;
  discountBannerBgColor: string | null;
  discountBannerTextColor: string | null;
}

export default function DiscountBannerClient({ banner }: { banner: BannerData }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!banner.discountBannerEnabled || !banner.discountBannerText) return null;

  return (
    <div
      className={`w-full text-center text-sm leading-relaxed overflow-hidden transition-all duration-500 ${
        hidden ? 'max-h-0 py-0' : 'max-h-12 py-2'
      }`}
      style={{
        backgroundColor: banner.discountBannerBgColor ?? '#000000',
        color: banner.discountBannerTextColor ?? '#ffffff',
      }}
    >
      {banner.discountBannerLink ? (
        <a href={banner.discountBannerLink} className="hover:underline">
          {banner.discountBannerText}
        </a>
      ) : (
        <span>{banner.discountBannerText}</span>
      )}
    </div>
  );
}
