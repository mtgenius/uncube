interface PrintId {
  readonly collectorNumber?: number | undefined;
  readonly id: string;
  readonly name?: string | undefined;
  readonly type: 'print';
}

interface ScryfallSetId {
  readonly id: string;
  readonly name?: string | undefined;
  readonly type: 'scryfall';
  readonly variant?: number | string | undefined;
}

export type SetId = PrintId | ScryfallSetId;
