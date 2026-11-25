import Pagination from '@/components/account/Pagination';
import Spinner from '@/components/account/Spinner';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { capitalizeFirst } from '@/utilities/stringUtils';
import React from 'react';

const CustomerPurchases = ({
  txPage,
  tx,
  setTxPage,
  txError,
  setAppliedDates,
  dates,
  setDates,
  txLoading,
}) => {
  const STATUS_STYLE = {
    fulfilled: 'bg-green-500 text-text-white',
    scheduled: 'bg-yellow-500 text-text-white',
    're-scheduled': 'bg-yellow-500 text-text-white',
  };

  return (
    <>
      <div className="flex items-end gap-2">
        <label className="flex flex-col gap-1">
          From
          <input
            type="date"
            value={dates.from}
            onChange={(e) => setDates((d) => ({ ...d, from: e.target.value }))}
            className="h-8 px-2 border border-gray-border rounded-md"
          />
        </label>
        <label className="flex flex-col gap-1">
          To
          <input
            type="date"
            value={dates.to}
            onChange={(e) => setDates((d) => ({ ...d, to: e.target.value }))}
            className="h-8 px-2 border border-gray-border rounded-md"
          />
        </label>
        <button
          onClick={() => {
            setAppliedDates(dates);
            setTxPage(1);
          }}
          className="px-4 h-8 bg-brand-blue text-white rounded-lg hover:bg-blue-shadow1"
        >
          Apply
        </button>
      </div>

      {txLoading ? (
        <Spinner />
      ) : txError ? (
        <p className="text-error">{txError}</p>
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-shadow10">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Branch</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {tx?.transactions?.length ? (
                tx.transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-gray-border align-top"
                  >
                    <td className="px-3 py-2">{ISOStringToLocalTime(t.at)}</td>
                    <td className="px-3 py-2">{t.branch.name}</td>
                    <td className="px-3 py-2">
                      {t.orderId}
                      {t.type !== 'sale' && (
                        <span className="ml-1 text-xs font-semibold">
                          ({capitalizeFirst(t.type)})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {t.items
                        .slice(0, 3)
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(', ')}
                      {t.items.length > 3 ? ` +${t.items.length - 3} more` : ''}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {commaNumberFormat(t.total, 2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-md ${
                          STATUS_STYLE[t.status] ||
                          'bg-gray-500 text-text-white'
                        }`}
                      >
                        {capitalizeFirst(t.status) || '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center italic" colSpan={6}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {tx?.pagination && (
            <Pagination
              currentPage={txPage}
              totalPages={tx.pagination.totalPages || 1}
              onPageChange={setTxPage}
            />
          )}
        </>
      )}
    </>
  );
};

export default CustomerPurchases;
