import type Card from './card.js';

export default function isCardBanned({ banned }: Card): boolean {
  return banned !== false;
}
