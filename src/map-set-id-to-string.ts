import { type SetId } from './set-id.js';

export default function mapSetIdToString(setId: SetId): string {
  if (typeof setId === 'string') {
    return setId;
  }

  const { id } = setId;
  return id;
}
