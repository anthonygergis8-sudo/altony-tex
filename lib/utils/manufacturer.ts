import type { Language } from '@/lib/i18n/dictionaries';

const MANUFACTURER_PATTERNS = [
  /\bSidhi\b/i,
  /\bAlTony\b/i,
  /\bAl Tony\b/i,
];

export function extractManufacturer(
  productName: string,
  _language: Language = 'en',
): string {
  for (const pattern of MANUFACTURER_PATTERNS) {
    const match = productName.match(pattern);
    if (match) return match[0];
  }
  return '';
}

export function stripManufacturer(productName: string): string {
  let result = productName;
  for (const pattern of MANUFACTURER_PATTERNS) {
    result = result.replace(pattern, '').trim();
  }
  result = result.replace(/\s*-\s*$/, '').trim();
  return result;
}
