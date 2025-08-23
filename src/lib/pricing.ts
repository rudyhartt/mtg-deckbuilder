export type DeckItem = {
  id: string;
  name: string;
  rarity: string;
  quantity: number;
};

// price per card in pence (so 50 = £0.50)
export const PRICE_PER_CARD = 50;

export function priceForItem(it: DeckItem): number {
  return PRICE_PER_CARD * it.quantity;
}

export function computeTotal(deck: DeckItem[]): number {
  return deck.reduce((sum, it) => sum + priceForItem(it), 0);
}
