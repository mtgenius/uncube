import type { SetId } from './set-id.js';

export default function mapSetIdToVariant(
  setId: SetId,
): number | string | undefined {
  const { type } = setId;
  switch (type) {
    case 'print': {
      const { collectorNumber } = setId;
      return collectorNumber;
    }

    case 'scryfall': {
      const { variant } = setId;
      return variant;
    }
  }
}
