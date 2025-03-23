import { isBoolean, isNumber, isRecord, isString, isUndefined } from 'fmrs';
import type Card from './card.js';
import { type SetId } from './set-id.js';
import mapSetIdToString from './map-set-id-to-string.js';
import isProxy from './is-proxy.js';

export default function mapCardEntryToCards([name, data]: readonly [
  string,
  unknown,
]): readonly Card[] {
  if (!isRecord(data)) {
    throw new Error(`Invalid data for card "${name}"`, { cause: data });
  }

  const { sets, ...restCard } = data;
  if (!Array.isArray(sets)) {
    throw new Error(`Expected an array of sets for card "${name}"`, {
      cause: sets,
    });
  }

  if (!sets.every(isRecord)) {
    throw new Error(`Invalid set for card "${name}"`, { cause: sets });
  }

  const cards: Card[] = [];
  for (const {
    id,
    premium,
    proxy,
    scryfallId,
    scryfallVariant,
    ...restSet
  } of sets) {
    const getSetId = (): SetId | string => {
      if (isString(id)) {
        return id;
      }

      if (isString(scryfallId)) {
        if (
          !isNumber(scryfallVariant) &&
          !isString(scryfallVariant) &&
          !isUndefined(scryfallVariant)
        ) {
          throw new Error(
            `Invalid Scryfall variant for card "${name}" in set "${scryfallId}"`,
            {
              cause: scryfallVariant,
            },
          );
        }
        return {
          id: scryfallId,
          type: 'scryfall',
          variant: scryfallVariant,
        };
      }

      throw new Error(`Invalid set ID for card "${name}"`, {
        cause: { id, scryfallId },
      });
    };

    const setId: SetId | string = getSetId();

    if (!isBoolean(premium)) {
      const setIdStr: string = mapSetIdToString(setId);
      throw new Error(
        `Expected to know if card "${name}" is premium in set "${setIdStr}"`,
        {
          cause: premium,
        },
      );
    }

    if (!isBoolean(proxy) && !isProxy(proxy)) {
      const setIdStr: string = mapSetIdToString(setId);
      throw new Error(
        `Expected to know if card "${name}" is proxied in set "${setIdStr}"`,
        {
          cause: premium,
        },
      );
    }

    cards.push({
      cardExtra: restCard,
      name,
      premium,
      proxy,
      setExtra: restSet,
      setId,
    });
  }

  return cards;
}
