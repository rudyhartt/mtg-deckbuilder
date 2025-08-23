export type ScryCard = {
  id: string;
  name: string;
  type_line: string;
  set_name: string;
  image_uris?: {
    small: string;
    normal: string;
  };
};

/**
 * Search Magic cards by name/query.
 * Returns only cards that have images and are not basic lands.
 */
export async function searchCards(query: string): Promise<ScryCard[]> {
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (!data?.data) return [];
    return data.data.filter(
      (card: ScryCard) =>
        card.image_uris?.small && !card.type_line.includes("Basic Land")
    );
  } catch (err) {
    console.error("Error searching cards:", err);
    return [];
  }
}

/**
 * Fetch Movers & Shakers cards dynamically for a given format.
 * Returns only cards that have images and are not basic lands.
 */
export async function fetchMoversAndShakers(format: string): Promise<ScryCard[]> {
  try {
    const q = `f:${format.toLowerCase()} order:usd`;
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&order=usd&dir=desc&unique=prints`
    );
    const data = await res.json();
    if (!data?.data) return [];
    return data.data.filter(
      (card: ScryCard) =>
        card.image_uris?.small && !card.type_line.includes("Basic Land")
    );
  } catch (err) {
    console.error("Error fetching movers & shakers:", err);
    return [];
  }
}
