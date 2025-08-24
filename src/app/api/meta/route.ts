// src/app/api/meta/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensure fresh fetch on each request

export async function GET() {
  try {
    // 🔹 Fetch Standard staples sorted by MTGO price (proxy for popularity)
    const res = await fetch(
      "https://api.scryfall.com/cards/search?q=f%3Astandard&order=tix",
      { next: { revalidate: 60 } } // cache for 1 min
    );

    if (!res.ok) {
      throw new Error(`Scryfall fetch failed: ${res.status}`);
    }

    const data = await res.json();

    // 🔹 Normalize and trim response
    const staples = (data?.data || []).slice(0, 12).map((card: any) => ({
      id: card.id,
      name: card.name,
      set: card.set?.toUpperCase(),
      collector_number: card.collector_number,
      image_uris: card.image_uris,
      rarity: card.rarity,
      prices: card.prices,
    }));

    return NextResponse.json({ staples });
  } catch (err) {
    console.error("Meta API error:", err);
    return NextResponse.json({ staples: [] }, { status: 500 });
  }
}
