import { isBoolean, isRecord } from 'fmrs';
import type Card from './card.js';
import { type SetId } from './set-id.js';
import isProxy from './is-proxy.js';
import isBanned from './is-banned.js';
import type { Banned } from './banned.js';
import createSetId from './create-set-id.js';

export default function mapCardEntryToCards([name, data]: readonly [
  string,
  unknown,
]): readonly Card[] {
  if (!isRecord(data)) {
    throw new Error(`Invalid data for card "${name}"`, { cause: data });
  }

  const { banned, sets, ...restCard } = data;
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
    collectorNumber,
    id,
    image,
    premium,
    proxy,
    scryfallId,
    scryfallVariant,
    ...restSet
  } of sets) {
    const setId: SetId = createSetId({
      collectorNumber,
      id,
      image,
      name,
      scryfallId,
      scryfallVariant,
    });

    if (!isBoolean(premium)) {
      throw new Error(
        `Expected to know if card "${name}" is premium in set "${setId.id}"`,
        {
          cause: premium,
        },
      );
    }

    if (!isBoolean(proxy) && !isProxy(proxy)) {
      throw new Error(
        `Expected to know if card "${name}" is proxied in set "${setId.id}"`,
        {
          cause: premium,
        },
      );
    }

    const getBanned = (): readonly Banned[] | false => {
      if (typeof banned === 'undefined') {
        return false;
      }

      if (isBanned(banned)) {
        return [banned];
      }

      if (Array.isArray(banned) && banned.every(isBanned)) {
        return banned;
      }

      throw new Error(`Invalid ban reason for "${name}" in "${setId.id}"`, {
        cause: banned,
      });
    };

    cards.push({
      banned: getBanned(),
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
