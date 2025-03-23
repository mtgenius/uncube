import { mapToString } from 'fmrs';
import type Card from './card.js';
import getCards from './get-cards.js';
import mapSetIdToString from './map-set-id-to-string.js';
import './index.css';

type HTMLListElement = HTMLOListElement | HTMLUListElement;

const EMPTY = 0;
const PREMIUM_ICON_SRC =
  'https://user-images.githubusercontent.com/343837/83360751-a631d080-a338-11ea-80c6-110971103bf4.png';

try {
  const cards: readonly Card[] = getCards();

  const list: HTMLListElement = window.document.createElement('ul');
  for (const { cardExtra, name, premium, proxy, setExtra, setId } of cards) {
    const setIdStr: string = mapSetIdToString(setId);
    const item: HTMLLIElement = window.document.createElement('li');

    if (premium) {
      const icon: HTMLImageElement = document.createElement('img');
      icon.setAttribute('src', PREMIUM_ICON_SRC);
      item.appendChild(icon);
    } else {
      item.appendChild(document.createElement('span'));
    }

    item.appendChild(document.createTextNode(' '));
    item.appendChild(
      document.createTextNode(
        `[${setIdStr.substring(0, 8)}] ${name.substring(0, 16)}`,
      ),
    );

    if (proxy) {
      item.appendChild(document.createElement('br'));
      item.appendChild(document.createTextNode('proxied'));
    }

    if (Object.keys(cardExtra).length > EMPTY) {
      item.appendChild(document.createElement('br'));
      item.appendChild(
        document.createTextNode(Object.keys(cardExtra).join(', ')),
      );
    }

    if (Object.keys(setExtra).length > EMPTY) {
      item.appendChild(document.createElement('br'));
      item.appendChild(
        document.createTextNode(Object.keys(setExtra).join(', ')),
      );
    }

    list.appendChild(item);
  }

  window.document.body.appendChild(list);
} catch (err: unknown) {
  const message: HTMLDivElement = window.document.createElement('div');
  message.appendChild(document.createTextNode(mapToString(err)));
  window.document.body.appendChild(message);
}
