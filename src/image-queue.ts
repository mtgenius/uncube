export default class ImageQueue {
  readonly #delay: number;
  #queue: Promise<void>;

  public constructor(delay: number) {
    this.#delay = delay;
    this.#queue = Promise.resolve();
  }

  public push(image: HTMLImageElement, src: string): void {
    this.#queue = this.#queue.then((): Promise<void> => {
      return new Promise((resolve: VoidFunction): void => {
        window.setTimeout((): void => {
          image.setAttribute('src', src);
          resolve();
        }, this.#delay);
      });
    });
  }
}
