"use client";

import type { DeckItem } from "../lib/pricing";

type Props = {
  deck: DeckItem[];
};

export default function TopCreatureSubtypes({ deck }: Props) {
  const counts: Record<string, number> = {};

  deck.forEach((card) => {
    if (!card.type_line) return;
    if (!card.type_line.includes("Creature")) return;

    // Example type_line: "Creature — Elf Druid"
    const parts = card.type_line.split("—");
    if (parts.length < 2) return;

    const subtypes = parts[1].trim().split(" ");
    subtypes.forEach((sub) => {
      counts[sub] = (counts[sub] || 0) + card.quantity;
    });
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) {
    return <p className="text-gray-400 text-sm">No creature subtypes yet.</p>;
  }

  return (
    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-2">
        Top Creature Subtypes
      </h3>
      <ul className="space-y-1">
        {sorted.map(([subtype, count]) => (
          <li key={subtype} className="text-gray-200 text-sm">
            {subtype} <span className="text-gray-400">({count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
