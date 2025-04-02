import { is } from 'fmrs';

const NOT_FOUND = -1;
const SINGLE = 1;

export default class DelayedQueue {
  readonly #delay: number;
  #flushing = false;
  readonly #queue: VoidFunction[] = [];

  public constructor(delay: number) {
    this.#delay = delay;
  }

  public filter(callback: VoidFunction): boolean {
    const index: number = this.#queue.findIndex(is(callback));
    if (index === NOT_FOUND) {
      return false;
    }

    this.#queue.splice(index, SINGLE);
    return true;
  }

  public flush(): void {
    // If the queue is already being processed, do nothing.
    if (this.#flushing) {
      return;
    }

    this.#flushing = true;
    const callback: VoidFunction | undefined = this.#queue.shift();

    // If the queue is empty, do nothing.
    if (typeof callback === 'undefined') {
      this.#flushing = false;
      return;
    }

    callback();
    window.setTimeout((): void => {
      this.#flushing = false;
      this.flush();
    }, this.#delay);
  }

  public push(callback: VoidFunction): void {
    this.#queue.push(callback);
    this.flush();
  }

  public unshift(callback: VoidFunction): void {
    this.#queue.unshift(callback);
    this.flush();
  }
}
