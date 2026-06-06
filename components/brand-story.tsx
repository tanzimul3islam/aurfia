const values = [
  {
    title: 'Premium Materials',
    desc: 'Every piece is crafted from genuine 925 sterling silver, selected for its enduring beauty and quality that only improves with time.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Ethically Made',
    desc: 'We partner with skilled artisans who uphold ethical practices, ensuring fair wages, safe conditions, and responsible material sourcing.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-7-4.6-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.4-9.5 8-9.5 8z" />
      </svg>
    ),
  },
  {
    title: 'Timeless Design',
    desc: 'Minimalist silhouettes that transcend trends. Each piece is thoughtfully designed to be worn, loved, and passed down through generations.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

export default function BrandStory() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-[32px] md:text-[42px] text-brand">Our Craft</h2>
          <p className="mt-3 text-neutral-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Every detail matters. From the selection of raw materials to the final polish,
            each piece reflects our unwavering commitment to quality and intention.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-brand-light flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-serif text-xl text-brand mb-2">{v.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-[320px] mx-auto">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
