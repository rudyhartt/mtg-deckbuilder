// src/app/cancel/page.tsx
"use client";

import { useEffect, useState } from "react";

type DeckItem = {
  id: string;
  name: string;
  set?: string;
  collector_number?: string;
  image?: string;
  quantity: number;
};

export default function CancelPage() {
  const [deck, setDeck] = useState<DeckItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("deck");
    if (saved) {
      try {
        setDeck(JSON.parse(saved));
      } catch {
        setDeck([]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-2xl w-full text-center bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-red-400">❌ Checkout Cancelled</h1>
        <p className="text-gray-300">
          Looks like you didn’t finish your purchase. Don’t worry—you can try again anytime.
        </p>

        {deck.length > 0 && (
          <div className="text-left mt-6">
            <h2 className="text-xl font-semibold mb-3">Your Deck</h2>
            <ul className="space-y-3">
              {deck.map((d) => (
                <li key={d.id} className="flex items-center gap-3">
                  {d.image && (
                    <img src={d.image} alt={d.name} className="w-12 rounded border border-gray-700" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">
                      {d.name} [{d.set}-{d.collector_number}]
                    </p>
                    <p className="text-xs text-gray-400">Qty: {d.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href="/"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition"
        >
          Back to Deckbuilder
        </a>
      </div>
    </div>
  );
}
