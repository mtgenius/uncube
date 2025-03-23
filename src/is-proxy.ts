import { Proxy } from './proxy.js';

const PROXY_VALUES = new Set<unknown>(Object.values(Proxy));

export default function isProxy(value: unknown): value is Proxy {
  return PROXY_VALUES.has(value);
}
