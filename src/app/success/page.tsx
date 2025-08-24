// src/app/success/page.tsx
"use client";

import { Suspense } from "react";
import SuccessContent from "./success-content";

export default function SuccessPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
