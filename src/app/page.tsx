// src/app/page.tsx
import CardSearch from "../components/CardSearch";
import MetaAnalysis from "../components/MetaAnalysis";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">RUDY'S PROXIES</h1>
      <p className="mb-6 text-lg text-gray-300">
        All cards £0.50. Delivery by post or in person!
      </p>

      {/* CardSearch already handles deck + sidebar */}
      <div className="w-full">
        <CardSearch />
      </div>

      {/* Meta Analysis section */}
      <div className="w-full">
        <MetaAnalysis />
      </div>
    </main>
  );
}
