import sanitizeAttribute from './sanitize-attribute.js';

export default function getCardElementByDatasetId(
  datasetId: string,
): HTMLElement {
  const el: HTMLElement | null = window.document.querySelector(
    `.card-item[data-id="${sanitizeAttribute(datasetId)}"]`,
  );

  if (el === null) {
    throw new Error(`Expected item to exist for dataset ID "${datasetId}"`);
  }

  return el;
}
