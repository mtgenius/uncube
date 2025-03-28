import type Card from './card.js';
import getCardElementByDatasetId from './get-card-element-by-dataset-id.js';
import mapCardToDatasetId from './map-card-to-dataset-id.js';

export default function getCardElement(card: Card): HTMLElement {
  const datasetId: string = mapCardToDatasetId(card);
  return getCardElementByDatasetId(datasetId);
}
