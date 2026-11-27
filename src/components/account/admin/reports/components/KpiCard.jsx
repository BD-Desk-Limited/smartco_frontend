import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { formatChange } from '../reportFormat';

// One headline figure (Total Sales, Transaction Count...). `change` is the % vs the previous
// period; it is only shown while Compare is on. `color` is a Tailwind bg class for the badge.
const KpiCard = ({
  title,
  value,
  subText,
  change,
  showChange,
  color = 'bg-brand-green',
  LeftBatch = { show: false, batch: null },
  RightBatch = { show: false, batch: null },
}) => {
  const changeText = formatChange(change);
  const up = change > 0;
  const down = change < 0;

  return (
    <div className="relative flex flex-col items-center justify-between gap-2 border border-gray-shadow8 rounded-xl p-3 pt-5 sm:p-4 min-h-[120px] sm:min-h-[150px] w-full sm:w-[260px] shadow-md">
      {/* Batches */}
      {LeftBatch.show && (
        <span className="absolute top-0 left-0">
          <LeftBatch.batch />
        </span>
      )}
      {RightBatch.show && (
        <span className="absolute top-0 right-0">
          <RightBatch.batch />
        </span>
      )}

      <h3 className="text-sm sm:text-base text-text-black text-center leading-tight">
        {title}
      </h3>
      <p className="text-lg sm:text-xl font-bold text-text-black text-center break-all">
        {value}
      </p>
      {subText && <p className="text-xs text-text-gray -mt-2">{subText}</p>}

      {showChange && (
        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full justify-center">
          <span
            className={`${changeText ? color : 'text-text-gray'} text-xs rounded-md px-2 sm:px-4 py-1.5 sm:min-w-[90px] text-center`}
            title="Change from the compared period"
          >
            {changeText || 'No earlier data for this to compare'}
          </span>
          {up && <FaArrowUp className="text-success" aria-label="up" />}
          {down && <FaArrowDown className="text-error" aria-label="down" />}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
