import { isBoolean, isNumber, isRecord, isString } from 'fmrs';
import Card from './card.js';
import { type SetCard } from './set-card.js';
import isProxy from './is-proxy.js';
import isBanned from './is-banned.js';
import type { Banned } from './banned.js';
import createSetCard from './create-set-card.js';

const EMPTY = 0;
const SINGLE = 1;

export default function mapCardEntryToCards([cardName, data]: readonly [
  string,
  unknown,
]): readonly Card[] {
  if (!isRecord(data)) {
    throw new Error(`Invalid data for card "${cardName}"`, { cause: data });
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

  // If we missed any properties, we want to know.
  const restCardKeys: readonly string[] = Object.keys(restCard);
  if (restCardKeys.length > EMPTY) {
    const restCardKeysStr: string = restCardKeys.join(', ');
    throw new Error(
      `Unexpected properties on card "${cardName}": ${restCardKeysStr}`,
      { cause: restCard },
    );
  }

  if (!Array.isArray(sets)) {
    throw new Error(`Expected an array of sets for card "${cardName}"`, {
      cause: sets,
    });
  }

  if (!sets.every(isRecord)) {
    throw new Error(`Invalid set for card "${cardName}"`, { cause: sets });
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
    const setCard: SetCard = createSetCard({
      collectorNumber,
      id,
      image,
      name: cardName,
      scryfallId,
      scryfallVariant,
    });

    // If we missed any properties, we want to know.
    const restSetKeys: readonly string[] = Object.keys(restSet);
    if (restSetKeys.length > EMPTY) {
      const restSetKeysStr: string = restSetKeys.join(', ');
      throw new Error(
        `Unexpected properties on card "${cardName}" in set "${setCard.id}": ${restSetKeysStr}`,
        { cause: restSet },
      );
    }

    if (!isNumber(count)) {
      throw new Error(
        `Expected count to be numeric for card "${cardName}" in set "${setCard.id}"`,
        { cause: count },
      );
    }

    if (!isBoolean(premium)) {
      throw new Error(
        `Expected to know if card "${cardName}" is premium in set "${setCard.id}"`,
        { cause: premium },
      );
    }

    if (!isBoolean(proxy) && !isProxy(proxy)) {
      throw new Error(
        `Expected to know if card "${cardName}" is proxied in set "${setCard.id}"`,
        { cause: premium },
      );
    }

    const getArtist = (): string | undefined => {
      if (typeof artist === 'undefined') {
        return;
      }

      if (isString(artist)) {
        return artist;
      }

      throw new Error(
        `Expected artist to be a string for card "${cardName}" in set "${setCard.id}"`,
        { cause: artist },
      );
    };

    const banned: Banned[] = [];
    if (typeof cardBanned !== 'undefined') {
      if (isBanned(cardBanned)) {
        banned.push(cardBanned);
      } else if (Array.isArray(cardBanned) && cardBanned.every(isBanned)) {
        banned.push(...cardBanned);
      } else {
        throw new Error(
          `Invalid ban reason for "${cardName}" in "${setCard.id}"`,
          { cause: cardBanned },
        );
      }
    }

    if (typeof setBanned !== 'undefined') {
      if (isBanned(setBanned)) {
        banned.push(setBanned);
      } else if (Array.isArray(setBanned) && setBanned.every(isBanned)) {
        banned.push(...setBanned);
      } else {
        throw new Error(
          `Invalid ban reason for "${cardName}" in "${setCard.id}"`,
          { cause: setBanned },
        );
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
        `Expected Oracle text to be a string for card "${cardName}"`,
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

      throw new Error(`Expected source to be a string for card "${cardName}"`, {
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
        `Expected TCGPlayer ID to be a number for card "${cardName}" in set "${setCard.id}"`,
        { cause: tcgplayerId },
      );
    };

    cards.push(
      new Card({
        artist: getArtist(),
        banned: getBanned(),
        count,
        emblems: emblems as undefined,
        markers: markers as undefined,
        name: cardName.replace(/\\"/gu, '"'),
        oracle: getOracle(),
        planes: planes as undefined,
        premium,
        proxy,
        setCard,
        source: getSource(),
        tcgplayerId: getTcgplayerId(),
        tokens: tokens as undefined,
      }),
    );
  }

  return cards;
}
