const INITIAL_SUM = 0;

export default function sum(...numbers: readonly number[]): number {
  return numbers.reduce(
    (previous: number, current: number) => previous + current,
    INITIAL_SUM,
  );
}
