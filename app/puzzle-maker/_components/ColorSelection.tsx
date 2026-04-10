"use client";
import { useState } from "react";

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
];

export default function ColorSelection({
  onDone,
}: {
  onDone: (colors: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (color: string) => {
    setSelected((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-white/10 rounded-xl backdrop-blur-sm">
      <h2 className="text-white text-xl font-semibold tracking-wide">
        Select Piece Colors
      </h2>

      <p className="text-white/60 text-sm">
        Pick one color for a single-color puzzle, or multiple to assign colors
        per piece.
      </p>

      <div className="grid grid-cols-4 gap-4">
        {PRESET_COLORS.map((color) => {
          const isSelected = selected.includes(color);
          return (
            <button
              key={color}
              onClick={() => toggle(color)}
              className={`w-12 h-12 rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-white scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{ background: color }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {selected.length > 0 ? (
          <>
            <span className="text-white/60 text-sm">
              {selected.length} color{selected.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              {selected.map((c) => (
                <div
                  key={c}
                  className="w-4 h-4 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>
          </>
        ) : (
          <span className="text-white/40 text-sm">No colors selected</span>
        )}
      </div>

      <button
        disabled={selected.length === 0}
        onClick={() => onDone(selected)}
        className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}
