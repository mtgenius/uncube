import { isRecord } from 'fmrs';
import cardsYaml from './cards.yml';
import type Card from './card.js';
import mapCardEntryToCards from './map-card-entry-to-cards.js';

const { cards, sets } = cardsYaml;

export default function getCards(): readonly Card[] {
  if (!isRecord(cards)) {
    throw new Error('`cards` is not a record.');
  }

  if (!isRecord(sets)) {
    throw new Error('`sets` is not a record.');
  }

  return Object.entries(cards).flatMap(mapCardEntryToCards);
}
