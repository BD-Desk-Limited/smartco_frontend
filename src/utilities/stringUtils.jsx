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

// The words of a person's name, ignoring extra spaces ('' / null / undefined give []).
const nameWords = (fullName) =>
  String(fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

/**
 * First name to greet someone with: "Ada Lovelace" -> "Ada", "" -> fallback.
 * @param {string} fullName
 * @param {string} [fallback]
 */
export function firstName(fullName, fallback = '') {
  return nameWords(fullName)[0] || fallback;
}

/**
 * Initials for an avatar: "ada lovelace" -> "AL", "Ada" -> "A", "" -> fallback.
 * @param {string} fullName
 * @param {string} [fallback]
 */
export function initials(fullName, fallback = '') {
  const words = nameWords(fullName);
  if (!words.length) return fallback;
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();
}
