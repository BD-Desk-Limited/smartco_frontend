import React, { useCallback, useEffect, useState } from 'react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import {
  fetchFlaggedRedemptionsService,
  reviewFlaggedRedemptionService,
} from '@/services/customerServices';

const FlaggedRedemptions = ({ data, setData, onOpenCountChange }) => {
  const [status, setStatus] = useState('open');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({}); // { 'transactionId:rewardId': text }
  const [busyKey, setBusyKey] = useState('');

  const load = useCallback(async () => {
    const set = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchFlaggedRedemptionsService({
          status,
          page,
          limit: 20,
        });
        // the service returns { error } instead of throwing
        if (res?.error) throw new Error(res.error);
        setData(res.data);
      } catch (e) {
        setError(e?.message || 'Could not load flagged redemptions.');
      } finally {
        setLoading(false);
      }
    };
    set();
  }, [status, page, setData]);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (row) => {
    const key = `${row.transactionId}:${row.rewardId}`;
    setBusyKey(key);
    setError('');
    try {
      const res = await reviewFlaggedRedemptionService(
        row.transactionId,
        row.rewardId,
        notes[key] || ''
      );
      if (res?.error) throw new Error(res.error);
      await load();
    } catch (e) {
      setError(e?.message || 'Could not mark this as reviewed.');
    } finally {
      setBusyKey('');
    }
  };

  // total open flags across all pages. Only known while the "open" list is
  // loaded; on the "reviewed" list `data` holds reviewed rows, so return null.
  const numberOfOpenedFlaggedClaims = () => {
    if (status !== 'open' || loading) return null;
    return data?.pagination?.totalCount ?? data?.rows?.length ?? 0;
  };

  const openCount = numberOfOpenedFlaggedClaims();

  // keep the parent's tab tag in sync (e.g. after marking one reviewed)
  useEffect(() => {
    if (openCount !== null) onOpenCountChange?.(openCount);
  }, [openCount, onOpenCountChange]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-500" />
          Rewards to review
        </h2>
        <div className="flex gap-2">
          {['open', 'reviewed'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm ${
                status === s
                  ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                  : 'text-text-gray'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-text-gray">
        These sales were accepted and their stock was deducted. A reward is
        flagged when something did not add up, most often when it was used on
        two tills before they synced. The first sale to sync keeps the
        redemption.
      </p>

      {error && <p className="text-error text-sm">{error}</p>}
      {loading ? (
        <p className="text-base text-gray-shadow6 my-28">Loading...</p>
      ) : data.rows.length === 0 ? (
        <p className="text-base text-gray-shadow6 my-28">
          {status === 'open'
            ? 'Nothing needs review.'
            : 'No reviewed flags yet.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.rows.map((row) => {
            const key = `${row.transactionId}:${row.rewardId}`;
            return (
              <li
                key={key}
                className="border rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex flex-row justify-between gap-2 flex-wrap">
                  <span className="font-semibold">
                    {row.promoName || 'Reward'}
                  </span>
                  <span className="text-sm text-text-gray">
                    {row.at ? new Date(row.at).toLocaleString() : ''}
                  </span>
                </div>
                <p className="text-sm">
                  {row.customer
                    ? `${row.customer.name} (${row.customer.customerNumber})`
                    : 'No customer'}{' '}
                  · {row.branch?.name} · order{' '}
                  <span className="font-mono">{row.orderId}</span>
                </p>
                {row.rewardDescription && (
                  <p className="text-sm text-text-gray">
                    {row.rewardDescription}
                  </p>
                )}
                <ul className="text-sm list-disc pl-5">
                  {row.issues.map((i) => (
                    <li key={i.code}>{i.text}</li>
                  ))}
                </ul>
                <p className="text-xs text-text-gray">
                  {row.redeemedBySale
                    ? 'This sale holds the redemption.'
                    : 'Another sale holds the redemption (or none did).'}
                </p>
                {status === 'open' ? (
                  <div className="flex flex-row gap-2 items-center">
                    <input
                      value={notes[key] || ''}
                      maxLength={300}
                      onChange={(e) =>
                        setNotes((p) => ({ ...p, [key]: e.target.value }))
                      }
                      placeholder="Optional note"
                      className="flex-1 border rounded-md px-2 py-1 text-sm bg-transparent"
                    />
                    <button
                      onClick={() => review(row)}
                      disabled={busyKey === key}
                      className="px-3 py-1 rounded-md bg-brand-green text-white text-sm flex items-center gap-1 disabled:opacity-50"
                    >
                      <FaCheck /> Mark reviewed
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-text-gray flex flex-col gap-1">
                    <p>
                      Reviewed
                      {row.reviewedBy?.name && (
                        <>
                          {' by '}
                          <span className="font-semibold text-text-black">
                            {row.reviewedBy.name}
                          </span>
                        </>
                      )}
                      {row.reviewedAt &&
                        ` · ${new Date(row.reviewedAt).toLocaleString()}`}
                    </p>
                    {row.note && (
                      <p className="italic border-l-2 border-gray-border pl-2">
                        &ldquo;{row.note}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {page} / {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FlaggedRedemptions;
