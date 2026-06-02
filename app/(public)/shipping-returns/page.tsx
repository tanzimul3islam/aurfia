export default function ShippingReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-800">
      <h1 className="font-serif text-2xl mb-6"><strong>Shipping & Returns</strong></h1>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>Shipping</strong></h2>
      <p className="mb-3 leading-relaxed">
        We ship all orders from our US-based warehouse.
      </p>

      <h3 className="font-serif text-base mt-6 mb-2"><strong>Shipping Areas</strong></h3>
      <p className="mb-3 leading-relaxed">
        We currently ship within the United States and to select international destinations.
      </p>

      <h3 className="font-serif text-base mt-6 mb-2"><strong>Shipping Costs</strong></h3>
      <p className="mb-3 leading-relaxed">
        Shipping costs are calculated at checkout. Free shipping is available on orders over $50 within the US.
      </p>

      <h3 className="font-serif text-base mt-6 mb-2"><strong>Delivery Time</strong></h3>
      <p className="mb-3 leading-relaxed">
        Standard delivery: 3–7 business days within the US. International orders may take 7–14 business days depending on customs.
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>Returns</strong></h2>
      <p className="mb-3 leading-relaxed">
        We want you to love your purchase. If you are not satisfied, you may return unworn items within 30 days of delivery.
      </p>

      <h3 className="font-serif text-base mt-6 mb-2"><strong>Return Conditions</strong></h3>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Items must be unworn and in original packaging.</li>
        <li>Return shipping is free for US orders.</li>
        <li>Refunds are processed within 5 business days of receiving the return.</li>
      </ul>

      <h3 className="font-serif text-base mt-6 mb-2"><strong>How to Start a Return</strong></h3>
      <p className="mb-3 leading-relaxed">
        Contact us through our <a href="/contact" className="underline">Contact page</a> with your order number, and we will provide a prepaid return label.
      </p>
    </div>
  );
}
