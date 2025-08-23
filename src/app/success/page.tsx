import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Success!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Your deck order has been placed.
        You’ll receive an email with the details soon!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Back to Deckbuilder
      </Link>
    </div>
  );
}
