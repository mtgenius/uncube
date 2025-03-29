import type Card from './card.js';
import mapCardToImageSrc from './map-card-to-image-src.js';
import DelayedQueue from './delayed-queue.js';
import mapCardToDatasetId from './map-card-to-dataset-id.js';
import mapBannedToText from './map-banned-to-text.js';

const DATASET_IDS = new Set<string>();
const EMPTY = 0;
const IMAGE_QUEUE_DELAY = 100;
const IMAGE_QUEUE = new DelayedQueue(IMAGE_QUEUE_DELAY);
const SINGLE = 1;

export default function mapCardToListItem(card: Card): HTMLLIElement {
  const {
    banned,
    cardExtra,
    count,
    name,
    oracle,
    premium,
    proxy,
    setExtra,
    setId,
  } = card;
  const datasetId: string = mapCardToDatasetId(card);
  if (DATASET_IDS.has(datasetId)) {
    throw new Error(`Duplicate dataset ID: ${datasetId}`);
  }

  const item: HTMLLIElement = window.document.createElement('li');
  item.classList.add('card-item');
  item.dataset['id'] = datasetId;
  DATASET_IDS.add(datasetId);

  // Name
  const nameEl: HTMLSpanElement = window.document.createElement('span');
  nameEl.classList.add('name');
  nameEl.setAttribute('title', name);
  nameEl.appendChild(document.createTextNode(name));
  item.appendChild(nameEl);

  // Image
  const image: HTMLImageElement = window.document.createElement('img');
  image.classList.add('image');
  if (premium) {
    image.classList.add('premium');
  }
  image.setAttribute('alt', name);
  image.setAttribute('height', '204');
  image.setAttribute('role', 'presentation');
  image.setAttribute('width', '146');
  item.appendChild(image);

  // For the Scryfall API, respect the throttle limit and support zoom.
  const imageSrc: string = mapCardToImageSrc({ name, setId });
  if (imageSrc.startsWith('https://api.scryfall.com/')) {
    IMAGE_QUEUE.push((): void => {
      // If a higher resolution version hasn't loaded already,
      if (image.getAttribute('src') === null) {
        image.setAttribute('src', imageSrc);
      }
    });

    // On mouse over, zoom.
    image.addEventListener('mouseover', (): void => {
      const imageSrcZoom: string = imageSrc.replace(
        'version=small',
        'version=normal',
      );
      IMAGE_QUEUE.unshift((): void => {
        image.setAttribute('src', imageSrcZoom);
      });
    });
  } else {
    image.setAttribute('src', imageSrc);
  }

  // Oracle text
  const clickText: string[] = [];
  if (typeof oracle !== 'undefined') {
    clickText.push(oracle);
  }

  // Banned
  if (banned !== false) {
    const bannedEl: HTMLElement = window.document.createElement('span');
    bannedEl.classList.add('banned');
    bannedEl.appendChild(window.document.createTextNode('X'));
    item.appendChild(bannedEl);
    if (banned.length === SINGLE) {
      clickText.push(`This card is banned due to:
${banned.map(mapBannedToText).join('\n')}`);
    } else {
      clickText.push(`This card is banned for the following reasons:
• ${banned.map(mapBannedToText).join('\n• ')}`);
    }
  }

  // Count
  if (count > SINGLE) {
    const countEl: HTMLElement = window.document.createElement('span');
    countEl.classList.add('count');
    countEl.innerHTML = `&times;${count} copies`;
    item.appendChild(countEl);
  }

  // Proxy
  if (proxy) {
    const proxyEl: HTMLElement = window.document.createElement('span');
    proxyEl.classList.add('proxy');
    proxyEl.appendChild(window.document.createTextNode('proxy'));
    item.appendChild(proxyEl);
  }

  if (Object.keys(cardExtra).length > EMPTY) {
    item.appendChild(document.createElement('br'));
    item.appendChild(
      document.createTextNode(`Card: ${JSON.stringify(cardExtra)}`),
    );
  }

  if (Object.keys(setExtra).length > EMPTY) {
    item.appendChild(document.createElement('br'));
    item.appendChild(
      document.createTextNode(`Set: ${JSON.stringify(setExtra)}`),
    );
  }

  if (clickText.length > EMPTY) {
    image.classList.add('clickable');
    image.addEventListener('click', (): void => {
      window.alert(clickText.join('\n\n'));
    });
  }

  return item;
}
