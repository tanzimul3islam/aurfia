export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white p-4">
      {/* Upper Section */}
      <div className="container py-10 lg:py-14 grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
        {/* Column 1: Brand */}
        <div className="flex flex-col items-start">
          <a href="/" className="font-serif text-lg tracking-wider block">AURFIA</a>
          <p className="mt-3 text-sm text-neutral-600">Timeless — minimal & refined.</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
            <a
              href="#"
              aria-label="Instagram"
              className="opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Column 2: Shop */}
        <div className="flex flex-col items-start">
          <div className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Shop</div>
          <nav className="space-y-1 leading-[1.9]">
            <a
              href="/shop"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              All Products
            </a>
            <a
              href="/shipping-returns"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Shipping & Returns
            </a>
          </nav>
        </div>

        {/* Column 3: Support */}
        <div className="flex flex-col items-start">
          <div className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Support</div>
          <nav className="space-y-1 leading-[1.9]">
            <a
              href="/contact"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col items-start">
          <div className="text-sm uppercase tracking-wide text-neutral-500 mb-2">Legal</div>
          <nav className="space-y-1 leading-[1.9]">
            <a
              href="/legal-notice"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Legal Notice
            </a>
            <a
              href="/terms"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Terms & Conditions
            </a>
            <a
              href="/privacy-policy"
              className="block opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="container h-14 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="opacity-70 order-2 md:order-1">AURFIA &copy; {new Date().getFullYear()}</div>

          <div className="flex items-center gap-3 order-1 md:order-2">
            <svg viewBox="0 0 48 32" className="h-5 w-auto" aria-label="Visa">
              <rect width="48" height="32" rx="4" fill="#1A1F71"/>
              <text x="24" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">VISA</text>
            </svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto" aria-label="Mastercard">
              <rect width="48" height="32" rx="4" fill="transparent" stroke="#ccc" strokeWidth="0.5"/>
              <circle cx="18" cy="16" r="9" fill="#EB001B"/>
              <circle cx="30" cy="16" r="9" fill="#F79E1B" opacity="0.8"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto" aria-label="Stripe">
              <rect width="48" height="32" rx="4" fill="#6772E5"/>
              <text x="24" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">STRIPE</text>
            </svg>
          </div>

          <div className="flex items-center gap-4 order-3">
            <span className="opacity-70">EN / USD</span>
            <a
              href="#top"
              className="opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              aria-label="Back to top"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
