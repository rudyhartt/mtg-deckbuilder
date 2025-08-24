"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DeckItem } from "../lib/pricing";

type Props = {
  deck: DeckItem[];
};

export default function ManaCurveChart({ deck }: Props) {
  // Count cards by CMC
  const cmcCounts: Record<number, number> = {};

  deck.forEach((card) => {
    const cmc = card.cmc ?? 0;
    cmcCounts[cmc] = (cmcCounts[cmc] || 0) + card.quantity;
  });

  // Transform into chart data
  const data = Object.entries(cmcCounts)
    .map(([cmc, count]) => ({ cmc: Number(cmc), count }))
    .sort((a, b) => a.cmc - b.cmc);

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">No mana curve data yet.</p>;
  }

  return (
    <div className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-2">Mana Curve</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="cmc" stroke="#ccc" label={{ value: "CMC", position: "insideBottom", offset: -5, fill: "#aaa" }} />
          <YAxis stroke="#ccc" allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem", color: "#fff" }}
            cursor={{ fill: "#374151" }}
          />
          <Bar dataKey="count" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
