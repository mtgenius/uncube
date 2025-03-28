export default function sanitizeAttribute(attr: string): string {
  return attr.replace(/\\/gu, '\\\\').replace(/"/gu, '\\"');
}
