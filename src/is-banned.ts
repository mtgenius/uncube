import { Banned } from './banned.js';

const BANNED_VALUES = new Set<unknown>(Object.values(Banned));

export default function isBanned(value: unknown): value is Banned {
  return BANNED_VALUES.has(value);
}
