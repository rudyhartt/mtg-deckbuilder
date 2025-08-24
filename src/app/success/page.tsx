// src/app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type DeckItem = {
  id: string;
  name: string;
  set?: string;
  collector_number?: string;
  image?: string;
  rarity?: string;
  quantity: number;
  type_line?: string;
};

type ShippingInfo = {
  name: string;
  email: string;
  address: string;
};

export default function SuccessPage() {
  const params = useSearchParams();
  const isDemo = params.get("demo") === "1";

  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);

  useEffect(() => {
    const savedDeck = localStorage.getItem("deck");
    if (savedDeck) {
      try {
        setDeck(JSON.parse(savedDeck));
      } catch {
        setDeck([]);
      }
    }
    const savedShip = localStorage.getItem("shipping");
    if (savedShip) {
      try {
        setShipping(JSON.parse(savedShip));
      } catch {
        setShipping(null);
      }
    }
  }, []);

  const clearData = () => {
    localStorage.removeItem("deck");
    localStorage.removeItem("shipping");
    setDeck([]);
    setShipping(null);
    alert("Saved data cleared.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-2xl w-full text-center bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-green-400">✅ Order Successful!</h1>
        <p className="text-gray-300">
          Thanks for your order. We’ve received your deck and shipping details.
        </p>

        {isDemo && (
          <p className="text-xs text-yellow-400">
            ⚠️ Demo mode: no real payment was processed.
          </p>
        )}

        {shipping && (
          <div className="text-left mt-6">
            <h2 className="text-xl font-semibold mb-2">Shipping Info</h2>
            <p className="text-gray-200">{shipping.name}</p>
            <p className="text-gray-200">{shipping.email}</p>
            <p className="text-gray-400 whitespace-pre-line">{shipping.address}</p>
          </div>
        )}

        {deck.length > 0 && (
          <div className="text-left mt-6">
            <h2 className="text-xl font-semibold mb-3">Your Deck</h2>
            <ul className="space-y-3">
              {deck.map((d) => (
                <li key={d.id} className="flex items-center gap-3">
                  {d.image && (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-12 rounded border border-gray-700"
                    />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">
                      {d.name} [{d.set}-{d.collector_number}]
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {d.quantity} {d.type_line ? `— ${d.type_line}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="/"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition"
          >
            Back to Deckbuilder
          </a>
          <button
            onClick={clearData}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
          >
            Clear Saved Data
          </button>
        </div>
      </div>
    </div>
  );
}
