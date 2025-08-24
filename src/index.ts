import { isString, sortEntriesByKey } from 'fmrs';
import type Card from './card.js';
import getCards from './get-cards.js';
import handleError from './handle-error.js';
import DefinedMap from './defined-map.js';
import type { HTMLListElement } from './html-list-element.js';
import mapCardToListItem from './map-card-to-list-item.js';
import setVisibilities from './set-visibilities.js';
import sortTokenEntries from './sort-token-entries.js';
import mapTokenEntryToListItems from './map-token-entry-to-list-items.js';
import reduceCardsToCount from './reduce-cards-to-count.js';
import sum from './sum.js';
import isCardBanned from './is-card-banned.js';

const FIRST = 0;
const NONE = 0;

const BANNED_FILTER: HTMLElement = window.document
  .getElementsByName('banned')
  .item(FIRST);

const CARD_NAME_FILTER: HTMLElement = window.document
  .getElementsByName('card-name')
  .item(FIRST);

const ROOT: HTMLElement | null = window.document
  .getElementsByTagName('main')
  .item(FIRST);

const SET_LISTS = new DefinedMap<HTMLListElement>(
  (): HTMLListElement => window.document.createElement('ul'),
);

if (ROOT === null) {
  throw new Error('Expected a root element.');
}

try {
  const cards: readonly Card[] = getCards();

  const tokens: Record<string, readonly number[]> = {};
  for (const card of cards) {
    const { count, setCard, tokens: cardTokens } = card;
    const { id: setId, name: setName } = setCard;
    if (!isString(setName)) {
      throw new Error(
        `Missing set name for card "${card.name}" set "${setId}"`,
      );
    }

    if (typeof cardTokens !== 'undefined') {
      for (const [tokenName, tokenCount] of Object.entries(cardTokens)) {
        const previousTokenCounts: readonly number[] = tokens[tokenName] ?? [];
        for (let cc = 0; cc < count; cc++) {
          tokens[tokenName] = [...previousTokenCounts, tokenCount];
        }
      }
    }

    const list: HTMLListElement = SET_LISTS.get(setName);
    const listItem: HTMLLIElement = mapCardToListItem(card);
    list.appendChild(listItem);

    /**
     *   Since the images load asynchronously, we want them to load in the order
     * we mount them, not in the order the `Card` instances was instantiated.
     */
    card.setImageSrc();
  }

  const metadataSection: HTMLElement = window.document.createElement('section');
  metadataSection.classList.add('metadata');
  metadataSection.appendChild(
    window.document.createTextNode(
      `${cards.reduce(reduceCardsToCount, NONE)} cards (+ ${cards.filter(isCardBanned).length} banned) / ${Object.values(tokens).reduce((count: number, counts: readonly number[]): number => count + sum(...counts), NONE)} tokens`,
    ),
  );
  ROOT.appendChild(metadataSection);

  for (const [setName, list] of [...SET_LISTS.entries].sort(sortEntriesByKey)) {
    const section: HTMLElement = window.document.createElement('section');
    section.classList.add('cards');
    const heading: HTMLHeadingElement = window.document.createElement('h2');
    heading.appendChild(window.document.createTextNode(setName));
    section.appendChild(heading);
    section.appendChild(list);
    ROOT.appendChild(section);
  }

  if (!(BANNED_FILTER instanceof HTMLInputElement)) {
    throw new Error(`Expected banned filter to be an input element.`, {
      cause: BANNED_FILTER,
    });
  }

  if (!(CARD_NAME_FILTER instanceof HTMLInputElement)) {
    throw new Error(`Expected card name filter to be an input element.`, {
      cause: CARD_NAME_FILTER,
    });
  }

  const filter = (): void => {
    const cardName: string = CARD_NAME_FILTER.value;
    const showBanned: boolean = BANNED_FILTER.checked;
    setVisibilities(cards, cardName, showBanned);
  };

  BANNED_FILTER.addEventListener('input', filter);
  CARD_NAME_FILTER.addEventListener('input', filter);

  // Tokens
  const section: HTMLElement = window.document.createElement('section');
  section.classList.add('tokens');
  const heading: HTMLHeadingElement = window.document.createElement('h2');
  heading.appendChild(window.document.createTextNode('Tokens'));
  section.appendChild(heading);
  const list: HTMLListElement = window.document.createElement('ul');
  for (const tokenEntry of Object.entries(tokens).sort(sortTokenEntries)) {
    for (const listItem of mapTokenEntryToListItems(tokenEntry)) {
      list.appendChild(listItem);
    }
  }
  section.appendChild(list);
  ROOT.appendChild(section);

  // Ctrl-F focuses the card name filter.
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
