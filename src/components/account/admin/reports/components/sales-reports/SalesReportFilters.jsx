import React, { useState } from 'react';
import { FaDownload, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { rangeLabel } from '../../reportFormat';
import DateRangeButton, { pillClass } from '../DateRangeButton';
import BranchMultiSelect from '../BranchMultiSelect';
import CompareModal from '../CompareModal';

// Period, branches, compare and export controls above every sales report tab.
const SalesReportFilters = ({
  filters,
  setFilters,
  branches = [],
  onExport,
  canExport,
}) => {
  const [comparing, setComparing] = useState(false);
  const period = { from: filters.from, to: filters.to };

  return (
    <div className="flex flex-row flex-wrap bg-background-1 p-2 w-full items-center justify-end gap-2">
      <DateRangeButton
        value={period}
        onChange={(range) => setFilters((prev) => ({ ...prev, ...range }))}
      />

      <BranchMultiSelect
        branches={branches}
        value={filters.branchIds}
        onChange={(branchIds) => setFilters((prev) => ({ ...prev, branchIds }))}
      />

      {filters.compare ? (
        // comparison on: shows what it is compared with; click to change, x to stop
        <div
          className={`${pillClass} bg-green-shadow9 border-brand-green pr-1`}
        >
          <button
            type="button"
            onClick={() => setComparing(true)}
            className="flex items-center gap-2"
            title="Change the comparison"
          >
            <FaExchangeAlt />
            vs {rangeLabel(filters.compare.from, filters.compare.to)}
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, compare: null }))}
            aria-label="Stop comparing"
            className="p-1.5 rounded hover:bg-white"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setComparing(true)}
          className={pillClass}
        >
          <FaExchangeAlt />
          Compare
        </button>
      )}

      <button
        type="button"
        onClick={onExport}
        disabled={!canExport}
        className={`${pillClass} text-text-black disabled:opacity-50`}
      >
        <FaDownload />
        Export
      </button>

      {comparing && (
        <CompareModal
          period={period}
          compare={filters.compare}
          onClose={() => setComparing(false)}
          onRemove={() => {
            setFilters((prev) => ({ ...prev, compare: null }));
            setComparing(false);
          }}
          onApply={({ period: next, compare }) => {
            setFilters((prev) => ({ ...prev, ...next, compare }));
            setComparing(false);
          }}
        />
      )}
    </div>
  );
};

export default SalesReportFilters;
