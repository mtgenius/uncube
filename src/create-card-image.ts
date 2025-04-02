interface Options {
  readonly name: string;
  readonly premium: boolean;
}

export default function createCardImage({
  name,
  premium,
}: Options): HTMLImageElement {
  const image: HTMLImageElement = window.document.createElement('img');
  image.classList.add('image');
  image.setAttribute('alt', name);
  image.setAttribute('height', '204');
  image.setAttribute('role', 'presentation');
  image.setAttribute('width', '146');

  if (premium) {
    image.classList.add('premium');
  }

  return image;
}
