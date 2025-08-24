// src/lib/pricing.ts

// A card as it appears inside the user's deck list
export type DeckItem = {
  id: string;               // unique Scryfall card ID
  name: string;             // card name
  set?: string;             // set code, e.g. "MOM"
  collector_number?: string;
  image?: string;           // normal-size image URL

  // Gameplay metadata
  rarity?: "common" | "uncommon" | "rare" | "mythic";
  mana_cost?: string;       // e.g. "{1}{G}{G}"
  cmc?: number;             // converted mana cost
  type_line?: string;       // e.g. "Creature — Elf Druid"
  color_identity?: string[]; // ["G"], ["U","R"], etc.

  // Deck-specific info
  quantity: number;         // how many copies are in the deck
};

// --- Pricing utilities (optional) ---

// For now you’re charging £0.50 per card flat.
export function getCardPrice(card: DeckItem): number {
  return 0.5;
}

// Total deck price
export function calculateDeckTotal(deck: DeckItem[]): number {
  return deck.reduce((sum, card) => sum + getCardPrice(card) * card.quantity, 0);
}
