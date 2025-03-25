import type Card from './card.js';

export default function mapCardToDatasetId({
  name,
  premium,
  setId,
}: Card): string {
  const ids: (boolean | number | string)[] = [setId.id, name, premium];
  switch (setId.type) {
    case 'print': {
      if (typeof setId.collectorNumber !== 'undefined') {
        ids.push(setId.collectorNumber);
      }

      break;
    }

    case 'proxy': {
      ids.push(setId.image);
      break;
    }

    case 'scryfall': {
      if (typeof setId.variant !== 'undefined') {
        ids.push(setId.variant);
      }

      break;
    }
  }

  return JSON.stringify(ids);
}
