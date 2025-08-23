import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8">
      <h1 className="text-4xl font-bold text-red-700 mb-4">❌ Checkout Cancelled</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        No worries — your order wasn’t placed.
        You can go back and edit your deck or try again when you’re ready.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Back to Deckbuilder
      </Link>
    </div>
  );
}
