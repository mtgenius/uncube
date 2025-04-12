import type Card from './card.js';
import mapCardToDatasetId from './map-card-to-dataset-id.js';
import mapBannedToText from './map-banned-to-text.js';

const DATASET_IDS = new Set<string>();
const EMPTY = 0;
const SINGLE = 1;

const mapTokenEntryToString = ([name, count]: readonly [
  string,
  number,
]): string => `${count}× ${name}`;

export default function mapCardToListItem(card: Card): HTMLLIElement {
  const {
    banned,
    count,
    emblems,
    markers,
    name,
    oracle,
    planes,
    proxy,
    rulings,
    tokens,
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
  nameEl.appendChild(window.document.createTextNode(name));
  item.appendChild(nameEl);

  // Image
  item.appendChild(card.image);

  // Oracle text
  const clickText: string[] = [];
  if (typeof oracle !== 'undefined') {
    clickText.push(oracle);
  }

  // Banned
  if (banned !== false) {
    item.classList.add('hidden');
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

  // Emblems
  if (typeof emblems !== 'undefined') {
    clickText.push(`Necessary emblems:
• ${emblems.join('\n• ')}`);
  }

  // Markers
  if (typeof markers !== 'undefined') {
    clickText.push(`Necessary markers:
• ${markers.join('\n• ')}`);
  }

  // Planes
  if (typeof planes !== 'undefined') {
    clickText.push(`Necessary planes:
• ${planes.join('\n• ')}`);
  }

  // Rulings
  if (typeof rulings !== 'undefined') {
    clickText.push(`Rulings:
• ${rulings.join('\n• ')}`);
  }

  // Tokens
  if (typeof tokens !== 'undefined') {
    clickText.push(`Necessary tokens:
• ${Object.entries(tokens).map(mapTokenEntryToString).join('\n• ')}`);
  }

  // If it's clickable,
  if (clickText.length > EMPTY) {
    card.image.classList.add('clickable');
    card.image.addEventListener('click', (): void => {
      window.alert(clickText.join('\n\n'));
    });
  }

  return item;
}
