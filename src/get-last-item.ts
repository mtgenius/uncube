const ARRAY_INDEX_OFFSET = 1;

export default function mapArrayToLastItem<T>(
  arr: readonly T[],
): T | undefined {
  return arr[arr.length - ARRAY_INDEX_OFFSET];
}
