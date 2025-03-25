import type Card from './card.js';
import getCards from './get-cards.js';
import handleError from './handle-error.js';
import renderCards from './render-cards.js';

const renderFilter = (callback: (filter: string) => void): void => {
  const handleInput = (event: Event): void => {
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { value } = target;
    callback(value);
  };

  const filter: HTMLInputElement = window.document.createElement('input');
  filter.addEventListener('input', handleInput);
  filter.setAttribute('placeholder', 'Filter by card name');
  filter.setAttribute('type', 'text');
  filter.setAttribute('value', '');
  window.document.body.appendChild(filter);
};

try {
  const cards: readonly Card[] = getCards();
  const root: HTMLDivElement = window.document.createElement('div');
  renderCards(root, cards);
  renderFilter((filter: string): void => {
    if (filter === '') {
      renderCards(root, cards);
      return;
    }

    const filterByString = ({ name }: Card): boolean =>
      name.toLowerCase().includes(filter.toLowerCase());
    renderCards(root, cards.filter(filterByString));
  });
  document.body.appendChild(root);
} catch (err: unknown) {
  handleError(err);
}
