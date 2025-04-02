import type Card from './card.js';
import isFilterMatch from './is-filter-match.js';

export default function setVisibilities(
  cards: readonly Card[],
  value: string,
  showBanned: boolean,
): void {
  for (const card of cards) {
    const matchesNameFilter: boolean =
      value === '' || isFilterMatch(card.name, value);
    const matchesBannedFilter: boolean = showBanned || card.banned === false;

    if (matchesNameFilter && matchesBannedFilter) {
      card.show();
    } else {
      card.hide();
    }
  }
}
