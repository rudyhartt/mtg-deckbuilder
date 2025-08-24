"use client";

import { useEffect, useState } from "react";
import { fetchTopStaples, type ScryCard } from "../lib/scryfall";

type Props = {
  format: string;
  onAdd?: (card: ScryCard) => void;
};

export default function TopStaples({ format, onAdd }: Props) {
  const [cards, setCards] = useState<ScryCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const staples = await fetchTopStaples(format);
        setCards(staples);
      } catch (e) {
        console.error("Failed to fetch staples:", e);
        setCards([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [format]);

  const rarityBadge = (rarity?: string) => {
    if (!rarity) return null;
    return (
      <span
        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          rarity === "common"
            ? "bg-gray-700 text-gray-200"
            : rarity === "uncommon"
            ? "bg-green-700 text-green-100"
            : rarity === "rare"
            ? "bg-yellow-600 text-yellow-100"
            : rarity === "mythic"
            ? "bg-red-700 text-red-100"
            : "bg-gray-600 text-white"
        }`}
      >
        {rarity}
      </span>
    );
  };

  return (
    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-2">
        Top {format.charAt(0).toUpperCase() + format.slice(1)} Staples
      </h3>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-400 text-sm">No staples found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cards.map((c) => (
            <div
              key={c.id}
              className="bg-gray-800 rounded-lg p-2 shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => onAdd?.(c)}
            >
              {c.image_uris?.normal && (
                <img
                  src={c.image_uris.normal}
                  alt={c.name}
                  className="rounded"
                />
              )}
              <p className="text-xs text-white mt-1 truncate">{c.name}</p>
              {rarityBadge(c.rarity)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
