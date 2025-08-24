"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { DeckItem } from "../lib/pricing";

type Props = {
  deck: DeckItem[];
};

const COLORS: Record<string, string> = {
  W: "#f9f5d7", // white
  U: "#3b82f6", // blue
  B: "#1f2937", // black
  R: "#ef4444", // red
  G: "#22c55e", // green
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
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || "#9ca3af"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem", color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
