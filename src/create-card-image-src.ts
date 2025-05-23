import type { SetCard } from './set-card.js';

interface Options {
  readonly cardName: string;
  readonly setCard: SetCard;
}

const RAW_GITHUB_USER_CONTENT =
  'https://raw.githubusercontent.com/mtgenius/uncube/refs/heads/main/images/';

export default function createCardImageSrc({
  cardName,
  setCard,
}: Options): string {
  const { id, type } = setCard;
  switch (type) {
    case 'multiverse':
      return `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${setCard.multiverseId}&type=card`;

    case 'print': {
      const { collectorNumber } = setCard;

      // If we know the specific collect number, use it.
      if (typeof collectorNumber !== 'undefined') {
        return `https://api.scryfall.com/cards/${encodeURIComponent(id)}/${collectorNumber}/en?format=image&version=small`;
      }

      // For all other images, search it by exact name and set code.
      return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&format=image&set=${encodeURIComponent(id)}&version=small`;
    }

    case 'proxy': {
      const { image } = setCard;
      return `${RAW_GITHUB_USER_CONTENT}${image}`;
    }

    case 'scryfall': {
      const { image, variant } = setCard;

      // If we have a custom image, use it.
      if (typeof image !== 'undefined') {
        return `${RAW_GITHUB_USER_CONTENT}${image}`;
      }

      // If we know the specific variant, use it.
      if (typeof variant !== 'undefined') {
        return `https://api.scryfall.com/cards/${encodeURIComponent(id)}/${encodeURIComponent(variant)}/en?format=image&version=small`;
      }

      // Avatars in the set PMOA have " - Avatar" appended to their name.
      if (id === 'PMOA') {
        return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}%20-%20Avatar&format=image&set=${encodeURIComponent(id)}&version=small`;
      }

      // For all other images, search it by exact name and set code.
      return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&format=image&set=${encodeURIComponent(id)}&version=small`;
    }
  }
}
