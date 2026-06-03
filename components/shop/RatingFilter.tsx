"use client";

export default function RatingFilter({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number | null) => void;
}) {
  const options = [
    { label: "★ 4 & up", value: 4 },
    { label: "★ 3 & up", value: 3 },
    { label: "★ 2 & up", value: 2 },
    { label: "★ 1 & up", value: 1 },
  ];

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          className={`block w-full text-left text-sm py-1 transition-colors ${
            value === opt.value ? "text-zinc-900 font-medium" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {value === opt.value ? "✓ " : ""}{opt.label}
        </button>
      ))}
    </div>
  );
}
