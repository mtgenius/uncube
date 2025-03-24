import { isDefined, isUndefined } from 'fmrs';
import type Card from './card.js';

const ASCENDING = -1;
const DESCENDING = 1;

export default function sortBySet(
  { name: nameA, premium: premiumA, setId: setIdA }: Card,
  { name: nameB, premium: premiumB, setId: setIdB }: Card,
): number {
  // Sort by set ID.
  const { name: setNameA } = setIdA;
  const { name: setNameB } = setIdB;
  if (isUndefined(setNameA)) {
    throw new Error(
      `Expected set name to be defined for card "${nameA}" set "${setIdA.id}".`,
      { cause: setIdA },
    );
  }

  if (isUndefined(setNameB)) {
    throw new Error(
      `Expected set name to be defined for card "${nameB}" set "${setIdB.id}".`,
      { cause: setIdB },
    );
  }

  if (setNameA !== setNameB) {
    return setNameA.localeCompare(setNameB);
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
  const { type: typeA } = setIdA;
  const { type: typeB } = setIdB;
  switch (typeA) {
    // Sort by collector number.
    case 'print': {
      const { collectorNumber: collectorNumberA } = setIdA;

      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setIdA.id}" and "${setIdB.id}"`,
        );
      }

      const { collectorNumber: collectorNumberB } = setIdB;
      if (!isDefined(collectorNumberA) || !isDefined(collectorNumberB)) {
        throw new Error(
          `Card "${nameA}" has duplicates in print set "${setIdA.id}"`,
        );
      }

      return collectorNumberA - collectorNumberB;
    }

    // Sort by custom images.
    case 'proxy': {
      const { image: imageA } = setIdA;
      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setIdA.id}" and "${setIdB.id}"`,
        );
      }

      const { image: imageB } = setIdB;
      return imageA.localeCompare(imageB);
    }

    // Sort by Scryfall variant.
    case 'scryfall': {
      const { variant: variantA } = setIdA;
      if (typeA !== typeB) {
        throw new Error(
          `Expected duplicates to share set types for card "${nameA}" in sets "${setIdA.id}" and "${setIdB.id}"`,
        );
      }

      const { variant: variantB } = setIdB;
      if (!isDefined(variantA) || !isDefined(variantB)) {
        throw new Error(
          `Card "${nameA}" has duplicates in Scryfall set "${setIdA.id}"`,
        );
      }

      return variantA.toString().localeCompare(variantB.toString());
    }
  }
}
