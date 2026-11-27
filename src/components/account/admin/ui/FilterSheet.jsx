import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import useEscapeToClose from './useEscapeToClose';

// Filters inline on md and up; behind a "Filters" button + bottom sheet on phones.
// `children` render once (CSS decides where), so their state and inputs are shared.
// Lay the children out with `flex-col md:flex-row` so they stack inside the sheet.
//
//   <FilterSheet activeCount={2} leading={<SearchBox />}>
//     ...selects, date pickers...
//   </FilterSheet>
//
// leading: phones only, visible next to the Filters button (e.g. a search box).
//   On md+ it is not rendered: keep your own copy inside `children` with
//   `hidden md:flex` if the desktop layout needs it. Bind both copies to the same
//   state and don't give them an `id`.
// onApply: for draft/apply filter flows; the sheet's "Show results" button calls it.
const FilterSheet = ({
  children,
  activeCount = 0,
  title = 'Filters',
  leading = null,
  trailing = null,
  onApply,
}) => {
  const [open, setOpen] = useState(false);

  useEscapeToClose(() => setOpen(false), open);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* phones: search (or other leading control) + Filters button */}
      <div className="flex md:hidden items-center gap-2 w-full">
        {leading && <div className="flex-1 min-w-0">{leading}</div>}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="shrink-0 h-10 px-3 rounded-md border border-gray-border bg-white text-sm text-text-gray flex items-center gap-2 ml-auto"
        >
          <FaFilter className="text-brand-blue" />
          {title}
          {activeCount > 0 && (
            <span className="bg-brand-blue text-white text-xs rounded-full px-2 py-0.5">
              {activeCount}
            </span>
          )}
        </button>
        {trailing}
      </div>

      {/* the filters: inline on md+, bottom sheet on phones when open */}
      <div
        className={
          open
            ? 'fixed inset-0 z-[66] bg-black bg-opacity-50 flex items-end md:static md:z-auto md:bg-transparent md:block'
            : 'hidden md:block'
        }
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          role={open ? 'dialog' : undefined}
          aria-label={open ? title : undefined}
          className={
            open
              ? 'w-full max-h-[85dvh] overflow-y-auto bg-white rounded-t-2xl px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-0 md:rounded-none md:max-h-none md:overflow-visible md:bg-transparent'
              : ''
          }
        >
          {open && (
            <div className="md:hidden sticky top-0 bg-white flex items-center justify-between py-3 mb-2 border-b border-gray-border z-[1]">
              <p className="font-semibold text-text-black">{title}</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
                className="p-2 text-text-gray"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {children}

          {open && (
            <div className="md:hidden pt-4">
              <button
                type="button"
                onClick={() => {
                  onApply?.();
                  setOpen(false);
                }}
                className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold"
              >
                Show results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSheet;
