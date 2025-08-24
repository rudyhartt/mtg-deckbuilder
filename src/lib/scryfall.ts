// src/lib/scryfall.ts

export type ScryCard = {
  id: string;               // always provided by Scryfall
  oracle_id?: string;
  name: string;
  set: string;
  collector_number: string;

  // Images
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
  };

  // Gameplay info
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity?: string[];

  // Extra metadata
  rarity?: "common" | "uncommon" | "rare" | "mythic";
  flavor_text?: string;
  artist?: string;

  // Pricing info
  prices?: {
    usd?: string | null;
    usd_foil?: string | null;
    usd_etched?: string | null;
    eur?: string | null;
    eur_foil?: string | null;
    tix?: string | null;
  };
};

export async function searchCards(query: string): Promise<ScryCard[]> {
  const res = await fetch(
    `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to search Scryfall");
  const data = await res.json();
  return data.data || [];
}

export async function fetchMoversAndShakers(format: string): Promise<ScryCard[]> {
  const res = await fetch(
    `https://api.scryfall.com/cards/search?q=f:${format}&order=tix`
  );
  if (!res.ok) throw new Error("Failed to fetch Movers & Shakers");
  const data = await res.json();
  return data.data || [];
}

export async function fetchTopStaples(format: string): Promise<ScryCard[]> {
  const res = await fetch(
    `https://api.scryfall.com/cards/search?q=f:${format}&order=edhrec`
  );
  if (!res.ok) throw new Error("Failed to fetch staples");
  const data = await res.json();
  return data.data?.slice(0, 5) || [];
}
