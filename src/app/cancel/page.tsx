"use client";

import { Suspense } from "react";
import CancelContent from "./cancel-content";

export default function CancelPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
        <CancelContent />
      </Suspense>
    </div>
  );
}
