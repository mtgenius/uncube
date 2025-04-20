import { isBoolean, isNumber, isRecord, isString } from 'fmrs';
import Card from './card.js';
import { type SetCard } from './set-card.js';
import isProxy from './is-proxy.js';
import isBanned from './is-banned.js';
import type { Banned } from './banned.js';
import createSetCard from './create-set-card.js';

const EMPTY = 0;
const NONE = 0;
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
    notes,
    oracle,
    planes,
    rulings,
    sets,
    sources,
    tokens: cardTokens,
    type: cardType,
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
    missing,
    multiverseId,
    premium,
    proxy,
    rarity,
    scryfallId,
    scryfallVariant,
    tcgplayerId,
    tokens: setTokens,
    type: setType,
    ...restSet
  } of sets) {
    const setCard: SetCard = createSetCard({
      collectorNumber,
      id,
      image,
      multiverseId,
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

    const getErrata = (): Partial<
      Record<'type', readonly [string, string]>
    > => {
      const errata: Partial<Record<'type', readonly [string, string]>> = {};
      if (typeof cardType === 'string' && typeof setType === 'string') {
        errata.type = [setType, cardType];
      }
      return errata;
    };

    const getMultiverseId = (): number | undefined => {
      if (typeof multiverseId === 'undefined') {
        return;
      }

      if (isNumber(multiverseId)) {
        return multiverseId;
      }

      throw new Error(
        `Expected multiverse ID to be a number for card "${cardName}" in set "${setCard.id}"`,
        { cause: multiverseId },
      );
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

    const getSources = (): readonly string[] | undefined => {
      if (typeof sources === 'undefined') {
        return;
      }

      if (Array.isArray(sources) && sources.every(isString)) {
        return sources;
      }

      throw new Error(`Expected sources to be strings for card "${cardName}"`, {
        cause: sources,
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

    const getTokens = (): Readonly<Record<string, number>> | undefined => {
      const tokens: Record<string, number> = {};

      if (typeof cardTokens !== 'undefined') {
        if (!isRecord(cardTokens)) {
          throw new Error(
            `Expected tokens to be a record for card "${cardName}" in set "${setCard.id}"`,
            { cause: cardTokens },
          );
        }

        for (const [tokenName, count] of Object.entries(cardTokens)) {
          if (!isNumber(count)) {
            throw new Error(
              `Expected tokens to have a count for "${tokenName}" for card "${cardName}" in set "${setCard.id}"`,
              { cause: count },
            );
          }
          tokens[tokenName] = (tokens[tokenName] ?? NONE) + count;
        }
      }

      if (typeof setTokens !== 'undefined') {
        if (!isRecord(setTokens)) {
          throw new Error(
            `Expected tokens to be a record for card "${cardName}" in set "${setCard.id}"`,
            { cause: setTokens },
          );
        }

        for (const [tokenName, count] of Object.entries(setTokens)) {
          if (!isNumber(count)) {
            throw new Error(
              `Expected tokens to have a count for "${tokenName}" for card "${cardName}" in set "${setCard.id}"`,
              { cause: count },
            );
          }
          tokens[tokenName] = (tokens[tokenName] ?? NONE) + count;
        }
      }

      if (Object.keys(tokens).length === EMPTY) {
        return;
      }

      return tokens;
    };

    cards.push(
      new Card({
        artist: getArtist(),
        banned: getBanned(),
        count,
        emblems: emblems as undefined,
        errata: getErrata(),
        markers: markers as undefined,
        multiverseId: getMultiverseId(),
        name: cardName.replace(/\\"/gu, '"'),
        notes: notes as undefined,
        oracle: getOracle(),
        planes: planes as undefined,
        premium,
        proxy,
        rarity: rarity as undefined,
        rulings: rulings as undefined,
        setCard,
        sources: getSources(),
        tcgplayerId: getTcgplayerId(),
        tokens: getTokens(),
      }),
    );
  }

  return cards;
}
