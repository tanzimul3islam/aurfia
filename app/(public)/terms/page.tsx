import { buildPageMetadata } from '@/lib/seo-helper';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('Terms');
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-800">
      <h1 className="font-serif text-2xl mb-6"><strong>Terms & Conditions</strong></h1>

      <p className="mb-3 leading-relaxed">
        These Terms & Conditions govern your use of the AURFIA website and your purchase of products from us.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>1. General</strong></h2>
      <p className="mb-3 leading-relaxed">
        By placing an order through our website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our site.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>2. Orders & Pricing</strong></h2>
      <p className="mb-3 leading-relaxed">
        All prices are listed in USD and exclude applicable taxes and shipping fees. We reserve the right to change prices at any time. An order is considered accepted when we send a confirmation email.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>3. Payment</strong></h2>
      <p className="mb-3 leading-relaxed">
        We accept Visa, MasterCard, and PayPal. Payment is due at the time of purchase.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>4. Shipping & Delivery</strong></h2>
      <p className="mb-3 leading-relaxed">
        Shipping times and costs are displayed at checkout. We are not responsible for delays caused by carriers or customs.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>5. Returns & Refunds</strong></h2>
      <p className="mb-3 leading-relaxed">
        You may return unworn items within 30 days of delivery for a full refund. Items must be in original condition. See our Shipping & Returns page for details.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>6. Limitation of Liability</strong></h2>
      <p className="mb-3 leading-relaxed">
        AURFIA shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>7. Contact</strong></h2>
      <p className="mb-3 leading-relaxed">
        For questions about these Terms, please contact us through our <a href="/contact" className="underline">Contact page</a>.
      </p>
    </div>
  );
}
