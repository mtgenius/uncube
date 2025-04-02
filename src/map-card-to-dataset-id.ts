import type Card from './card.js';

export default function mapCardToDatasetId({
  name,
  premium,
  setCard,
}: Card): string {
  const ids: (boolean | number | string)[] = [setCard.id, name, premium];
  switch (setCard.type) {
    case 'print': {
      if (typeof setCard.collectorNumber !== 'undefined') {
        ids.push(setCard.collectorNumber);
      }

      break;
    }

    case 'proxy': {
      ids.push(setCard.image);
      break;
    }

    case 'scryfall': {
      if (typeof setCard.variant !== 'undefined') {
        ids.push(setCard.variant);
      }

      break;
    }
  }

  return JSON.stringify(ids);
}
