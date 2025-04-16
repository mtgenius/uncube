import { isNumber, isRecord } from 'fmrs';
import sum from './sum.js';
import tokens from './tokens.yml';
import isArray from './is-array.js';
import createTokenImageSrc from './create-token-image-src.js';

interface Options {
  readonly counts: readonly number[];
  readonly name: string;
  readonly src: string;
}

const FIRST = 1;
const NONE = 0;
const SINGLE = 1;

const createListItem = ({ counts, name, src }: Options): HTMLLIElement => {
  const item: HTMLLIElement = window.document.createElement('li');
  item.classList.add('card-item');

  // Name
  const nameEl: HTMLSpanElement = window.document.createElement('span');
  nameEl.classList.add('name');
  nameEl.setAttribute('title', name);
  if (counts.length === NONE) {
    nameEl.innerHTML = '&nbsp;';
  } else {
    const count: number = sum(...counts);
    if (count === SINGLE) {
      nameEl.appendChild(window.document.createTextNode(name));
    } else {
      nameEl.appendChild(window.document.createTextNode(`${count}× ${name}`));
    }
  }
  item.appendChild(nameEl);

  // Image
  const image: HTMLImageElement = window.document.createElement('img');
  image.classList.add('image');
  image.setAttribute('alt', name);
  image.setAttribute('height', '204');
  image.setAttribute('role', 'presentation');
  image.setAttribute('src', src);
  image.setAttribute('width', '146');
  item.appendChild(image);

  // Count
  if (counts.length > SINGLE) {
    const countEl: HTMLElement = window.document.createElement('span');
    countEl.classList.add('count');
    countEl.appendChild(
      window.document.createTextNode(counts.toSorted().toReversed().join('+')),
    );
    item.appendChild(countEl);
  }

  return item;
};

export default function mapTokenEntryToListItems([name, counts]: readonly [
  string,
  readonly number[],
]): readonly HTMLLIElement[] {
  if (!(name in tokens)) {
    throw new Error(`Expected token to have metadata: ${name}`);
  }

  const token: unknown = tokens[name];
  if (!isRecord(token)) {
    throw new Error(`Expected token metadata to be a record: ${name}`);
  }

  // Proxies
  if (!('proxy' in token)) {
    throw new Error(`Expected token to specify its proxy status: ${name}`);
  }

  const getExtension = (): string | undefined => {
    if (!('extension' in token) || typeof token['extension'] !== 'string') {
      return;
    }
    return token['extension'];
  };

  const getFilename = (): string | undefined => {
    if (!('filename' in token) || typeof token['filename'] !== 'string') {
      return;
    }
    return token['filename'];
  };

  if (token['proxy'] === true) {
    const item: HTMLLIElement = createListItem({
      counts,
      name,
      src: createTokenImageSrc({
        extension: getExtension(),
        filename: getFilename(),
        name,
      }),
    });
    return [item];
  }

  if (isNumber(token['proxy'])) {
    const items: HTMLLIElement[] = [];
    for (let variant = FIRST; variant <= token['proxy']; variant++) {
      const getCounts = (): readonly number[] => {
        if (variant === FIRST) {
          return counts;
        }
        return [];
      };

      const item: HTMLLIElement = createListItem({
        counts: getCounts(),
        name,
        src: createTokenImageSrc({
          extension: getExtension(),
          filename: getFilename(),
          name,
          variant,
        }),
      });
      items.push(item);
    }
    return items;
  }

  // TCGPlayer
  if ('tcgplayerIds' in token) {
    const { tcgplayerIds } = token;
    if (!isArray(tcgplayerIds)) {
      throw new Error(
        `Expected TCGPlayer IDs to be an array for token "${name}"`,
      );
    }

    const [firstId] = tcgplayerIds;
    if (!isNumber(firstId)) {
      throw new Error(
        `Expected TCGPlayer ID to be numeric for token "${name}"`,
      );
    }

    return [
      createListItem({
        counts,
        name,
        src: `https://tcgplayer-cdn.tcgplayer.com/product/${firstId}_in_1000x1000.jpg`,
      }),
    ];
  }

  throw new Error(`Unexpected token: ${name}`);
}
