"use client";

import { useEffect, useRef, useState } from "react";
import {
  searchCards,
  fetchMoversAndShakers,
  type ScryCard,
} from "../lib/scryfall";
import type { DeckItem } from "../lib/pricing";

import ManaCurveChart from "./ManaCurveChart";
import ColorPieChart from "./ColorPieChart";
import TopCreatureSubtypes from "./TopCreatureSubtypes";

type ShippingInfo = {
  name: string;
  email: string;
  address: string;
};

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ScryCard[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [format, setFormat] = useState("standard");
  const [moversAndShakers, setMoversAndShakers] = useState<ScryCard[]>([]);
  const [loadingMovers, setLoadingMovers] = useState(false);

  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
  });

  // 🔹 Load deck + shipping from localStorage
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
        setShipping({ name: "", email: "", address: "" });
      }
    }
  }, []);

  // 🔹 Save deck to localStorage
  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(deck));
  }, [deck]);

  // 🔹 Save shipping info to localStorage
  useEffect(() => {
    localStorage.setItem("shipping", JSON.stringify(shipping));
  }, [shipping]);

  // Movers & Shakers fetch
  useEffect(() => {
    (async () => {
      setLoadingMovers(true);
      try {
        const cards = await fetchMoversAndShakers(format);
        setMoversAndShakers(cards.slice(0, 12));
      } catch (e) {
        console.error("M&S fetch failed:", e);
        setMoversAndShakers([]);
      } finally {
        setLoadingMovers(false);
      }
    })();
  }, [format]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await searchCards(query);
        setSearchResults(res.slice(0, 12));
      } catch (e) {
        console.error("Search failed:", e);
      }
    }, 350);
  }, [query]);

  // Deck helpers
  const addToDeck = (card: ScryCard) => {
    setDeck((prev) => {
      const found = prev.find((d) => d.id === card.id);
      if (found) {
        return prev.map((d) =>
          d.id === card.id ? { ...d, quantity: d.quantity + 1 } : d
        );
      }
      return [
        ...prev,
        {
          id: card.id!,
          name: card.name,
          set: card.set?.toUpperCase(),
          collector_number: card.collector_number,
          image: card.image_uris?.normal,
          rarity: card.rarity,
          mana_cost: card.mana_cost,
          cmc: card.cmc,
          type_line: card.type_line,
          color_identity: card.color_identity,
          quantity: 1,
        },
      ];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setDeck((prev) =>
      prev
        .map((d) =>
          d.id === id ? { ...d, quantity: d.quantity + delta } : d
        )
        .filter((d) => d.quantity > 0)
    );
  };

  const total = deck.reduce((s, d) => s + d.quantity * 0.5, 0);

  // Rarity badge helper
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

  // 🔹 Checkout handler
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_items: deck.map((d) => ({
            price_data: {
              currency: "gbp",
              product_data: {
                name: d.name,
              },
              unit_amount: 50, // 50p per card
            },
            quantity: d.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // redirect
      } else {
        alert("Checkout failed: no URL returned.");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Check console.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* LEFT: Search + Movers */}
      <div className="flex-1 space-y-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cards..."
          className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white"
        />

        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((c) => (
              <div
                key={c.id}
                className="bg-gray-900 rounded-lg p-2 shadow hover:shadow-lg cursor-pointer transition"
                onClick={() => addToDeck(c)}
                onMouseEnter={() =>
                  setHoverUrl(c.image_uris?.large || c.image_uris?.normal || null)
                }
                onMouseLeave={() => setHoverUrl(null)}
              >
                {c.image_uris?.normal && (
                  <img src={c.image_uris.normal} alt={c.name} className="card-img" />
                )}
                <p className="text-sm text-white mt-2">
                  {c.name} [{c.set?.toUpperCase()}-{c.collector_number}]
                </p>
                {rarityBadge(c.rarity)}
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Movers & Shakers</h2>
            <select
              className="bg-gray-900 border border-gray-700 text-white rounded px-2 py-1"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="pioneer">Pioneer</option>
              <option value="legacy">Legacy</option>
              <option value="vintage">Vintage</option>
              <option value="commander">Commander</option>
            </select>
          </div>

          {loadingMovers ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {moversAndShakers.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-900 rounded-lg p-2 shadow hover:shadow-lg cursor-pointer transition"
                  onClick={() => addToDeck(c)}
                  onMouseEnter={() =>
                    setHoverUrl(c.image_uris?.large || c.image_uris?.normal || null)
                  }
                  onMouseLeave={() => setHoverUrl(null)}
                >
                  {c.image_uris?.normal && (
                    <img src={c.image_uris.normal} alt={c.name} className="card-img" />
                  )}
                  <p className="text-sm text-white mt-2">
                    {c.name} [{c.set?.toUpperCase()}-{c.collector_number}]
                  </p>
                  {rarityBadge(c.rarity)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Deck + Checkout */}
      <aside className="w-full md:w-80 space-y-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-fit">
          <h2 className="text-lg font-bold mb-4">Your Deck</h2>

          {deck.length === 0 ? (
            <p className="text-gray-400">No cards in your deck yet.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {deck.map((d) => (
                  <li key={d.id} className="flex items-center gap-3">
                    {d.image && <img src={d.image} alt={d.name} className="w-12 rounded" />}
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {d.name} [{d.set}-{d.collector_number}]
                      </p>
                      {rarityBadge(d.rarity)}
                      {d.mana_cost && (
                        <p className="text-xs text-gray-300 mt-0.5">
                          Mana Cost: {d.mana_cost}
                        </p>
                      )}
                      {d.type_line && (
                        <p className="text-xs text-gray-400">{d.type_line}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                          onClick={() => changeQty(d.id, -1)}
                        >
                          −
                        </button>
                        <span className="text-white">{d.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                          onClick={() => changeQty(d.id, +1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-gray-700 pt-3 space-y-3">
                <p className="text-white font-semibold">
                  Total: £{total.toFixed(2)}
                </p>

                {/* Shipping Info Form */}
                <div className="space-y-2 text-left">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shipping.name}
                    onChange={(e) =>
                      setShipping({ ...shipping, name: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                  />
                  <textarea
                    placeholder="Shipping Address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                  />
                </div>

                <button
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>

        <ManaCurveChart deck={deck} />
        <ColorPieChart deck={deck} />
        <TopCreatureSubtypes deck={deck} />
      </aside>

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
