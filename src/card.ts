import type { Banned } from './banned.js';
import { type Proxy } from './proxy.js';
import { type SetId } from './set-id.js';

export default interface Card {
  readonly artist?: string | undefined;
  readonly banned: readonly Banned[] | false;
  readonly cardExtra: Record<string, unknown>;
  readonly count: number;
  readonly emblems?: readonly unknown[] | undefined;
  readonly markers?: readonly unknown[] | undefined;
  readonly name: string;
  readonly oracle?: string | undefined;
  readonly planes?: readonly unknown[] | undefined;
  readonly premium: boolean;
  readonly proxy: Proxy | boolean;
  readonly setExtra: Record<string, unknown>;
  readonly setId: SetId;
  readonly source?: string | undefined;
  readonly tcgplayerId?: number | undefined;
  readonly tokens?: readonly unknown[] | undefined;
}
