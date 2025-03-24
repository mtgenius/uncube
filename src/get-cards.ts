import { isRecord, isString } from 'fmrs';
import cards from './cards.yml';
import sets from './sets.yml';
import type Card from './card.js';
import sortBySet from './sort-by-set.js';
import mapCardEntryToCards from './map-card-entry-to-cards.js';

export default function getCards(): readonly Card[] {
  if (!isRecord(cards)) {
    throw new Error('`cards` is not a record.');
  }

  if (!isRecord(sets)) {
    throw new Error('`sets` is not a record.');
  }

  const setNames = new Map<string, string>();
  for (const [name, data] of Object.entries(sets)) {
    if (!isRecord(data)) {
      throw new Error(`Invalid data for set "${name}"`, { cause: data });
    }

    const { id, scryfallId, source } = data;
    if (isString(id)) {
      setNames.set(id, name);
    }

    if (isString(scryfallId)) {
      setNames.set(scryfallId, name);
    }

    // Unofficial sets
    if (!isString(id) && !isString(scryfallId) && isString(source)) {
      setNames.set(name, name);
    }
  }

  const mapToSetName = ({ setId, ...card }: Card): Card => ({
    ...card,
    setId: {
      ...setId,
      name: setNames.get(setId.id),
    },
  });

  return Object.entries(cards)
    .flatMap(mapCardEntryToCards)
    .map(mapToSetName)
    .sort(sortBySet);
}
