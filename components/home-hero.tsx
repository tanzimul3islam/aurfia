import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="bg-brand-light">
      <div className="mx-auto flex flex-col md:flex-row md:min-h-[85vh]">
        <div className="md:flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-14 md:py-0">
          <span className="text-xs tracking-[0.15em] uppercase text-brand-accent/80 font-medium mb-5">
            925 Sterling Silver
          </span>
          <h1 className="font-serif font-medium leading-[1.05] tracking-[-0.02em] text-brand text-[clamp(40px,7vw,72px)]">
            Timeless Forms.
            <br />
            Pure Brilliance.
          </h1>
          <p className="mt-5 text-[15px] md:text-[17px] text-neutral-600 max-w-[460px] leading-relaxed">
            Minimal jewelry crafted from 925 sterling silver — designed for the everyday, made to last a lifetime.
          </p>
          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="md:flex-1 relative min-h-[40vh] md:min-h-0 aspect-[4/3] md:aspect-auto bg-neutral-200 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dzkcuc82f/image/upload/v1780766379/products/2026_ICONS_LP_NP_ONFIG_T_16x9.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
