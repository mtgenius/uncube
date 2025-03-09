import { assert, describe, expect, it } from 'vitest';
import { z } from 'zod';
import cards from './cards.yml';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isRecordEntry = (value: unknown): value is readonly [string, Record<string, unknown>] =>
  Array.isArray(value) && typeof value[0] === 'string' && isRecord(value[1]);

const isRecordEntries = (value: unknown): value is readonly [string, Record<string, unknown>][] => Array.isArray(value) && value.every(isRecordEntry);

enum Banned {
  Racism = 'RACISM',
  Conjure =  'CONJURE',
  Consume = 'CONSUME',
  KamigawaCost = 'KAMIGAWA_COST',
  Contraption = 'CONTRAPTION',
  Kidney = 'KIDNEY',
  Perpetual = 'PERPETUAL',
  Outside = 'OUTSIDE',
  Seek = 'SEEK',
  Specialize = 'SPECIALIZE',
  VisualAccessibility = 'VISUAL_ACCESSIBILITY',
  Toys = 'TOYS',
  RandomCreature = 'RANDOM_CREATURE',
  Host = 'HOST',
  DamageSleeves = 'DAMAGE_SLEEVES',
  Dexterity = 'DEXTERITY',
  RemoveSleeves = 'REMOVE_SLEEVES',
}

enum Proxy {
  Racism = 'RACISM',
}

const BANNED_TEXT: Record<Banned, string> = {
  [Banned.Dexterity]: 'The uncube should not require manual dexterity.',
  [Banned.KamigawaCost]: 'It would be too expensive to open so many Kamigawa booster packs.',
  [Banned.RemoveSleeves]: 'Do not encourage players to remove uncube cards from their sleeves.',
  [Banned.DamageSleeves]: 'Do not encourage players to damage the uncube\'s sleeves.',
  [Banned.Host]: 'The uncube does not contain enough host cards or cards with augment to support this card.',
  [Banned.RandomCreature]: 'Selecting random creature cards from a library is burdensome.',
  [Banned.Toys]: 'Uncube should not require toys.',
  [Banned.VisualAccessibility]: 'This card is not accessible to visually-impaired players.',
  [Banned.Conjure]: 'Tracking conjured cards is burdensome in paper.',
  [Banned.Contraption]: 'The uncube does not contain enough Contraptions to support this card.',
  [Banned.Outside]: 'Playing should not require a person outside the game.',
  [Banned.Consume]: 'Do not encourage players to consume food or beverage near the uncube.',
  [Banned.Kidney]: 'Do not encourage players to sacrifice a kidney.',
  [Banned.Perpetual]: 'Do not perpetually modify cards in the uncube.',
  [Banned.Seek]: 'Seeking cards is mechanically burdensome in paper.',
  [Banned.Specialize]: 'Physical cards cannot specialize.',
  [Banned.Racism]: 'This card may be banned due to its racist depiction, text, or combination thereof.',
};

const PROXY_TEXT: Record<Proxy, string> = {
  [Proxy.Racism]: 'This card may be proxied due to its racist depiction, text, or combination thereof.',
};

const ENUM_BANNED = z.enum(Object.keys(BANNED_TEXT) as [string, ...string[]]);

const ENUM_PROXY = z.enum(Object.keys(PROXY_TEXT) as [string, ...string[]]);

describe('cards', (): void => {
  it('should match the expected schema', (): void => {
    z.strictObject({
      cards: z.record(z.strictObject({
        banned: z.union([ENUM_BANNED, z.array(ENUM_BANNED)]).optional(),
        emblems: z.array(z.string()).optional(),
        markers: z.record(z.number()).optional(),
        oracle: z.string().optional(),
        planes: z.array(z.string()).optional(),
        sets: z.array(z.strictObject({
          banned: z.string().optional(),
          collectorNumber: z.number().optional(),
          count: z.number().optional(),
          id: z.string().optional(),
          mana: z.string().optional(),
          oracle: z.string().optional(),
          premium: z.boolean(),
          proxy: z.union([z.boolean(), ENUM_PROXY]),
          scryfallId: z.string().optional(),
          scryfallVariant: z.union([z.number(), z.string()]).optional(),
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
      if (typeof id !== 'undefined') {
        setIds.add(id);
      }

      if (typeof scryfallId !== 'undefined') {
        setIds.add(scryfallId);
      }

      if (typeof id === 'undefined' && typeof scryfallId === 'undefined') {
        setIds.add(setName);
      }
    }

    expect(cardSetIds).toEqual(setIds);
  });
});
