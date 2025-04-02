import { isDefined, isUndefined } from 'fmrs';
import type Card from './card.js';

const ASCENDING = -1;
const DESCENDING = 1;

export default function sortBySet(
  { name: nameA, premium: premiumA, setCard: setCardA }: Card,
  { name: nameB, premium: premiumB, setCard: setCardB }: Card,
): number {
  // Sort by set name.
  const { name: setNameA } = setCardA;
  const { name: setNameB } = setCardB;
  if (isUndefined(setNameA)) {
    throw new Error(
      `Expected set name to be defined for card "${nameA}" set "${setCardA.id}".`,
      { cause: setCardA },
    );
  }

  if (isUndefined(setNameB)) {
    throw new Error(
      `Expected set name to be defined for card "${nameB}" set "${setCardB.id}".`,
      { cause: setCardB },
    );
  }

  if (setNameA !== setNameB) {
    return setNameA.localeCompare(setNameB);
  }

  // Sort by set ID, e.g. yearly and promotional sets.
  const { id: idA } = setCardA;
  const { id: idB } = setCardB;
  if (idA !== idB) {
    return idA.localeCompare(idB);
  }

  // Sort by card name.
  if (nameA !== nameB) {
    return nameA.localeCompare(nameB);
  }

  // Sort by premium, e.g. Unhinged alternate foils.
  if (premiumA !== premiumB) {
    if (premiumA) {
      return ASCENDING;
    }

    return DESCENDING;
  }

  // Sort by proxy images.
  const { type: typeA } = setCardA;
  const { type: typeB } = setCardB;
  switch (typeA) {
    // Sort by collector number.
    case 'print': {
      const { collectorNumber: collectorNumberA } = setCardA;

      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setCardA.id}" and "${setCardB.id}"`,
        );
      }

      const { collectorNumber: collectorNumberB } = setCardB;
      if (!isDefined(collectorNumberA) || !isDefined(collectorNumberB)) {
        throw new Error(
          `Card "${nameA}" has duplicates in print sets "${setCardA.id}" and "${setCardB.id}"`,
        );
      }

      return collectorNumberA - collectorNumberB;
    }

    // Sort by custom images.
    case 'proxy': {
      const { image: imageA } = setCardA;
      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setCardA.id}" and "${setCardB.id}"`,
        );
      }

      const { image: imageB } = setCardB;
      return imageA.localeCompare(imageB);
    }

    // Sort by Scryfall variant.
    case 'scryfall': {
      const { variant: variantA } = setCardA;
      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setCardA.id}" and "${setCardB.id}"`,
        );
      }

      const { variant: variantB } = setCardB;
      if (!isDefined(variantA) || !isDefined(variantB)) {
        throw new Error(
          `Card "${nameA}" has duplicates in Scryfall set "${setCardA.id}"`,
        );
      }

      return variantA.toString().localeCompare(variantB.toString());
    }
  }
}
