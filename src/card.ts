import { type Proxy } from './proxy.js';
import { type SetId } from './set-id.js';

export default interface Card {
  readonly cardExtra: Record<string, unknown>;
  readonly name: string;
  readonly premium: boolean;
  readonly proxy: Proxy | boolean;
  readonly setExtra: Record<string, unknown>;
  readonly setId: SetId | string;
}
