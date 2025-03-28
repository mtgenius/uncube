import type Card from './card.js';
import getCardElement from './get-card-element.js';
import isFilterMatch from './is-filter-match.js';

export default function setVisibilities(
  cards: readonly Card[],
  value: string,
): void {
  for (const card of cards) {
    const el: HTMLElement = getCardElement(card);

    if (isFilterMatch(card.name, value)) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }
}
