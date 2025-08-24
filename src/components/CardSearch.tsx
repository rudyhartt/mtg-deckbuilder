"use client";
import { useEffect, useRef, useState } from "react";
// ... other imports

export default function CardSearch() {
  // [state and effects omitted for brevity]

  const totalCards = deck.reduce((sum, d) => sum + d.quantity, 0);
  const totalPrice = (totalCards * 0.5).toFixed(2);

  // Helper for hover preview positioning (not implemented in detail)
  const [hoverStyle, setHoverStyle] = useState<React.CSSProperties>({});
  const showHoverCard = (e, url) => {
    const { clientX, clientY } = e;
    setHoverUrl(url);
    setHoverStyle({ top: clientY + 10, left: clientX + 10 });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* LEFT: search & results */}
      {/* ... */}

      {/* RIGHT: Deck sidebar */}
      <aside className="w-full md:w-80 space-y-3 flex flex-col">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Your Deck</h2>
          <p className="text-sm text-gray-300 mb-4">
            {totalCards} cards · £{totalPrice}
          </p>

          {deck.length === 0 ? (
            <p className="text-gray-400">No cards in your deck yet.</p>
          ) : (
            <ul className="overflow-y-auto max-h-64 space-y-3">
              {deck.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center gap-3 hover:bg-gray-800 p-1 rounded"
                  onMouseEnter={(e) =>
                    showHoverCard(e, d.image || "")
                  }
                  onMouseLeave={() => setHoverUrl(null)}
                >
                  {d.image && (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-10 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm truncate">
                      {d.name} [{d.set}-{d.collector_number}] ×{d.quantity}
                    </p>
                    <p className="text-xs text-gray-400">{d.type_line}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleCheckout}
            disabled={loadingCheckout}
            className={`w-full py-2 rounded font-bold ${
              loadingCheckout
                ? "bg-green-800 text-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {loadingCheckout ? "Redirecting…" : "Checkout"}
          </button>
          <button
            onClick={clearDeck}
            className="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded"
          >
            🗑️ New Deck
          </button>
        </div>
      </aside>

      {/* Hover preview near cursor */}
      {hoverUrl && (
        <div
          className="fixed z-50 pointer-events-none transition-all"
          style={{ width: '180px', ...hoverStyle }}
        >
          <img
            src={hoverUrl}
            alt="Preview"
            className="rounded-lg shadow-xl border border-gray-700"
          />
        </div>
      )}
    </div>
  );
}
