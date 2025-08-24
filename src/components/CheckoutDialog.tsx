"use client";

import { useState } from "react";
import type { DeckItem } from "../lib/pricing";

export default function CheckoutDialog({
  deck,
  onClose,
}: {
  deck: DeckItem[];
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck,
          customer: { name, address, email },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <label className="block mb-2">
          <span className="text-sm text-gray-600">Full Name</span>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm text-gray-600">Shipping Address</span>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600">Email</span>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading || !name || !address || !email}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Pay with Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
