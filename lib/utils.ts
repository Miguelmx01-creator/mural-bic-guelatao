/**
 * Normalizes a community name for grouping:
 * trims, collapses double spaces, and Title Cases each word.
 * e.g. "  yaneri  de  juárez " → "Yaneri De Juárez"
 */
export function normalizeComunidad(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
