// src/app/api/meta/route.ts
import { NextResponse } from "next/server";

type ScryfallCard = {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
    large: string;
  };
  set: string;
  collector_number: string;
  rarity: string;
  mana_cost?: string;
  type_line?: string;
  colors?: string[];
};

export async function GET() {
  try {
    const res = await fetch(
      "https://api.scryfall.com/cards/search?q=format:standard&unique=cards&order=edhrec"
    );

    if (!res.ok) {
      throw new Error(`Scryfall API error: ${res.status}`);
    }

    const json = await res.json();
    const cards: ScryfallCard[] = json.data ?? [];

    // Derive color distribution
    const colorCounts: Record<string, number> = { W: 0, U: 0, B: 0, R: 0, G: 0 };
    cards.forEach((card) => {
      card.colors?.forEach((c) => {
        if (colorCounts[c] !== undefined) {
          colorCounts[c] += 1;
        }
      });
    });
    const colors = Object.entries(colorCounts).map(([color, count]) => ({ color, count }));

    // Very simple creature type counts
    const creatureTypes: Record<string, number> = {};
    cards.forEach((card) => {
      if (card.type_line?.includes("Creature")) {
        const parts = card.type_line.split("—");
        if (parts[1]) {
          parts[1].trim().split(" ").forEach((t) => {
            creatureTypes[t] = (creatureTypes[t] || 0) + 1;
          });
        }
      }
    });
    const creatureTypesArr = Object.entries(creatureTypes).map(([type, count]) => ({
      type,
      count,
    }));

    // Mana curve (count cards by converted mana cost)
    const manaCurve: Record<string, number> = {};
    cards.forEach((card) => {
      if (card.mana_cost) {
        const cmc = card.mana_cost.replace(/[^0-9]/g, "");
        const key = cmc || "X";
        manaCurve[key] = (manaCurve[key] || 0) + 1;
      }
    });
    const manaCurveArr = Object.entries(manaCurve).map(([cost, count]) => ({
      cost,
      count,
    }));

    // Placeholder archetypes (until you plug real meta data)
    const archetypes = [
      { name: "Mono-Red Aggro", count: 12 },
      { name: "Esper Control", count: 8 },
      { name: "Selesnya Midrange", count: 5 },
    ];

    return NextResponse.json({
      topCards: cards.slice(0, 20),
      colors,
      manaCurve: manaCurveArr,
      creatureTypes: creatureTypesArr,
      archetypes, // ✅ now included
    });
  } catch (err) {
    console.error("Meta API error:", err);
    return NextResponse.json(
      {
        topCards: [],
        colors: [],
        manaCurve: [],
        creatureTypes: [],
        archetypes: [],
      },
      { status: 500 }
    );
  }
}
