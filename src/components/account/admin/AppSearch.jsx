import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
// Generated from the folders under app/pages/account/admin; never edit by hand.
// See scripts/generateSearchIndex.mjs.
import PAGES from '@/generated/searchIndex.json';
import {
  prepareEntries,
  profileTabEntries,
  searchEntries,
} from '@/utilities/appSearch';

const PROFILE_PATH = '/pages/account/admin/my-profile';
const PREPARED_PAGES = prepareEntries(PAGES);

// "Search app" box in the admin header: type to jump to any admin page or
// My Profile tab. Ctrl+K (Cmd+K on Mac) focuses it from anywhere.
const AppSearch = () => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [profileTabs, setProfileTabs] = useState([]);

  // Profile tabs are loaded the first time the box is used, so the header
  // doesn't carry the profile screens' code on every page.
  const loadProfileTabs = () => {
    if (profileTabs.length) return;
    import('./my-profile/components/PROFILE_MENU_ITEMS')
      .then(({ PROFILE_MENU_ITEMS }) =>
        setProfileTabs(
          prepareEntries(profileTabEntries(PROFILE_MENU_ITEMS, PROFILE_PATH))
        )
      )
      .catch(() => {}); // pages still work without the tabs
  };

  const results = useMemo(
    () => searchEntries([...PREPARED_PAGES, ...profileTabs], query),
    [query, profileTabs]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = (entry) => {
    if (!entry) return;
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    router.push(entry.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="relative">
      <div className="rounded-3xl border-2 border-brand-green flex items-center px-3 gap-2">
        <FaSearch className="text-brand-green" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search app (Ctrl+K)"
          aria-label="Search app"
          role="combobox"
          aria-expanded={showList}
          aria-controls="app-search-results"
          aria-activedescendant={
            showList && results[active] ? `app-search-${active}` : undefined
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            loadProfileTabs();
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="focus:outline-none text-text-black text-sm py-1 w-44 sm:w-56 bg-transparent"
        />
      </div>

      {showList && (
        <ul
          id="app-search-results"
          role="listbox"
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-border z-[60] py-1"
        >
          {results.map((entry, index) => (
            <li
              key={entry.path}
              id={`app-search-${index}`}
              role="option"
              aria-selected={index === active}
              // mousedown + preventDefault keeps the input focused until we navigate
              onMouseDown={(e) => {
                e.preventDefault();
                go(entry);
              }}
              onMouseEnter={() => setActive(index)}
              className={`px-4 py-2 cursor-pointer flex flex-col ${
                index === active ? 'bg-gray-shadow5' : ''
              }`}
            >
              <span className="text-sm text-text-black">{entry.title}</span>
              {entry.group && (
                <span className="text-xs text-text-gray">{entry.group}</span>
              )}
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-text-gray">
              No pages match &quot;{query.trim()}&quot;
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AppSearch;
