import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTimes,
  FaPlus,
  FaTrash,
  FaIntercom,
  FaExchangeAlt,
} from 'react-icons/fa';
import { formatDate } from '@/utilities/formatTime';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import {
  fetchTransferableBatchesService,
  raiseTransferService,
} from '@/services/transferServices';
import ErrorInterface from '@/components/account/errorInterface';

let lineKey = 0;
const newLine = () => ({ key: ++lineKey, batchId: '', quantity: '' });

const describe = (b) =>
  [
    b.name,
    `Batch ${b.batchNumber}`,
    b.brand,
    b.expiryDate ? `Exp ${formatDate(new Date(b.expiryDate))}` : null,
    `${b.balance} ${b.unit || ''} left`,
  ]
    .filter(Boolean)
    .join(' · ');

const RaiseTransferModal = ({
  userBranches = [],
  destinations = [],
  onClose,
  onRaised,
}) => {
  const [fromBranch, setFromBranch] = useState(userBranches[0]?._id || '');
  const [toBranch, setToBranch] = useState('');
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [lines, setLines] = useState([newLine()]);
  const [filter, setFilter] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // the batch list follows the source branch; rows reset because batches differ per branch
  useEffect(() => {
    const fetchBadges = async () => {
      if (!fromBranch) return;
      let cancelled = false;
      setLoadingBatches(true);
      setLines([newLine()]);
      setError('');
      await fetchTransferableBatchesService(fromBranch).then((res) => {
        if (cancelled) return;
        if (res.error) {
          setBatches([]);
          setError(String(res.error));
        } else {
          setBatches(res.data || []);
        }
        setLoadingBatches(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetchBadges();
  }, [fromBranch]);

  const batchById = useMemo(
    () => new Map(batches.map((b) => [b.batchId, b])),
    [batches]
  );
  const picked = new Set(lines.map((l) => l.batchId).filter(Boolean));
  const targets = destinations.filter((b) => b._id !== fromBranch);

  const updateLine = (key, patch) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );

  // a row offers its own pick, plus any unpicked batch matching the filter (name, batch no., brand)
  const optionsFor = (line) => {
    const term = filter.trim().toLowerCase();
    return batches.filter(
      (b) =>
        b.batchId === line.batchId ||
        (!picked.has(b.batchId) &&
          `${b.name} ${b.batchNumber} ${b.brand || ''}`
            .toLowerCase()
            .includes(term))
    );
  };

  const submit = async () => {
    setError('');
    if (!fromBranch)
      return setError('Choose the branch the stock is leaving from.');
    if (!toBranch)
      return setError('Choose the branch that will receive the stock.');

    const filled = lines.filter((l) => l.batchId || l.quantity !== '');
    if (filled.length === 0) return setError('Add at least one batch.');
    for (const l of filled) {
      const b = batchById.get(l.batchId);
      if (!b)
        return setError(
          'Choose a batch for every row, or remove the empty row.'
        );
      if (!(Number(l.quantity) > 0))
        return setError(`Enter a quantity above 0 for ${b.name}.`);
    }

    setSubmitting(true);
    const res = await raiseTransferService({
      fromBranch,
      toBranch,
      items: filled.map((l) => ({
        batchId: l.batchId,
        quantity: Number(l.quantity),
      })),
      note,
    });
    setSubmitting(false);
    if (res.error) return setError(String(res.error));
    onRaised?.(res.data);
  };

  const field =
    'w-full h-10 sm:h-8 px-2 border border-gray-border rounded-md text-base sm:text-sm bg-white focus:outline-none focus:ring focus:border-brand-blue';

  return (
    <div className="relative bg-white p-4 pt-12 sm:p-5 sm:rounded-lg shadow-lg w-full h-full sm:h-auto sm:w-[95vw] sm:max-h-[90vh] overflow-y-auto text-sm text-text-gray">
      <button
        onClick={onClose}
        title="Close"
        className="absolute top-2 right-2 p-2 sm:p-1 rounded-full bg-brand-gray hover:bg-error"
      >
        <FaTimes className="text-text-white" />
      </button>

      <h2 className="text-lg font-semibold text-brand-blue mb-1 flex flex-row gap-2">
        Raise stock transfer
        <FaExchangeAlt />
      </h2>
      <p className="mb-4">
        Pick the material batches to send. Each batch is copied to the receiving
        branch with its original cost and expiry. Nothing changes at either
        branch until the receiver accepts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col gap-1 font-semibold">
          From (sending branch)
          {userBranches.length > 1 ? (
            <select
              value={fromBranch}
              onChange={(e) => setFromBranch(e.target.value)}
              className={field}
            >
              {userBranches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          ) : (
            <span className={`${field} flex items-center bg-gray-shadow10`}>
              {userBranches[0]?.name || 'No branch'}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          To (receiving branch)
          <select
            value={toBranch}
            onChange={(e) => setToBranch(e.target.value)}
            className={field}
          >
            <option value="">Select branch</option>
            {targets.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="p-2 sm:m-2 bg-blue-shadow10 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="font-semibold text-text-black">
            Material Batches
          </span>
          <input
            type="text"
            placeholder="Filter by material, batch no. or brand"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 sm:h-8 w-full sm:w-64 px-2 border border-gray-border rounded-md text-base sm:text-sm focus:outline-none"
          />
        </div>

        {loadingBatches ? (
          <p className="italic py-3">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="italic py-3">
            This branch has no batches with stock left.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {lines.map((line) => {
              const b = batchById.get(line.batchId);
              const qty = Number(line.quantity);
              const over = b && qty > b.balance;
              return (
                <li key={line.key} className="flex flex-wrap sm:flex-nowrap items-start gap-2 pb-3 sm:pb-0 border-b sm:border-0 border-blue-shadow8">
                  <div className="basis-full sm:basis-auto flex-1 min-w-0 flex flex-col gap-1">
                    <select
                      value={line.batchId}
                      onChange={(e) =>
                        updateLine(line.key, { batchId: e.target.value })
                      }
                      className={field}
                      aria-label="Batch"
                    >
                      <option value="">Select batch</option>
                      {optionsFor(line).map((o) => (
                        <option key={o.batchId} value={o.batchId}>
                          {describe(o)}
                        </option>
                      ))}
                    </select>
                    {b && (
                      <span className="text-xs font-semibold">
                        {commaNumberFormat(b.unitCost, 2)} each
                        {qty > 0 &&
                          ` · value ${commaNumberFormat(qty * b.unitCost, 2)}`}
                      </span>
                    )}
                    {over && (
                      <span className="text-xs text-error">
                        Only {b.balance} {b.unit} left in this batch. Sending{' '}
                        {qty} will take balance to{' '}
                        {Math.round((b.balance - qty) * 1e6) / 1e6}.
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 sm:flex-none items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Qty"
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(line.key, { quantity: e.target.value })
                      }
                      inputMode="decimal"
                      className={`${field} sm:w-28 text-right`}
                      aria-label="Quantity"
                    />
                    <span className="w-10 text-xs">{b?.unit}</span>
                  </div>
                  <button
                    onClick={() =>
                      setLines((prev) =>
                        prev.length > 1
                          ? prev.filter((l) => l.key !== line.key)
                          : [newLine()]
                      )
                    }
                    title="Remove row"
                    className="h-10 sm:h-8 px-3 sm:px-2 text-error"
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {batches.length > 0 && (
          <button
            onClick={() => setLines((prev) => [...prev, newLine()])}
            disabled={picked.size >= batches.length}
            className="mt-3 p-2 flex items-center gap-1 text-brand-blue bg-blue-shadow9  border hover:bg-blue-shadow8 rounded-md disabled:opacity-40"
          >
            <FaPlus aria-hidden="true" /> Add another batch
          </button>
        )}
      </div>

      <label className="flex flex-col gap-1 mt-4">
        Note for the receiver (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full border border-gray-border rounded-md p-2 text-text-black focus:outline-none focus:ring focus:border-brand-blue"
        />
      </label>

      {error && (
        <div>
          <ErrorInterface
            error={error}
            className="mt-3 px-3 text-center text-error w-full"
          />
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 bg-white border-t sm:border-0 border-gray-border mt-4 flex justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
        <button
          onClick={onClose}
          disabled={submitting}
          className="py-2 px-3 rounded-lg border border-gray-border"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={submitting || loadingBatches}
          className="py-2 px-4 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
        >
          {submitting ? 'Raising...' : 'Raise transfer'}
        </button>
      </div>
    </div>
  );
};

export default RaiseTransferModal;
