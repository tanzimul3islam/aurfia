"use client";

import { useEffect, useState } from "react";

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
  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");

  useEffect(() => {
    if (value[0] === min && value[1] === max) {
      setLocalMin("");
      setLocalMax("");
    }
  }, [value, min, max]);

  const commit = () => {
    let fromDollars = localMin === "" ? min / 100 : Number(localMin);
    let toDollars = localMax === "" ? max / 100 : Number(localMax);
    if (fromDollars > toDollars) [fromDollars, toDollars] = [toDollars, fromDollars];
    const fromCents = Math.round(fromDollars * 100);
    const toCents = Math.round(toDollars * 100);
    if (fromCents !== value[0] || toCents !== value[1]) onChange([fromCents, toCents]);
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-3">
        <input
          type="number"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          onBlur={commit}
          className="w-full h-8 px-2 text-xs border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          placeholder="$ Min"
        />
        <span className="text-zinc-400 text-xs">—</span>
        <input
          type="number"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          onBlur={commit}
          className="w-full h-8 px-2 text-xs border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900"
          placeholder="$ Max"
        />
      </div>
    </div>
  );
}
