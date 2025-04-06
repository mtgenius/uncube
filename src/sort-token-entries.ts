const sanitize = (name: string): string =>
  name
    .replace(/^\d\/\d /u, '')
    .replace(
      /^(?:black|blue|colorless|green|red|white)(?: and (?:black|blue|colorless|green|red|white))? /u,
      '',
    )
    .replace(/^legendary /u, '');

export default function sortTokenEntries(
  [tokenNameA]: readonly [string, readonly number[]],
  [tokenNameB]: readonly [string, readonly number[]],
): number {
  return sanitize(tokenNameA).localeCompare(sanitize(tokenNameB));
}
