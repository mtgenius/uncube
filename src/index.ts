import { isString, sortEntriesByKey } from 'fmrs';
import type Card from './card.js';
import getCards from './get-cards.js';
import type { HTMLListElement } from './html-list-element.js';
import mapCardToListItem from './map-card-to-list-item.js';
import DefinedMap from './defined-map.js';
import handleError from './handle-error.js';

const SET_LISTS = new DefinedMap<HTMLListElement>(
  (): HTMLListElement => window.document.createElement('ul'),
);

try {
  const cards: readonly Card[] = getCards();

  for (const card of cards) {
    const { name } = card.setId;
    if (!isString(name)) {
      throw new Error(
        `Missing set name for card "${card.name}" set "${card.setId.id}"`,
      );
    }

    const list: HTMLListElement = SET_LISTS.get(name);
    const listItem: HTMLLIElement = mapCardToListItem(card);
    list.appendChild(listItem);
  }

  for (const [setName, list] of [...SET_LISTS.entries].sort(sortEntriesByKey)) {
    const section: HTMLElement = window.document.createElement('section');
    const heading: HTMLHeadingElement = window.document.createElement('h2');
    heading.appendChild(window.document.createTextNode(setName));
    section.appendChild(heading);
    section.appendChild(list);
    window.document.body.appendChild(section);
  }
} catch (err: unknown) {
  handleError(err);
}
