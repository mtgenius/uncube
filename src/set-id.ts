interface PrintId {
  readonly collectorNumber?: number | undefined;
  readonly id: string;
  readonly name?: string | undefined;
  readonly type: 'print';
}

interface ProxyId {
  readonly id: string;
  readonly image: string;
  readonly name?: string | undefined;
  readonly type: 'proxy';
}

interface ScryfallSetId {
  readonly id: string;
  readonly name?: string | undefined;
  readonly type: 'scryfall';
  readonly variant?: number | string | undefined;
}

export type SetId = PrintId | ProxyId | ScryfallSetId;
