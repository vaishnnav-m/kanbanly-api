export function normalizeString(string: string): string {
  return string.toLowerCase().replace(/\s+/g, "-");
}
