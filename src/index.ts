import type Card from './card.js';
import getCards from './get-cards.js';
import handleError from './handle-error.js';
import mapCardToDatasetId from './map-card-to-dataset-id.js';
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
  filter.setAttribute('autocomplete', 'off');
  filter.setAttribute('name', 'card-name');
  filter.setAttribute('placeholder', 'Filter by card name');
  filter.setAttribute('type', 'text');
  filter.setAttribute('value', '');
  window.document.body.appendChild(filter);
};

const setVisibility = (datasetIds: Record<string, boolean>): void => {
  for (const [datasetId, isVisible] of Object.entries(datasetIds)) {
    const item: Element | null = window.document.querySelector(
      `.card-item[data-id="${datasetId.replace(/\\/gu, '\\\\').replace(/"/gu, '\\"')}"]`,
    );
    if (item === null) {
      throw new Error(`Expected item to exist for dataset ID "${datasetId}"`);
    }

    if (isVisible) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  }
};

const setVisible = (): void => {
  for (const item of Array.from(
    window.document.querySelectorAll('.card-item.hidden'),
  )) {
    item.classList.remove('hidden');
  }
};

try {
  const cards: readonly Card[] = getCards();
  const root: HTMLDivElement = window.document.createElement('div');
  renderCards(root, cards);
  renderFilter((filter: string): void => {
    if (filter === '') {
      setVisible();
      return;
    }

    const isVisible = ({ name }: Card): boolean =>
      name.toLowerCase().includes(filter.toLowerCase());

    const reduceCardEntriesToFilterVisibility = (
      visibility: Record<string, boolean>,
      card: Card,
    ): Record<string, boolean> => ({
      ...visibility,
      [mapCardToDatasetId(card)]: isVisible(card),
    });

    setVisibility(cards.reduce(reduceCardEntriesToFilterVisibility, {}));
  });
  document.body.appendChild(root);
} catch (err: unknown) {
  handleError(err);
}
