export default function isFilterMatch(str: string, sub: string): boolean {
  return str.toLowerCase().includes(sub.toLowerCase());
}
