import Pagination from '@/components/account/common/Pagination';
import Spinner from '@/components/account/common/Spinner';
import { ISOStringToLocalTime } from '@/utilities/formatTime';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { capitalizeFirst } from '@/utilities/stringUtils';
import React from 'react';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

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
    cancelled: 'bg-red-500 text-text-white',
  };

  return (
    <>
      <div className="flex flex-wrap items-end gap-2">
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
          <ResponsiveTable
            align="left"
            dense
            maxHeightClass=""
            rows={tx?.transactions || []}
            emptyMessage="No transactions found."
            columns={[
              {
                key: 'date',
                header: 'Date',
                mobile: 'subtitle',
                cell: (t) => ISOStringToLocalTime(t.at),
              },
              { key: 'branch', header: 'Branch', cell: (t) => t.branch.name },
              {
                key: 'order',
                header: 'Order',
                mobile: 'title',
                cell: (t) => (
                  <>
                    {t.orderId}
                    {t.type !== 'sale' && (
                      <span className="ml-1 text-xs font-semibold">
                        ({capitalizeFirst(t.type)})
                      </span>
                    )}
                  </>
                ),
              },
              {
                key: 'items',
                header: 'Items',
                mobile: 'wide',
                cell: (t) => (
                  <>
                    {t.items
                      .slice(0, 3)
                      .map((i) => `${i.name} ×${i.quantity}`)
                      .join(', ')}
                    {t.items.length > 3 ? ` +${t.items.length - 3} more` : ''}
                  </>
                ),
              },
              {
                key: 'total',
                header: 'Total',
                align: 'right',
                cell: (t) => commaNumberFormat(t.total, 2),
              },
              {
                key: 'status',
                header: 'Status',
                align: 'center',
                mobile: 'badge',
                cell: (t) => (
                  <span
                    className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ${
                      STATUS_STYLE[t.status] || 'bg-gray-500 text-text-white'
                    }`}
                  >
                    {capitalizeFirst(t.status) || '-'}
                  </span>
                ),
              },
            ]}
          />

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
