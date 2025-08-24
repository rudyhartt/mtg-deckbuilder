export const dynamic = "force-dynamic";

// src/app/api/meta/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://api.scryfall.com/bulk-data/default_cards");
    const bulk = await res.json();

    const fileRes = await fetch(bulk.download_uri);
    const cards = await fileRes.json();

    const standardCards = cards.filter((c: any) => c.legalities?.standard === "legal");

    // WUBRG color counts
    const colorCounts: Record<string, number> = { W: 0, U: 0, B: 0, R: 0, G: 0 };
    standardCards.forEach((c: any) => {
      if (c.colors?.length === 1) {
        colorCounts[c.colors[0]]++;
      }
    });
    const colors = Object.entries(colorCounts).map(([name, value]) => ({ name, value }));

    // Creature subtypes
    const subtypeCounts: Record<string, number> = {};
    standardCards.forEach((c: any) => {
      if (c.type_line?.includes("Creature")) {
        const match = c.type_line.split("—")[1];
        if (match) {
          const subtypes: string[] = match.split(" ");
          subtypes.forEach((st: string) => {
            const key = st.trim();
            if (key) subtypeCounts[key] = (subtypeCounts[key] || 0) + 1;
          });
        }
      }
    });

    const archetypes = Object.entries(subtypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Top cards
    const topPool = standardCards
      .filter((c: any) => c.rarity !== "common" && c.image_uris?.normal)
      .sort(
        (a: any, b: any) =>
          new Date(b.released_at).getTime() - new Date(a.released_at).getTime()
      )
      .slice(0, 50);

    const shuffled = [...topPool].sort(() => Math.random() - 0.5);
    const topCards = shuffled.slice(0, 5).map((c: any) => ({
      id: c.id,
      oracle_id: c.oracle_id,
      name: c.name,
      set: c.set.toUpperCase(),
      collector_number: c.collector_number,
      image: c.image_uris?.normal || null,
    }));

    return NextResponse.json({
      format: "standard",
      updatedAt: new Date().toISOString(),
      colors,
      archetypes,
      topCards,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
