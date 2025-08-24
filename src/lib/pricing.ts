// src/lib/pricing.ts

export type DeckItem = {
  id: string;
  name: string;
  set?: string;
  collector_number?: string;
  image?: string;
  quantity: number;
};

// For now, every card costs £0.50
export function calculateTotal(deck: DeckItem[]): number {
  return deck.reduce((sum, item) => sum + item.quantity * 0.5, 0);
}

export type DeckItem = {
  id: string;
  name: string;
  set?: string;
  collector_number?: string;
  image?: string;
  quantity: number;
  rarity?: string; // ✅ added
};
