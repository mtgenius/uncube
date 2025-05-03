import type Card from './card.js';

export default function reduceCardsToCount(
  sum: number,
  { banned, count }: Card,
): number {
  if (banned !== false) {
    return sum;
  }

  return sum + count;
}
