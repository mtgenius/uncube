export default class DelayedQueue {
  readonly #delay: number;
  #executing = false;
  readonly #queue: VoidFunction[] = [];

  public constructor(delay: number) {
    this.#delay = delay;
  }

  public flush(): void {
    // If the queue is already being processed, do nothing.
    if (this.#executing) {
      return;
    }

    this.#executing = true;
    const callback: VoidFunction | undefined = this.#queue.shift();

    // If the queue is empty, do nothing.
    if (typeof callback === 'undefined') {
      this.#executing = false;
      return;
    }

    callback();
    window.setTimeout((): void => {
      this.#executing = false;
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
