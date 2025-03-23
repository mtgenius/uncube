interface ScryfallSetId {
  readonly id: string;
  readonly type: 'scryfall';
  readonly variant?: number | string | undefined;
}

export type SetId = string | ScryfallSetId;
