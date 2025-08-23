// src/lib/scryfall.ts

export type ScryCard = {
  id?: string;
  oracle_id?: string;
  name: string;
  set: string;
  collector_number: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
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
    `https://api.scryfall.com/cards/search?q=f:/${format}/&order=tix`
  );
  if (!res.ok) throw new Error("Failed to fetch Movers & Shakers");
  const data = await res.json();
  return data.data || [];
}
