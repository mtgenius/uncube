import type Card from './card.js';
import ImageQueue from './image-queue.js';
import mapCardToImageSrc from './map-card-to-image-src.js';
import './index.scss';

const EMPTY = 0;
const IMAGE_QUEUE_DELAY = 100;
const IMAGE_QUEUE = new ImageQueue(IMAGE_QUEUE_DELAY);

const PREMIUM_ICON_SRC =
  'https://user-images.githubusercontent.com/343837/83360751-a631d080-a338-11ea-80c6-110971103bf4.png';

export default function mapCardToListItem({
  cardExtra,
  name,
  premium,
  proxy,
  setExtra,
  setId,
}: Card): HTMLLIElement {
  const item: HTMLLIElement = window.document.createElement('li');

  const nameEl: HTMLSpanElement = document.createElement('span');
  nameEl.classList.add('name');
  nameEl.setAttribute('title', name);
  nameEl.appendChild(document.createTextNode(name));
  item.appendChild(nameEl);

  const image: HTMLImageElement = document.createElement('img');
  image.classList.add('image');
  image.setAttribute('height', '204');
  image.setAttribute('width', '146');
  item.appendChild(image);

  const imageSrc: string = mapCardToImageSrc({ name, setId });
  if (imageSrc.startsWith('https://api.scryfall.com/')) {
    IMAGE_QUEUE.push(image, imageSrc);
  } else {
    image.setAttribute('src', imageSrc);
  }

  if (premium) {
    item.appendChild(document.createElement('br'));
    const icon: HTMLImageElement = document.createElement('img');
    icon.classList.add('premium');
    icon.setAttribute('src', PREMIUM_ICON_SRC);
    item.appendChild(icon);
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
