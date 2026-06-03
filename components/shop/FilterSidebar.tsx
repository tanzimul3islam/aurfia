"use client";

import { X } from "lucide-react";
import { shopMenuCategories } from "@/lib/shop-menu";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";

export type Filters = {
  categories: string[];
  priceRange: [number, number];
  minRating: number | null;
};

export const defaultFilters = (
  allMin: number,
  allMax: number,
): Filters => ({
  categories: [],
  priceRange: [allMin, allMax],
  minRating: null,
});

export default function FilterSidebar({
  filters,
  onChange,
  priceBounds,
  onClose,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  priceBounds: [number, number];
  onClose?: () => void;
}) {
  const setCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onChange({ ...filters, categories: next });
  };

  const hasAnyFilter =
    filters.categories.length > 0 ||
    filters.priceRange[0] !== priceBounds[0] ||
    filters.priceRange[1] !== priceBounds[1] ||
    filters.minRating !== null;

  const activeCount =
    filters.categories.length +
    (filters.minRating !== null ? 1 : 0) +
    (filters.priceRange[0] !== priceBounds[0] ||
    filters.priceRange[1] !== priceBounds[1]
      ? 1
      : 0);

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900">Filters</span>
            {activeCount > 0 && (
              <span className="text-[10px] bg-zinc-900 text-white rounded-full px-1.5 py-0.5 leading-none">
                {activeCount}
              </span>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-zinc-500 hover:text-zinc-900">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Category</div>
          <div className="space-y-1">
            {shopMenuCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => setCategory(cat.id)}
                  className="accent-zinc-900 w-3.5 h-3.5"
                />
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Price Range</div>
          <PriceRangeFilter
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={filters.priceRange}
            onChange={(range) => onChange({ ...filters, priceRange: range })}
          />
        </div>

        {/* Rating */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Rating</div>
          <RatingFilter
            value={filters.minRating}
            onChange={(r) => onChange({ ...filters, minRating: r })}
          />
        </div>

        {hasAnyFilter && (
          <button
            onClick={() => onChange(defaultFilters(priceBounds[0], priceBounds[1]))}
            className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2"
          >
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}
