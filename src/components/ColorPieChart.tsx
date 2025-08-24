"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { DeckItem } from "../lib/pricing";

// Magic color mapping (WUBRG)
const COLORS: Record<string, string> = {
  W: "#facc15", // yellow
  U: "#3b82f6", // blue
  B: "#6b7280", // gray-black
  R: "#ef4444", // red
  G: "#22c55e", // green
};

type Props = {
  deck: DeckItem[];
};

export default function ColorPieChart({ deck }: Props) {
  const counts: Record<string, number> = {};

  deck.forEach((card) => {
    (card.color_identity || []).forEach((color) => {
      counts[color] = (counts[color] || 0) + card.quantity;
    });
  });

  const data = Object.entries(counts).map(([color, count]) => ({
    name: color,
    value: count,
  }));

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">No color data yet.</p>;
  }

  return (
    <div className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-2">Color Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || "#9ca3af"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
