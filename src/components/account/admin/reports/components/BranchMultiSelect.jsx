import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaStore } from 'react-icons/fa';
import { pillClass } from './DateRangeButton';

// Pick one, several or all branches. value: array of branch ids ([] = all branches).
const BranchMultiSelect = ({ branches = [], value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const selected = new Set(value);
  const allSelected = value.length === 0;

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // ticking every branch is the same as "All branches"
    onChange(next.size === branches.length ? [] : [...next]);
  };

  const label = allSelected
    ? 'All branches'
    : value.length === 1
      ? branches.find((b) => b._id === value[0])?.name || '1 branch'
      : `${value.length} branches`;

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={pillClass}
      >
        <FaStore />
        <span className="max-w-[10rem] truncate">{label}</span>
        <FaChevronDown className="text-xs" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-[90] w-64 max-sm:fixed max-sm:inset-x-2 max-sm:w-auto bg-white border border-gray-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-gray-shadow10 cursor-pointer font-semibold">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => onChange([])}
              className="h-4 w-4 accent-brand-green"
            />
            All branches
          </label>
          <div className="max-h-60 overflow-y-auto border-t border-gray-shadow9 pt-1">
            {branches.map((b) => (
              <label
                key={b._id}
                className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-gray-shadow10 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!allSelected && selected.has(b._id)}
                  onChange={() => toggle(b._id)}
                  className="h-4 w-4 accent-brand-green"
                />
                <span className="truncate">{b.name}</span>
              </label>
            ))}
            {branches.length === 0 && (
              <p className="text-xs text-text-gray px-2 py-1">
                No branches found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchMultiSelect;
