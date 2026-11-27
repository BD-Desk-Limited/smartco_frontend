import React, { useEffect, useRef, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { rangeLabel, ymd } from '../reportFormat';

// Quick periods, worked out from today in the user's calendar.
const day = (t, offset) =>
  new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset);
export const DATE_PRESETS = [
  { name: 'today', label: 'Today', range: (t) => [t, t] },
  {
    name: 'yesterday',
    label: 'Yesterday',
    range: (t) => [day(t, -1), day(t, -1)],
  },
  { name: 'last-7', label: 'Last 7 days', range: (t) => [day(t, -6), t] },
  { name: 'last-30', label: 'Last 30 days', range: (t) => [day(t, -29), t] },
  {
    name: 'this-month',
    label: 'This month',
    range: (t) => [new Date(t.getFullYear(), t.getMonth(), 1), t],
  },
  {
    name: 'last-month',
    label: 'Last month',
    range: (t) => [
      new Date(t.getFullYear(), t.getMonth() - 1, 1),
      new Date(t.getFullYear(), t.getMonth(), 0),
    ],
  },
  {
    name: 'this-year',
    label: 'This year',
    range: (t) => [new Date(t.getFullYear(), 0, 1), t],
  },
  {
    name: 'last-year',
    label: 'Last year',
    range: (t) => [
      new Date(t.getFullYear() - 1, 0, 1),
      new Date(t.getFullYear() - 1, 11, 31),
    ],
  },
];

export const presetRange = (name) => {
  const preset = DATE_PRESETS.find((p) => p.name === name) || DATE_PRESETS[0];
  const [from, to] = preset.range(new Date());
  return { from: ymd(from), to: ymd(to) };
};

// Same guardrail as the server: a period may cover at most 5 years.
const MAX_DAYS = 366 * 5;
const tooLong = (from, to) =>
  (new Date(to) - new Date(from)) / 86400000 + 1 > MAX_DAYS;

export const pillClass =
  'h-9 flex items-center gap-2 px-3 border border-gray-border rounded-md bg-white text-sm font-semibold text-brand-green hover:shadow-sm whitespace-nowrap';

// A button showing a period ("1 Sep - 11 Sep 2025") that opens quick picks and From/To dates.
// value: { from, to } as 'YYYY-MM-DD'; onChange receives the new { from, to }.
const DateRangeButton = ({
  value,
  onChange,
  align = 'right',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const boxRef = useRef(null);
  const today = ymd(new Date());

  // close on a click outside
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const toggle = () => {
    setDraft(value);
    setOpen((o) => !o);
  };
  const apply = (range) => {
    onChange(range);
    setOpen(false);
  };

  const invalid = !draft.from || !draft.to || draft.from > draft.to;
  const long = !invalid && tooLong(draft.from, draft.to);

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`${pillClass} ${className}`}
      >
        <FaCalendarAlt />
        {rangeLabel(value.from, value.to)}
      </button>
      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} mt-2 z-[90] w-72 max-sm:fixed max-sm:inset-x-2 max-sm:w-auto max-sm:translate-x-0 bg-white border border-gray-border rounded-lg shadow-lg p-3 flex flex-col gap-3`}
        >
          <div className="grid grid-cols-2 gap-2">
            {DATE_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => apply(presetRange(p.name))}
                className="text-xs text-left px-2 py-1.5 rounded-md hover:bg-green-shadow10 text-text-black border border-gray-shadow9"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-row gap-2 border-t border-gray-shadow9 pt-3">
            <label className="text-xs text-text-gray flex flex-col gap-1 flex-1">
              From
              <input
                type="date"
                value={draft.from}
                max={draft.to || today}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, from: e.target.value }))
                }
                className="border border-gray-border rounded-md px-2 py-1 text-text-black"
              />
            </label>
            <label className="text-xs text-text-gray flex flex-col gap-1 flex-1">
              To
              <input
                type="date"
                value={draft.to}
                min={draft.from}
                max={today}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, to: e.target.value }))
                }
                className="border border-gray-border rounded-md px-2 py-1 text-text-black"
              />
            </label>
          </div>
          {long && (
            <p className="text-xs text-error">
              A period can cover at most 5 years.
            </p>
          )}
          <button
            type="button"
            disabled={invalid || long}
            onClick={() => apply(draft)}
            className="bg-brand-blue text-white text-sm rounded-md h-8 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeButton;
