"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type MetaResponse = {
  colors: { name: string; value: number }[];
  archetypes: { name: string; value: number }[];
  topCards: {
    id: string;
    oracle_id: string;
    name: string;
    set: string;
    collector_number: string;
    image?: string;
  }[];
};

export default function MetaAnalysis() {
  const [data, setData] = useState<MetaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeta() {
      setLoading(true);
      try {
        const res = await fetch("/api/meta");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch meta:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, []);

  const COLORS = {
    W: "#f6e05e",
    U: "#4299e1",
    B: "#2d3748",
    R: "#e53e3e",
    G: "#38a169",
  };

  if (loading) return <p className="text-gray-400">Loading meta snapshot…</p>;
  if (!data) return <p className="text-gray-400">No meta data available.</p>;

  return (
    <div className="mt-12 w-full bg-gray-900 p-6 rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-white mb-6">Meta Snapshot</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Cards */}
        <div className="bg-black p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🔥 Top 5 Standard Staples</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.topCards.slice(0, 5).map((card) => (
              <li
                key={card.id}
                className="text-white text-center cursor-pointer"
                onMouseEnter={() => setHoverUrl(card.image || null)}
                onMouseLeave={() => setHoverUrl(null)}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="mx-auto rounded shadow mb-2"
                  />
                )}
                <p className="text-sm font-medium">{card.name}</p>
                <p className="text-xs text-gray-400">
                  [{card.set}-{card.collector_number}]
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Color Distribution */}
        <div className="bg-black p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🎨 Color Distribution</h3>
          {data.colors.length > 0 && (
            <PieChart width={300} height={300}>
              <Pie
                data={data.colors}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.colors.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#718096"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>
      </div>

      {/* Creature Subtypes */}
      {data.archetypes.length > 0 && (
        <div className="mt-8 bg-black p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🧙 Top Creature Subtypes</h3>
          <ul className="space-y-2 text-white">
            {data.archetypes.slice(0, 5).map((a, i) => (
              <li key={i}>
                {i + 1}. {a.name} — {a.value} cards
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hover preview (big image) */}
      {hoverUrl && (
        <div className="fixed bottom-6 right-6 w-80 z-50 pointer-events-none">
          <img
            src={hoverUrl}
            alt="Preview"
            className="rounded-lg shadow-2xl border border-gray-700"
          />
        </div>
      )}
    </div>
  );
}
