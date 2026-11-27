import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'last_used', label: 'Recently used' },
  { value: 'least_used', label: 'Longest unused' },
];

const selectClass =
  'h-9 border border-gray-border rounded-md px-2 text-sm text-text-black bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue';

// Search + filter + sort bar above the devices table.
const DeviceFilters = ({
  filters,
  setFilters,
  branches,
  addedByOptions,
  shown,
  total,
}) => {
  const set = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  const active = filters.search || filters.branch || filters.addedBy;

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex flex-row flex-wrap items-center gap-2">
        <label className="relative flex-1 md:min-w-[180px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray text-xs" />
          <input
            type="search"
            value={filters.search}
            onChange={set('search')}
            placeholder="Search device name"
            aria-label="Search device name"
            className={`${selectClass} w-full pl-8`}
          />
        </label>

        <select
          value={filters.branch}
          onChange={set('branch')}
          aria-label="Filter by branch"
          className={selectClass}
        >
          <option value="">All branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={filters.addedBy}
          onChange={set('addedBy')}
          aria-label="Filter by added by"
          className={selectClass}
        >
          <option value="">Added by anyone</option>
          {addedByOptions.map((u) => (
            <option key={u._id} value={u._id}>
              {u.fullName}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={set('sort')}
          aria-label="Sort devices"
          className={selectClass}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 text-xs text-text-gray">
        <span>
          Showing {shown} of {total} device{total === 1 ? '' : 's'}
        </span>
        {active && (
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                search: '',
                branch: '',
                addedBy: '',
              }))
            }
            className="text-brand-blue hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceFilters;
