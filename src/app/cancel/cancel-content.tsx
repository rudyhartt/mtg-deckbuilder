"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CancelContent() {
  const params = useSearchParams();
  const reason = params.get("reason");

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold text-red-500">❌ Payment Cancelled</h1>
      {reason ? (
        <p className="text-gray-300">Reason: {reason}</p>
      ) : (
        <p className="text-gray-300">You cancelled the checkout process.</p>
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
