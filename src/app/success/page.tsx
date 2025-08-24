// src/app/success/page.tsx
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-lg w-full text-center bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-green-400">✅ Order Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thanks for your order. We’ve received your deck and will send you a confirmation email shortly.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition"
        >
          Back to Deckbuilder
        </a>
      </div>
    </div>
  );
}
