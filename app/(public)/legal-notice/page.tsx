export default function LegalNoticePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-800">
      <h1 className="font-serif text-2xl mb-6"><strong>Legal Notice</strong></h1>

      <p className="mb-3 leading-relaxed">
        <strong>AURFIA</strong><br />
        [Your Company Name]<br />
        [Street Address]<br />
        [City, State, ZIP]<br />
        United States
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>Contact</strong></h2>
      <p className="mb-3 leading-relaxed">
        Email: [your email]<br />
        Phone: [your phone]
      </p>

      <h2 className="font-serif text-lg mt-8 mb-2"><strong>Business Information</strong></h2>
      <p className="mb-3 leading-relaxed">
        [Business registration details if applicable]
      </p>
    </div>
  );
}
