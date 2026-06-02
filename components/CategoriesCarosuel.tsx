"use client";

import { useRouter } from "next/navigation";

type CarouselProps = {
  categories: { id: string; name: string }[];
  activeCategory: string | null | undefined;
};

export default function CategoryCarousel({ categories, activeCategory }: CarouselProps) {
  const router = useRouter();

  const handleClick = (categoryId: string | null) => {
  const params = new URLSearchParams(window.location.search);
  if (categoryId) {
    params.set("categoryId", categoryId);
  } else {
    params.delete("categoryId");
  }
  params.delete("page"); // reset page when category changes
  window.location.href = `/?${params.toString()}#grid`; // force reload
};


  return (
    <div className="flex space-x-2 overflow-x-auto py-2 px-2">
      <button
        onClick={() => handleClick(null)}
        className={`flex-shrink-0 whitespace-nowrap px-3 py-1 text-sm rounded-full border transition-colors ${
          activeCategory === null ? "bg-black text-white border-black" : "border-gray-300"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={`flex-shrink-0 whitespace-nowrap px-3 py-1 text-sm rounded-full border transition-colors ${
            activeCategory === cat.id ? "bg-black text-white border-black" : "border-gray-300"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
