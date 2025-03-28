import CardNameFilter from './card-name-filter.js';
import type Card from './card.js';
import getCards from './get-cards.js';
import handleError from './handle-error.js';
import renderCards from './render-cards.js';

const FIRST = 0;

const CARD_NAME_FILTER: HTMLElement = window.document
  .getElementsByName('card-name')
  .item(FIRST);

const ROOT: HTMLElement | null = window.document
  .getElementsByTagName('main')
  .item(FIRST);

if (ROOT === null) {
  throw new Error('Expected a root element.');
}

try {
  const cards: readonly Card[] = getCards();
  renderCards(ROOT, cards);

  const cardNameFilter = new CardNameFilter(cards);
  CARD_NAME_FILTER.addEventListener('input', cardNameFilter.handleInput);
  window.addEventListener('keydown', (ev: KeyboardEvent): void => {
    const { ctrlKey, key } = ev;
    if (!ctrlKey || key !== 'f') {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    CARD_NAME_FILTER.focus();
  });
} catch (err: unknown) {
  handleError(err);
}
