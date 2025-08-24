"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit_amount: number;
  currency: string;
  description?: string;
  image?: string;
};

type SessionPayload = {
  id: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  deckName: string;
  items: Item[];
  error?: string;
};

function formatMoney(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format((cents || 0) / 100);
  } catch {
    // Fallback for unusual currency codes
    return `${(cents || 0) / 100} ${currency}`;
  }
}

export default function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || params.get("id") || params.get("session");
  const [data, setData] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load session");
        }
        setData(json);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  const subtotal = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.reduce((sum, i) => sum + (i.unit_amount || 0) * (i.quantity || 1), 0);
  }, [data]);

  return (
    <div className="mx-auto max-w-3xl w-full space-y-6 text-center">
      <h1 className="text-3xl font-bold text-green-500">✅ Payment Successful</h1>

      {!sessionId && (
        <p className="text-gray-300">
          Missing <code>session_id</code> in URL. If you just paid, please return via Stripe's
          redirect link or contact support.
        </p>
      )}

      {loading && <p className="text-gray-400">Loading your order…</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {data && (
        <div className="space-y-4">
          <p className="text-gray-300">
            Thanks for your purchase{data.customer_email ? `, ${data.customer_email}` : ""}! 🎉
          </p>
          <div className="bg-zinc-900/40 rounded-2xl p-4 text-left border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{data.deckName}</h2>
                <p className="text-sm text-gray-400">Order ID: {data.id}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {formatMoney(data.amount_total, data.currency)}
                </div>
                <div className="text-xs text-gray-400">
                  Subtotal: {formatMoney(subtotal, data.currency)}
                </div>
              </div>
            </div>

            <div className="mt-4 divide-y divide-zinc-800">
              {data.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-12 object-cover rounded-md border border-zinc-800"
                    />
                  ) : (
                    <div className="h-16 w-12 rounded-md bg-zinc-800/60" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-400">{item.description}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-300">x{item.quantity}</div>
                  <div className="text-sm font-medium">
                    {formatMoney((item.unit_amount || 0) * (item.quantity || 1), item.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded"
      >
        ⬅️ Return Home
      </Link>
    </div>
  );
}
