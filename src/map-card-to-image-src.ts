import type Card from './card.js';

const RAW_GITHUB_USER_CONTENT =
  'https://raw.githubusercontent.com/mtgenius/uncube/refs/heads/main/images/';

export default function mapCardToImageSrc({
  name,
  setId,
}: Pick<Card, 'name' | 'setId'>): string {
  const { id, type } = setId;
  switch (type) {
    case 'print': {
      const { collectorNumber } = setId;

      // If we know the specific collect number, use it.
      if (typeof collectorNumber !== 'undefined') {
        return `https://api.scryfall.com/cards/${encodeURIComponent(id)}/${collectorNumber}/en?format=image&version=small`;
      }

      // For all other images, search it by exact name and set code.
      return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&set=${encodeURIComponent(id)}&version=small`;
    }

    case 'proxy': {
      const { image } = setId;
      return `${RAW_GITHUB_USER_CONTENT}${image}`;
    }

    case 'scryfall': {
      const { image, variant } = setId;

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
        return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}%20-%20Avatar&format=image&set=${encodeURIComponent(id)}&version=small`;
      }

      // For all other images, search it by exact name and set code.
      return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&set=${encodeURIComponent(id)}&version=small`;
    }
  }
}
