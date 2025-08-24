// src/app/success/success-content.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-green-500 mb-2">
        ✅ Payment Successful!
      </h1>
      {email ? (
        <p className="text-gray-300">A confirmation was sent to: {email}</p>
      ) : (
        <p className="text-gray-300">Your order has been confirmed.</p>
      )}
    </div>
  );
}
