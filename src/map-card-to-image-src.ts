import type Card from './card.js';

export default function mapCardToImageSrc({
  name,
  setId,
}: Pick<Card, 'name' | 'setId'>): string {
  const { id, type } = setId;
  switch (type) {
    case 'print': {
      const { collectorNumber } = setId;
      if (typeof collectorNumber === 'undefined') {
        return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&set=${encodeURIComponent(id)}&version=small`;
      }
      return `https://api.scryfall.com/cards/${encodeURIComponent(id)}/${collectorNumber}/en?format=image&version=small`;
    }

    case 'proxy': {
      const { image } = setId;
      return `https://raw.githubusercontent.com/mtgenius/uncube/refs/heads/main/images/${image}`;
    }

    case 'scryfall': {
      const { variant } = setId;
      if (typeof variant === 'undefined') {
        if (id === 'PMOA') {
          return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}%20-%20Avatar&format=image&set=${encodeURIComponent(id)}&version=small`;
        }
        return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&set=${encodeURIComponent(id)}&version=small`;
      }
      return `https://api.scryfall.com/cards/${encodeURIComponent(id)}/${encodeURIComponent(variant)}/en?format=image&version=small`;
    }
  }
}
