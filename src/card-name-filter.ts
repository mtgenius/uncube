import type Card from './card.js';
import setVisibilities from './set-visibilities.js';
import setVisible from './set-visible.js';

export default class CardNameFilter {
  readonly #cards: readonly Card[];
  public constructor(cards: readonly Card[]) {
    this.#cards = cards;
  }

  public handleInput = (event: Event): void => {
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) {
      throw new Error('Expected an input element.');
    }

    const { value } = target;
    if (value === '') {
      setVisible();
      return;
    }

    setVisibilities(this.#cards, value);
  };
}
