export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-800">
      <h1 className="font-serif text-2xl mb-6"><strong>Contact</strong></h1>

      <p className="mb-3 leading-relaxed">
        If you have questions about your order, our jewelry pieces, or our service, feel free to send us an email.
      </p>

      <p className="mb-3 leading-relaxed">
        We typically respond within 24 hours.
      </p>

      <div className="mt-8">
        <a
          href="mailto:hello@deinshop.de"
          className="inline-block bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Send Email
        </a>
      </div>
    </div>
  )
}
