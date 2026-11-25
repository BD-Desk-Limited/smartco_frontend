// Matching for the header search ("Search app").
//
// Every word the user types has to match something on the page entry:
//   - a word of the title       (strongest)
//   - one of its @search words  (similar words, e.g. "staff" -> Users Management)
//   - a word of its group       (e.g. "customers" -> Customer Rewards · My Customers)
// A typed word matches when it is the start of a word, appears inside a word,
// or is one typo away from it ("prodcut", "custmer", "reprots").

const MAX_RESULTS = 8;

const words = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

// Edit distance where swapping two neighbouring letters counts as one typo.
const typoDistance = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
};

// 1 = exact start, 0.7 = inside the word, 0.5 = one typo away, 0 = no match.
const matchWord = (term, word) => {
  if (word.startsWith(term)) return 1;
  if (term.length >= 3 && word.includes(term)) return 0.7;
  if (term.length >= 4) {
    // Compare with the start of the word too, so typos match while still typing.
    const near =
      typoDistance(term, word) <= 1 ||
      typoDistance(term, word.slice(0, term.length)) <= 1;
    if (near) return 0.5;
  }
  return 0;
};

const bestMatch = (term, candidates) =>
  candidates.reduce((best, word) => Math.max(best, matchWord(term, word)), 0);

const FIELD_WEIGHT = { title: 6, keywords: 3, group: 1 };

// Words are computed once per entry, not on every keystroke.
export const prepareEntries = (entries) =>
  entries.map((entry) => ({
    entry,
    title: words(entry.title),
    keywords: (entry.keywords || []).flatMap(words),
    group: words(entry.group),
    titleText: entry.title.toLowerCase(),
  }));

export const searchEntries = (prepared, query, limit = MAX_RESULTS) => {
  const terms = words(query);
  if (!terms.length) return [];
  const fullQuery = terms.join(' ');

  const scored = [];
  for (const item of prepared) {
    let score = 0;
    let everyTermMatched = true;
    for (const term of terms) {
      const termScore = Math.max(
        ...Object.entries(FIELD_WEIGHT).map(
          ([field, weight]) => bestMatch(term, item[field]) * weight
        )
      );
      if (!termScore) {
        everyTermMatched = false;
        break;
      }
      score += termScore;
    }
    if (!everyTermMatched) continue;
    if (item.titleText.startsWith(fullQuery)) score += 5;
    scored.push({ entry: item.entry, score });
  }

  return scored
    .sort(
      (a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length
    )
    .slice(0, limit)
    .map(({ entry }) => entry);
};

// My Profile tabs are not routes, so they come from PROFILE_MENU_ITEMS instead.
// Each leaf opens /my-profile?tab=<name>; an optional `keywords` array on a menu
// item works like @search on a page.
export const profileTabEntries = (items, basePath, parents = ['My Profile']) =>
  items.flatMap((item) =>
    item.subMenus?.length
      ? profileTabEntries(item.subMenus, basePath, [...parents, item.label])
      : [
          {
            path: `${basePath}?tab=${encodeURIComponent(item.name)}`,
            title: item.label,
            group: parents.join(' › '),
            keywords: item.keywords || [],
          },
        ]
  );
