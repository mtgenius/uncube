export default class DefinedMap<T> {
  #create: () => T;
  #map = new Map<string, T>();

  public constructor(create: () => T) {
    this.#create = create;
  }

  public get entries(): readonly [string, T][] {
    return [...this.#map.entries()];
  }

  public get values(): readonly T[] {
    return [...this.#map.values()];
  }

  public get(key: string): T {
    const item: T | undefined = this.#map.get(key);
    if (typeof item !== 'undefined') {
      return item;
    }

    const newItem: T = this.#create();
    this.#map.set(key, newItem);
    return newItem;
  }
}
