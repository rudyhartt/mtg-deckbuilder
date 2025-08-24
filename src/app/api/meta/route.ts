// src/app/api/meta/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ⬅️ stops Next.js from pre-rendering at build

export async function GET() {
  try {
    // Minimal fetch: don't pull the whole default-cards dump (too large for Vercel)
    // Instead, query Scryfall for Standard staples
    const res = await fetch(
      "https://api.scryfall.com/cards/search?q=format:standard&order=edhrec&unique=cards",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch meta" }, { status: 500 });
    }

    const data = await res.json();

    // Extract top 10 cards (could be tuned to your needs)
    const staples = (data?.data || []).slice(0, 10).map((card: any) => ({
      id: card.id,
      name: card.name,
      set: card.set,
      collector_number: card.collector_number,
      image: card.image_uris?.small,
      rarity: card.rarity,
    }));

    return NextResponse.json({
      staples,
      count: staples.length,
    });
  } catch (err) {
    console.error("Meta API failed:", err);
    return NextResponse.json({ error: "Meta API error" }, { status: 500 });
  }
}
