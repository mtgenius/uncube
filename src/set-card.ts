interface PrintCard {
  readonly collectorNumber?: number | undefined;
  readonly id: string;
  readonly name?: string | undefined;
  readonly type: 'print';
}

interface ProxyCard {
  readonly id: string;
  readonly image: string;
  readonly name?: string | undefined;
  readonly type: 'proxy';
}

interface ScryfallCard {
  readonly id: string;
  readonly image?: string | undefined;
  readonly name?: string | undefined;
  readonly type: 'scryfall';
  readonly variant?: number | string | undefined;
}

export type SetCard = PrintCard | ProxyCard | ScryfallCard;
