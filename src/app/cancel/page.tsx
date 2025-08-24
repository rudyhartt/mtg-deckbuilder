// src/app/cancel/page.tsx
export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-lg w-full text-center bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-red-400">❌ Checkout Cancelled</h1>
        <p className="text-gray-300 mb-6">
          Looks like you didn’t finish your purchase. Don’t worry—you can always try again.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition"
        >
          Back to Deckbuilder
        </a>
      </div>
    </div>
  );
}
