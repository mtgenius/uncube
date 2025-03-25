import { isString, sortEntriesByKey } from 'fmrs';
import type Card from './card.js';
import DefinedMap from './defined-map.js';
import type { HTMLListElement } from './html-list-element.js';
import mapCardToListItem from './map-card-to-list-item.js';

const SET_LISTS = new DefinedMap<HTMLListElement>(
  (): HTMLListElement => window.document.createElement('ul'),
);

export default function renderCards(
  root: HTMLElement,
  cards: readonly Card[],
): void {
  for (; root.firstChild !== null; ) {
    root.removeChild(root.firstChild);
  }

  for (const list of SET_LISTS.values) {
    for (; list.firstChild !== null; ) {
      list.removeChild(list.firstChild);
    }
  }

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
    // Don't render empty sets.
    if (list.firstChild === null) {
      continue;
    }

    const section: HTMLElement = window.document.createElement('section');
    const heading: HTMLHeadingElement = window.document.createElement('h2');
    heading.appendChild(window.document.createTextNode(setName));
    section.appendChild(heading);
    section.appendChild(list);
    root.appendChild(section);
  }
}
