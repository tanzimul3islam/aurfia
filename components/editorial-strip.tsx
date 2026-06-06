export default function EditorialStrip() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dzkcuc82f/image/upload/v1780766391/products/2026_SUMMER_ICONS_ONFIG_HW2_4x5.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dzkcuc82f/image/upload/v1780766403/products/2026_SUMMER_ICONS_ONFIG_KNOT_4x5.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
