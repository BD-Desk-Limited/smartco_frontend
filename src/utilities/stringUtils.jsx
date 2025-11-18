/**
 * Capitalize the first letter of each word in a string (Title Case)
 * Preserves existing spacing and trims the input.
 * @param {string} str
 * @returns {string}
 */
export function capitalizeWords(str) {
  if (!str && str !== '') return '';
  const s = String(str).trim();
  if (s.length === 0) return '';
  return s.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Capitalize only the first character of the string.
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirst(str) {
  if (!str && str !== '') return '';
  const s = String(str).trim();
  if (s.length === 0) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
