import { isBoolean, isNumber, isRecord, isString } from 'fmrs';
import type Card from './card.js';
import { type SetId } from './set-id.js';
import isProxy from './is-proxy.js';
import isBanned from './is-banned.js';
import type { Banned } from './banned.js';
import createSetId from './create-set-id.js';

const EMPTY = 0;
const SINGLE = 1;

export default function mapCardEntryToCards([name, data]: readonly [
  string,
  unknown,
]): readonly Card[] {
  if (!isRecord(data)) {
    throw new Error(`Invalid data for card "${name}"`, { cause: data });
  }

  const {
    banned: cardBanned,
    emblems,
    markers,
    oracle,
    planes,
    sets,
    source,
    tokens,
    ...restCard
  } = data;
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
    artist,
    banned: setBanned,
    collectorNumber,
    count = SINGLE,
    id,
    image,
    premium,
    proxy,
    scryfallId,
    scryfallVariant,
    tcgplayerId,
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

    if (!isNumber(count)) {
      throw new Error(
        `Expected count to be numeric for card "${name}" in set "${setId.id}"`,
        { cause: count },
      );
    }

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

    const getArtist = (): string | undefined => {
      if (typeof artist === 'undefined') {
        return;
      }

      if (isString(artist)) {
        return artist;
      }

      throw new Error(`Expected artist to be a string for card "${name}"`, {
        cause: artist,
      });
    };

    const banned: Banned[] = [];
    if (typeof cardBanned !== 'undefined') {
      if (isBanned(cardBanned)) {
        banned.push(cardBanned);
      } else if (Array.isArray(cardBanned) && cardBanned.every(isBanned)) {
        banned.push(...cardBanned);
      } else {
        throw new Error(`Invalid ban reason for "${name}" in "${setId.id}"`, {
          cause: cardBanned,
        });
      }
    }

    if (typeof setBanned !== 'undefined') {
      if (isBanned(setBanned)) {
        banned.push(setBanned);
      } else if (Array.isArray(setBanned) && setBanned.every(isBanned)) {
        banned.push(...setBanned);
      } else {
        throw new Error(`Invalid ban reason for "${name}" in "${setId.id}"`, {
          cause: setBanned,
        });
      }
    }

    const getBanned = (): readonly Banned[] | false => {
      if (banned.length === EMPTY) {
        return false;
      }

      return banned;
    };

    const getOracle = (): string | undefined => {
      if (typeof oracle === 'undefined') {
        return;
      }

      if (isString(oracle)) {
        return oracle;
      }

      throw new Error(
        `Expected Oracle text to be a string for card "${name}"`,
        { cause: oracle },
      );
    };

    const getSource = (): string | undefined => {
      if (typeof source === 'undefined') {
        return;
      }

      if (isString(source)) {
        return source;
      }

      throw new Error(`Expected source to be a string for card "${name}"`, {
        cause: source,
      });
    };

    const getTcgplayerId = (): number | undefined => {
      if (typeof tcgplayerId === 'undefined') {
        return;
      }

      if (isNumber(tcgplayerId)) {
        return tcgplayerId;
      }

      throw new Error(
        `Expected TCGPlayer ID to be a number for card "${name}"`,
        {
          cause: tcgplayerId,
        },
      );
    };

    cards.push({
      artist: getArtist(),
      banned: getBanned(),
      cardExtra: restCard,
      count,
      emblems: emblems as undefined,
      markers: markers as undefined,
      name: name.replace(/\\"/gu, '"'),
      oracle: getOracle(),
      planes: planes as undefined,
      premium,
      proxy,
      setExtra: restSet,
      setId,
      source: getSource(),
      tcgplayerId: getTcgplayerId(),
      tokens: tokens as undefined,
    });
  }

  return cards;
}
