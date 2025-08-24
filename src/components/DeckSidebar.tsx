"use client";

import { useState, useEffect } from "react";
import type { DeckItem } from "../lib/pricing";
import "./DeckSidebar.css"; // Make sure this CSS file exists to remove spinners

export default function DeckSidebar({
  deck = [],
  onChangeQuantity,
}: {
  deck?: DeckItem[];
  onChangeQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <div className="w-full md:w-80 p-4 border border-gray-700 rounded-xl bg-black text-white shadow">
      <h2 className="text-lg font-bold mb-4">Your Deck</h2>

      {deck.length === 0 && (
        <p className="text-gray-400">No cards in your deck yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {deck.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 p-2 border border-gray-700 rounded hover:bg-gray-800"
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.name}
                className="w-12 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold">{card.name}</div>
              <div className="text-sm text-gray-400">{card.rarity}</div>
            </div>

            {/* Editable quantity with custom buttons */}
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 rounded bg-white text-black hover:bg-gray-300 disabled:opacity-50"
                onClick={() =>
                  onChangeQuantity(card.id, Math.max(1, card.quantity - 1))
                }
                disabled={card.quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={card.quantity}
                onChange={(e) =>
                  onChangeQuantity(
                    card.id,
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                className="w-12 text-white text-center rounded border border-gray-600 px-1 py-0.5 bg-gray-800 no-spinner"
              />
              <button
                className="px-2 py-1 rounded bg-white text-black hover:bg-gray-300"
                onClick={() => onChangeQuantity(card.id, card.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total cards */}
      {deck.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-2 text-white">
          <p className="font-semibold">
            Total Cards: {deck.reduce((sum, card) => sum + card.quantity, 0)}
          </p>
        </div>
      )}
    </div>
  );
}
