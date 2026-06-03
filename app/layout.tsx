import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAnalyticsSettings } from "@/actions/seo/analytics";
import './globals.css';
import { ReactNode } from 'react';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CookieBanner from '@/components/CookieBanner';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap'
});

export const corm = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500','600'],
  variable: '--font-corm',
  display: 'swap'
});

const interBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
});

const cormorantTitle = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'AURFIA — Fine Jewelry',
    template: '%s | AURFIA'
  },
  description: 'Discover timeless fine jewelry at AURFIA. Sterling silver earrings, rings, necklaces, and more — crafted for everyday elegance.',
  keywords: ['jewelry', 'fine jewelry', 'sterling silver', 'earrings', 'rings', 'necklaces', 'bracelets', 'online jewelry store', 'minimal jewelry', 'gift jewelry'],
  authors: [{ name: 'AURFIA' }],
  creator: 'AURFIA',
  publisher: 'AURFIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'AURFIA',
    title: 'AURFIA — Fine Jewelry',
    description: 'Discover timeless fine jewelry at AURFIA. Sterling silver earrings, rings, necklaces, and more.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'AURFIA — Fine Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aurfia_jewelry',
    creator: '@aurfia_jewelry',
    title: 'AURFIA — Fine Jewelry',
    description: 'Discover timeless fine jewelry at AURFIA.',
    images: ['/twitter-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  other: {
    'theme-color': '#ffffff',
  },
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAnalyticsSettings();
  return (
    <html lang="en">
      <body className="w-full">
        {children}

        {settings.enabled && settings.gaCode && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaCode}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.gaCode}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
