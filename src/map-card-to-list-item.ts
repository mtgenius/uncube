import type Card from './card.js';
import mapCardToImageSrc from './map-card-to-image-src.js';
import './index.scss';
import DelayedQueue from './delayed-queue.js';
import mapCardToDatasetId from './map-card-to-dataset-id.js';

const DATASET_IDS = new Set<string>();
const EMPTY = 0;
const IMAGE_QUEUE_DELAY = 100;
const IMAGE_QUEUE = new DelayedQueue(IMAGE_QUEUE_DELAY);

export default function mapCardToListItem(card: Card): HTMLLIElement {
  const { cardExtra, name, premium, proxy, setExtra, setId } = card;
  const datasetId: string = mapCardToDatasetId(card);
  if (DATASET_IDS.has(datasetId)) {
    throw new Error(`Duplicate dataset ID: ${datasetId}`);
  }

  const item: HTMLLIElement = window.document.createElement('li');
  item.classList.add('card-item');
  item.dataset['id'] = datasetId;
  DATASET_IDS.add(datasetId);

  const nameEl: HTMLSpanElement = document.createElement('span');
  nameEl.classList.add('name');
  nameEl.setAttribute('title', name);
  nameEl.appendChild(document.createTextNode(name));
  item.appendChild(nameEl);

  const image: HTMLImageElement = document.createElement('img');
  image.classList.add('image');
  if (premium) {
    image.classList.add('premium');
  }
  image.setAttribute('height', '204');
  image.setAttribute('role', 'presentation');
  image.setAttribute('width', '146');
  item.appendChild(image);

  const imageSrc: string = mapCardToImageSrc({ name, setId });

  // For the Scryfall API, respect the throttle limit and support zoom.
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
    item.appendChild(document.createTextNode(Object.keys(setExtra).join(', ')));
  }

  return item;
}
