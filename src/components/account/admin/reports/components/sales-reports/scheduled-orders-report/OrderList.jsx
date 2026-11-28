import React from 'react';

import BranchMultiSelect from '../../BranchMultiSelect';
import Pagination from '@/components/account/common/Pagination';
import { formatCount, rangeLabel } from '../../../reportFormat';
import OrderRow from './OrderRow';

{
  /* the orders list */
}
const OrderList = ({
  money,
  when,
  from,
  to,
  FILTERS,
  list,
  listBranchOptions,
  listFilters,
  setListFilters,
  listLoading,
  setAction,
  Tags,
  canManage,
  setDetails,
  setListState,
}) => {
  const statusFilter = listFilters?.status;
  return (
    <section className="px-3 sm:px-5 pb-5">
      <div className="flex flex-col gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-base">Scheduled orders</h3>
          <p className="text-xs text-text-gray">
            All open orders (any date) and orders that still need a refund, plus
            orders cancelled or refunded in {rangeLabel(from, to)}. Click an
            order to see its details. Orders are fulfilled at the sales point
            only.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label="Filter by status"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setListFilters({ status: f.key })}
                aria-pressed={statusFilter === f.key}
                className={`text-xs px-3 py-1 rounded-full border ${
                  statusFilter === f.key
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'border-gray-shadow8 hover:bg-gray-shadow10'
                }`}
              >
                {f.label} ({list.statusCounts?.[f.key] ?? 0})
              </button>
            ))}
          </div>
          {listBranchOptions.length > 1 && (
            <BranchMultiSelect
              branches={listBranchOptions}
              value={listFilters.branchIds}
              onChange={(ids) => setListFilters({ branchIds: ids })}
            />
          )}
        </div>
      </div>

      {list.orders.length === 0 ? (
        <p className="text-sm text-text-gray py-6 text-center">
          {list.statusCounts?.all === 0
            ? listFilters.branchIds.length
              ? 'No scheduled orders in the selected branches.'
              : 'No scheduled orders to show.'
            : 'No orders match this filter.'}
        </p>
      ) : (
        // scrolls inside its own box so the header row stays in view
        <div
          className={`max-h-[70vh] overflow-auto border border-gray-shadow8 rounded-xl transition-opacity ${listLoading ? 'opacity-60' : ''}`}
        >
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-gray-shadow10 text-xs text-text-gray shadow-sm">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Due for</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-right">Paid (net)</th>
                <th className="p-2 text-right">Balance / Refundable</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.orders.map((o) => (
                <OrderRow
                  Tags={Tags}
                  key={o.orderId}
                  order={o}
                  money={money}
                  when={when}
                  canManage={canManage}
                  onOpen={() => setDetails(o)}
                  onCancel={() => setAction({ type: 'cancel', order: o })}
                  onRefund={() => setAction({ type: 'refund', order: o })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.pagination?.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 mt-2">
          <p className="text-xs text-text-gray">
            Showing {(list.pagination.page - 1) * list.pagination.pageSize + 1}–
            {(list.pagination.page - 1) * list.pagination.pageSize +
              list.orders.length}{' '}
            of {formatCount(list.pagination.total)} order(s)
          </p>
          <Pagination
            currentPage={list.pagination.page}
            totalPages={list.pagination.totalPages}
            onPageChange={(page) => setListState({ ...listFilters, page })}
          />
        </div>
      )}
    </section>
  );
};

export default OrderList;
