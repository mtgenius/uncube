import { assert, describe, expect, it } from 'vitest';
import { z } from 'zod';
import cards from './cards.yml';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isRecordEntry = (value: unknown): value is readonly [string, Record<string, unknown>] =>
  Array.isArray(value) && typeof value[0] === 'string' && isRecord(value[1]);

const isRecordEntries = (value: unknown): value is readonly [string, Record<string, unknown>][] => Array.isArray(value) && value.every(isRecordEntry);

describe('cards', (): void => {
  it('should match the expected schema', (): void => {
    z.strictObject({
      cards: z.record(z.strictObject({
        banned: z.boolean().or(z.literal('optional')).optional(),
        emblems: z.array(z.string()).optional(),
        oracle: z.string().optional(),
        sets: z.array(z.strictObject({
          count: z.number().optional(),
          id: z.string().optional(),
          premium: z.boolean(),
          proxy: z.union([z.boolean(), z.literal('optional')]),
          scryfallId: z.string().optional(),
          scryfallVariant: z.string().optional(),
          tcgplayerId: z.number().optional(),
        })),
        source: z.string().optional(),
        tokens: z.record(z.number()).optional(),
      })),
      sets: z.record(z.strictObject({
        id: z.string().optional(),
        scryfallId: z.string().optional(),
        source: z.string().optional(),
      })),
    }).parse(cards);
  });

  it('should describe every set', (): void => {
    const cardSetIds = new Set<string>();
    const cardEntries = Object.entries(cards.cards);
    assert(isRecordEntries(cardEntries), 'Expected cards to be objects.');
    for (const [cardName, { sets: cardSets }] of cardEntries) {
      assert(Array.isArray(cardSets), `Expected card "${cardName}" to have sets.
See: https://scryfall.com/search?q=include%3Aextras+${encodeURIComponent(cardName)}`);
      for (const { id, scryfallId } of cardSets) {
        if (typeof id !== 'undefined') {
          cardSetIds.add(id);
        }

        if (typeof scryfallId !== 'undefined') {
          cardSetIds.add(scryfallId);
        }
      }
    }

    const setIds = new Set<string>();
    const setEntries = Object.entries(cards.sets);
    assert(isRecordEntries(setEntries), 'Expected cards to be objects.');
    for (const [setName, { id, scryfallId }] of setEntries) {
      setIds.add(id ?? scryfallId ?? setName);
    }

    expect(cardSetIds).toEqual(setIds);
  });
});
