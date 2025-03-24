import { isDefined, isNumber, isString, isUndefined } from 'fmrs';
import type { SetId } from './set-id.js';

interface Options {
  readonly collectorNumber: unknown;
  readonly id: unknown;
  readonly image: unknown;
  readonly name: string;
  readonly scryfallId: unknown;
  readonly scryfallVariant: unknown;
}

export default function createSetId({
  collectorNumber,
  id,
  image,
  name,
  scryfallId,
  scryfallVariant,
}: Options): SetId {
  // If this card can only be proxied,
  if (isString(image)) {
    if (isString(id)) {
      return { id, image, type: 'proxy' };
    }

    if (isString(scryfallId)) {
      return { id: scryfallId, image, type: 'proxy' };
    }

    throw new Error(`Expected proxy to have an image for card "${name}"`);
  }

  // If Scryfall can be the source-of-truth for this set,
  if (isString(scryfallId)) {
    if (
      isNumber(scryfallVariant) ||
      isString(scryfallVariant) ||
      isUndefined(scryfallVariant)
    ) {
      return { id: scryfallId, type: 'scryfall', variant: scryfallVariant };
    }

    throw new Error(
      `Invalid Scryfall variant for card "${name}" in set "${scryfallId}"`,
      { cause: scryfallVariant },
    );
  }

  // If the set is printed on the card,
  if (isString(id)) {
    // If there are collector variants of this card,
    if (isNumber(collectorNumber)) {
      return { collectorNumber, id, type: 'print' };
    }

    // If there are no variants of the card,
    if (!isDefined(scryfallVariant)) {
      return { id, type: 'print' };
    }

    // If there are variants of the card, use the Scryfall ID.
    if (isNumber(scryfallVariant) || isString(scryfallVariant)) {
      return { id, type: 'scryfall', variant: scryfallVariant };
    }

    throw new Error(
      `Invalid Scryfall variant for card "${name}" in set "${id}"`,
      { cause: scryfallVariant },
    );
  }

  throw new Error(`Invalid set ID for card "${name}"`, {
    cause: { id, scryfallId },
  });
}
