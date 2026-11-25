/*
  // Builds the page list used by the header search ("Search app").
  
  // It walks src/app/pages/account/admin, turns every page.jsx it finds into a search entry and writes src/generated/searchIndex.json. Nobody edits that file by hand: next.config.mjs runs this on `next dev` / `next build`, and
  // in dev it re-runs whenever a page is added, renamed or removed.
  
  // Optional comments a page.jsx can carry (anywhere in the file):
    * //@search staff, employees, workers  ---> extra words that should find it
    * //@search-title Bulk Branch Upload   ---> name shown instead of the folder name
    * //@search-hide                       ---> keep this page out of search
  
  To run by hand: node scripts/generateSearchIndex.mjs [--watch]
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const APP_DIR = path.join(PROJECT_ROOT, 'src', 'app');
const SEARCH_ROOT = path.join(APP_DIR, 'pages', 'account', 'admin');
const OUTPUT = path.join(PROJECT_ROOT, 'src', 'generated', 'searchIndex.json');

const PAGE_FILE = /^page\.(jsx?|tsx?)$/;

// Pages that only work when opened from a specific record (they read ?id=...),
// so opening them straight from search would show an empty or broken screen.
// (List pages like view-materials are fine; record pages end in -details.)
const NEEDS_A_RECORD = [/^edit-/, /-details$/, /review/];

// Folders that are not part of the URL or cannot be visited directly.
const isRouteGroup = (segment) => /^\(.*\)$/.test(segment); // (group) -> not in the URL
const isUnreachable = (segment) =>
  segment.startsWith('_') || // private folder
  segment.startsWith('@') || // parallel route slot
  segment.startsWith('['); // dynamic segment, needs a value

const toTitle = (segment) =>
  segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const readDirectives = (source) => {
  const directives = { keywords: [], title: null, hide: false };
  const pattern = /\/\/\s*@search(-title|-hide)?\b[ \t]*(.*)$/gm;
  for (const [, kind, rawValue] of source.matchAll(pattern)) {
    const value = rawValue.trim();
    if (kind === '-hide') directives.hide = true;
    else if (kind === '-title') directives.title = value || null;
    else {
      directives.keywords.push(
        ...value
          .split(',')
          .map((word) => word.trim().toLowerCase())
          .filter(Boolean)
      );
    }
  }
  return directives;
};

const findPageFiles = (dir) => {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findPageFiles(full));
    else if (PAGE_FILE.test(entry.name)) found.push(full);
  }
  return found;
};

const toEntry = (pageFile) => {
  const folders = path
    .relative(SEARCH_ROOT, path.dirname(pageFile))
    .split(path.sep)
    .filter(Boolean);

  if (folders.some(isUnreachable)) return null;
  const segments = folders.filter((segment) => !isRouteGroup(segment));
  const last = segments[segments.length - 1];
  if (last && NEEDS_A_RECORD.some((rule) => rule.test(last))) return null;

  const directives = readDirectives(fs.readFileSync(pageFile, 'utf8'));
  if (directives.hide) return null;

  const urlPath = path
    .relative(APP_DIR, path.dirname(pageFile))
    .split(path.sep)
    .filter((segment) => !isRouteGroup(segment))
    .join('/');

  return {
    path: `/${urlPath}`,
    title: directives.title || (last ? toTitle(last) : 'Dashboard'),
    group: segments.slice(0, -1).map(toTitle).join(' › '),
    keywords: directives.keywords,
  };
};

export const generateSearchIndex = () => {
  if (!fs.existsSync(SEARCH_ROOT)) return [];
  const entries = findPageFiles(SEARCH_ROOT)
    .map(toEntry)
    .filter(Boolean)
    .sort((a, b) => a.path.localeCompare(b.path));

  const json = `${JSON.stringify(entries, null, 2)}\n`;
  const current = fs.existsSync(OUTPUT)
    ? fs.readFileSync(OUTPUT, 'utf8')
    : null;
  // Only write when something changed, so the dev server doesn't reload for nothing.
  if (json !== current) {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, json);
  }
  return entries;
};

// Re-generates when anything under the admin pages changes (dev only).
export const watchSearchIndex = () => {
  if (globalThis.__searchIndexWatcher || !fs.existsSync(SEARCH_ROOT)) return;
  let timer;
  globalThis.__searchIndexWatcher = fs.watch(
    SEARCH_ROOT,
    { recursive: true },
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          generateSearchIndex();
        } catch (error) {
          console.warn('[search index] could not update:', error.message);
        }
      }, 300);
    }
  );
};

// Allow `node scripts/generateSearchIndex.mjs [--watch]`
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const entries = generateSearchIndex();
  console.log(
    `[search index] ${entries.length} pages -> ${path.relative(PROJECT_ROOT, OUTPUT)}`
  );
  if (process.argv.includes('--watch')) {
    watchSearchIndex();
    console.log('[search index] watching for page changes...');
  }
}
