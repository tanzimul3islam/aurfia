"use client";

import { useState } from "react";

export default function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  const [local, setLocal] = useState(value);

  return (
    <div>
      <div className="flex gap-2 items-center mb-3">
        <input
          type="number"
          value={local[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocal([v, local[1]]);
          }}
          onBlur={() => {
            if (local[0] < min) setLocal([min, local[1]]);
            onChange([Math.max(local[0], min), local[1]]);
          }}
          className="w-full h-8 px-2 text-xs border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          placeholder={`$${(min / 100).toFixed(0)}`}
        />
        <span className="text-zinc-400 text-xs">—</span>
        <input
          type="number"
          value={local[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocal([local[0], v]);
          }}
          onBlur={() => {
            if (local[1] > max) setLocal([local[0], max]);
            onChange([local[0], Math.min(local[1], max)]);
          }}
          className="w-full h-8 px-2 text-xs border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          placeholder={`$${(max / 100).toFixed(0)}`}
        />
      </div>
    </div>
  );
}
