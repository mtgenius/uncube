import type { Banned } from './banned.js';
import createCardImageSrc from './create-card-image-src.js';
import createCardImage from './create-card-image.js';
import DelayedQueue from './delayed-queue.js';
import getCardElement from './get-card-element.js';
import { type Proxy } from './proxy.js';
import { type SetCard } from './set-card.js';

interface Options {
  readonly artist: string | undefined;
  readonly banned: readonly Banned[] | false;
  readonly count: number;
  readonly emblems: readonly string[] | undefined;
  readonly errata: Partial<Record<'type', readonly [string, string]>>;
  readonly markers: readonly string[] | undefined;
  readonly multiverseId: number | undefined;
  readonly name: string;
  readonly notes: readonly string[] | undefined;
  readonly oracle: string | undefined;
  readonly planes: readonly string[] | undefined;
  readonly premium: boolean;
  readonly proxy: Proxy | boolean;
  readonly rarity: 'C' | 'M' | 'R' | 'U' | undefined;
  readonly rulings: readonly string[] | undefined;
  readonly setCard: SetCard;
  readonly sources: readonly string[] | undefined;
  readonly tcgplayerId: number | undefined;
  readonly tokens: Readonly<Record<string, number>> | undefined;
}

const SCRYFALL_API_DELAY = 100;
const SCRYFALL_API_DELAYED_QUEUE = new DelayedQueue(SCRYFALL_API_DELAY);

export default class Card {
  public readonly artist: string | undefined;
  public readonly banned: readonly Banned[] | false;
  public readonly count: number;
  public readonly emblems: readonly string[] | undefined;
  public readonly errata: Partial<Record<'type', readonly [string, string]>>;
  readonly #imageSrc: string;
  public readonly markers: readonly string[] | undefined;
  public readonly multiverseId: number | undefined;
  public readonly name: string;
  public readonly notes: readonly string[];
  public readonly oracle: string | undefined;
  public readonly planes: readonly string[] | undefined;
  public readonly premium: boolean;
  public readonly proxy: Proxy | boolean;
  public readonly rarity: 'C' | 'M' | 'R' | 'U' | undefined;
  public readonly rulings: readonly string[] | undefined;
  #setCard: SetCard;
  public readonly sources: readonly string[] | undefined;
  public readonly tcgplayerId: number | undefined;
  public readonly tokens: Readonly<Record<string, number>> | undefined;

  public readonly image: HTMLImageElement =
    window.document.createElement('img');

  public constructor({
    artist,
    banned,
    count,
    emblems,
    errata,
    markers,
    multiverseId,
    name,
    notes = [],
    oracle,
    planes,
    premium,
    proxy,
    rarity,
    rulings,
    setCard,
    sources,
    tcgplayerId,
    tokens,
  }: Options) {
    this.artist = artist;
    this.banned = banned;
    this.count = count;
    this.emblems = emblems;
    this.errata = errata;
    this.image = createCardImage({ name, premium });
    this.#imageSrc = createCardImageSrc({ cardName: name, setCard });
    this.markers = markers;
    this.multiverseId = multiverseId;
    this.name = name;
    this.notes = notes;
    this.oracle = oracle;
    this.planes = planes;
    this.premium = premium;
    this.proxy = proxy;
    this.rarity = rarity;
    this.rulings = rulings;
    this.#setCard = setCard;
    this.sources = sources;
    this.tcgplayerId = tcgplayerId;
    this.tokens = tokens;

    if (this.#isScryfallApiImage) {
      SCRYFALL_API_DELAYED_QUEUE.push(this.setImageSrc);
      this.#addScryfallApiImageMouseOverEventListener();
    } else {
      this.setImageSrc();
    }
  }

  // First place method name 🥇
  #addScryfallApiImageMouseOverEventListener = (): void => {
    this.image.addEventListener(
      'mouseover',
      this.#handleScryfallApiImageMouseOver,
    );
  };

  #handleScryfallApiImageMouseOver = (): void => {
    SCRYFALL_API_DELAYED_QUEUE.filter(this.setImageSrc);
    SCRYFALL_API_DELAYED_QUEUE.unshift(this.#setNormalScryfallApiImageSrc);
  };

  // Technical debt: This should probably only call `onHide` event listeners.
  public hide(): void {
    getCardElement(this).classList.add('hidden');

    /**
     *   If the setting the image `src` can be filtered from the queue, move it
     * to the end.
     */
    if (SCRYFALL_API_DELAYED_QUEUE.filter(this.setImageSrc)) {
      SCRYFALL_API_DELAYED_QUEUE.push(this.setImageSrc);
    }
  }

  get #isScryfallApiImage(): boolean {
    return this.#imageSrc.startsWith('https://api.scryfall.com/');
  }

  get #normalScryfallApiImageSrc(): string {
    return this.#imageSrc.replace('version=small', 'version=normal');
  }

  public get setCard(): SetCard {
    return this.#setCard;
  }

  public setImageSrc = (): void => {
    this.image.setAttribute('src', this.#imageSrc);
  };

  #setNormalScryfallApiImageSrc = (): void => {
    this.image.setAttribute('src', this.#normalScryfallApiImageSrc);
  };

  public setSetName(name: string): this {
    this.#setCard = { ...this.#setCard, name };
    return this;
  }

  // Technical debt: This should only call `onShow` event listeners.
  public show(): void {
    getCardElement(this).classList.remove('hidden');
  }
}
