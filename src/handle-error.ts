import { mapToString } from 'fmrs';

export default function handleError(err: unknown): void {
  if (err instanceof Error) {
    const message: HTMLPreElement = window.document.createElement('pre');
    if (typeof err.stack === 'string') {
      message.appendChild(window.document.createTextNode(err.stack));
    } else {
      message.appendChild(window.document.createTextNode(err.message));
    }
    window.document.body.appendChild(message);
  } else {
    const message: HTMLDivElement = window.document.createElement('div');
    message.appendChild(window.document.createTextNode(mapToString(err)));
    window.document.body.appendChild(message);
  }
}
