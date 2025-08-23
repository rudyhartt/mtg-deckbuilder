// src/app/page.tsx
import CardSearch from "@/components/CardSearch";
import MetaAnalysis from "@/components/MetaAnalysis";

export default function Home() {
  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">RUDY'S PROXIES</h1>
        <p className="text-lg text-gray-300 mt-1">
          All cards £0.50. Delivery by post or in person!
        </p>
      </header>

      {/* Deckbuilder */}
      <section className="w-full">
        <CardSearch />
      </section>

      {/* Meta section */}
      <section className="w-full mt-12">
        <MetaAnalysis />
      </section>
    </main>
  );
}
