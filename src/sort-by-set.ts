import { isDefined, isUndefined } from 'fmrs';
import type Card from './card.js';
import mapSetIdToVariant from './map-set-id-to-variant.js';

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

  // Sort by Scryfall variant.
  const variantA: number | string | undefined = mapSetIdToVariant(setIdA);
  const variantB: number | string | undefined = mapSetIdToVariant(setIdB);
  if (!isDefined(variantA) || !isDefined(variantB)) {
    throw new Error(`Card "${nameA}" has duplicates in set "${setIdA.id}"`);
  }

  return variantA.toString().localeCompare(variantB.toString());
}
