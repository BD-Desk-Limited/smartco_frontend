import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaTimes } from 'react-icons/fa';
import DateRangeButton from './DateRangeButton';

// 'YYYY-MM-DD' moved back `years` years; 29 Feb becomes 28 Feb in a non-leap year
const yearsBack = (text, years = 1) => {
  const [y, m, d] = text.split('-').map(Number);
  const lastDay = new Date(y - years, m, 0).getDate();
  return `${y - years}-${String(m).padStart(2, '0')}-${String(Math.min(d, lastDay)).padStart(2, '0')}`;
};

// The same dates one year earlier: the usual comparison ("1-11 Sep 2025 vs 1-11 Sep 2024").
export const sameDatesLastYear = ({ from, to }) => ({
  from: yearsBack(from),
  to: yearsBack(to),
});

// "Compare" window: choose the period to look at and the period to compare it with.
// onApply({ period, compare }); onRemove clears the comparison.
const CompareModal = ({ period, compare, onApply, onRemove, onClose }) => {
  const [current, setCurrent] = useState(period);
  const [other, setOther] = useState(compare || sameDatesLastYear(period));

  const swap = () => {
    setCurrent(other);
    setOther(current);
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black bg-opacity-50 flex items-center justify-center px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Compare periods"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl border border-gray-border shadow-lg w-full max-w-xs px-6 pt-10 pb-6 flex flex-col items-center gap-4"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-text-gray hover:text-text-black"
        >
          <FaTimes />
        </button>

        <div className="w-full flex flex-col gap-1">
          <span className="text-xs text-text-gray">Period</span>
          <DateRangeButton
            value={current}
            onChange={setCurrent}
            align="center"
            className="w-full justify-center h-11"
          />
        </div>

        <button
          type="button"
          onClick={swap}
          title="Swap the two periods"
          aria-label="Swap the two periods"
          className="text-text-black hover:text-brand-green text-lg"
        >
          <FaExchangeAlt className="rotate-90" />
        </button>

        <div className="w-full flex flex-col gap-1">
          <span className="text-xs text-text-gray">Compared with</span>
          <DateRangeButton
            value={other}
            onChange={setOther}
            align="center"
            className="w-full justify-center h-11"
          />
        </div>

        <button
          type="button"
          onClick={() => onApply({ period: current, compare: other })}
          className="w-full h-11 mt-2 rounded-lg bg-brand-green hover:bg-green-shadow1 text-white font-semibold flex items-center justify-center gap-2"
        >
          <FaExchangeAlt /> Compare
        </button>

        {compare && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-text-gray hover:text-error hover:underline"
          >
            Stop comparing
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default CompareModal;
