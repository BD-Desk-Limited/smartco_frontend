import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/account/Spinner';
import ErrorInterface from '@/components/account/errorInterface';
import {
  fetchOpenScheduledOrdersService,
  fetchScheduledOrdersReportService,
} from '@/services/reportServices';
import {
  cancelScheduledOrderService,
  refundOrderService,
} from '@/services/orderScheduleServices';
import KpiCard from '../KpiCard';
import { formatCount, formatMoney, rangeLabel } from '../../reportFormat';
import { OFFERED_METHODS, methodLabel } from '@/utilities/paymentMethods';
import ThroughPutCard from './scheduled-orders-report/ThroughPutCard';
import OrderRow from './scheduled-orders-report/OrderRow';
import ActionModal from './scheduled-orders-report/ActionModal';
import HeldPanel from './scheduled-orders-report/HeldPanel';
import OrderDetails from './scheduled-orders-report/OrderDetails';

const STATUS = {
  scheduled: { label: 'Scheduled', style: 'bg-yellow-100 text-yellow-800' },
  're-scheduled': {
    label: 'Rescheduled',
    style: 'bg-yellow-100 text-yellow-800',
  },
  cancelled: { label: 'Cancelled', style: 'bg-red-100 text-red-700' },
  fulfilled: { label: 'Fulfilled', style: 'bg-green-100 text-green-800' },
};

// the tags shown on an order (an order can be cancelled AND refunded)
const tagsOf = (o) =>
  [
    STATUS[o.status] || { label: o.status, style: 'bg-gray-100' },
    o.isOverdue && { label: 'Overdue', style: 'bg-red-100 text-red-700' },
    o.tags.overpaid && {
      label: 'Overpaid',
      style: 'bg-orange-100 text-orange-800',
    },
    o.tags.fullyRefunded && {
      label: 'Refunded',
      style: 'bg-gray-200 text-gray-800',
    },
    o.tags.partlyRefunded && {
      label: 'Part refunded',
      style: 'bg-gray-100 text-gray-700',
    },
    o.tags.needsRefund && {
      label: 'Needs refund',
      style: 'bg-orange-100 text-orange-800',
    },
    o.hasLatePayment && {
      label: 'Late payment',
      style: 'bg-red-50 text-red-700',
    },
  ].filter(Boolean);

const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  {
    key: 'scheduled',
    label: 'Scheduled',
    test: (o) => o.status === 'scheduled',
  },
  {
    key: 're-scheduled',
    label: 'Rescheduled',
    test: (o) => o.status === 're-scheduled',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    test: (o) => o.status === 'cancelled',
  },
  {
    key: 'refunded',
    label: 'Refunded',
    test: (o) => o.tags.fullyRefunded,
  },
  {
    key: 'needs-refund',
    label: 'Needs refund',
    test: (o) => o.tags.needsRefund,
  },
];

const when = (d) => (d ? new Date(d).toLocaleString() : '-');
const pctText = (v) => (v === null || v === undefined ? '-' : `${v}%`);

/*
  "Scheduled Orders" tab.
  Top: orders scheduled in the period (quoted), deposits on orders still open, refunds, money held now,
  and throughput (how many of the period's scheduled orders were fulfilled, cancelled, refunded).
  Below: the orders list. Open orders (any date) can be cancelled (with or without a refund) or
  refunded in part; they can only be FULFILLED at the sales point. Cancelled orders still holding money
  and fulfilled orders paid above their final price can be refunded. Cancelled or refunded orders that
  need nothing more are listed for the period; fulfilled orders with nothing to refund are not listed.
*/
const ScheduledOrders = ({ filters, onLoaded }) => {
  const { from, to, branchIds } = filters;
  const requestKey = JSON.stringify({ from, to, branchIds });
  const [attempt, setAttempt] = useState(0); // bumped by "Try again" and after every action
  const [period, setPeriod] = useState(null);
  const [list, setList] = useState(null);
  const [result, setResult] = useState({ key: null, error: null });
  const [action, setAction] = useState(null); // { type: 'cancel' | 'refund', order }
  const [details, setDetails] = useState(null); // order shown in the details window
  const [notice, setNotice] = useState(null); // message after an action
  const [statusFilter, setStatusFilter] = useState('all');
  const loading = result.key !== `${requestKey}${attempt}`;
  const error = loading ? null : result.error;

  useEffect(() => {
    let current = true;
    const key = `${requestKey}${attempt}`;
    const body = JSON.parse(requestKey);
    Promise.all([
      fetchScheduledOrdersReportService(body),
      fetchOpenScheduledOrdersService(body),
    ]).then(([periodRes, listRes]) => {
      if (!current) return;
      if (periodRes.data) setPeriod(periodRes.data);
      if (listRes.data) setList(listRes.data);
      setResult({ key, error: periodRes.error || listRes.error || null });
    });
    return () => {
      current = false;
    };
  }, [requestKey, attempt]);

  const currency = period?.currency || list?.currency;
  const money = useCallback((v) => formatMoney(v, currency), [currency]);

  // branch list, insight and export for the page
  useEffect(() => {
    if (!period || !list) return;
    const tp = period.throughput;
    const held = list.summary.held;
    const branchNames = branchIds.length
      ? period.filters.branches
          .filter((b) => branchIds.includes(b._id))
          .map((b) => b.name)
      : ['All branches'];
    const toRefund = held.cancelled.amount + held.overpaid.amount;
    onLoaded({
      branches: period.filters.branches,
      insight:
        `${formatCount(tp.scheduled.count)} order(s) scheduled in ${rangeLabel(from, to)}, quoted at ${money(tp.scheduled.quoted)}; ` +
        `${pctText(tp.rates.fulfilledCount)} fulfilled so far (${pctText(tp.rates.fulfilledValue)} of the value), ` +
        `${pctText(tp.rates.cancelledCount)} cancelled. ` +
        `${money(period.depositsOnOpen.amount)} paid in the period on orders still open. ` +
        `Held now: ${money(held.open.amount)} on open orders` +
        (toRefund > 0 ? `, ${money(toRefund)} to refund.` : '.'),
      export: {
        title: 'Scheduled Orders',
        fileName: `scheduled-orders_${from}_${to}`,
        metadata: {
          Report: 'Scheduled Orders',
          Period: rangeLabel(from, to),
          Branches: branchNames,
          Generated: new Date().toLocaleString(),
        },
        data: list.orders.map((o) => ({
          Order: o.orderId,
          Customer: o.customer?.name || '-',
          Branch: o.branch?.name || '-',
          Tags: tagsOf(o)
            .map((t) => t.label)
            .join(', '),
          'Scheduled on': when(o.scheduledAt),
          'Due for': when(o.scheduledFor),
          'Quoted total': o.quotedTotal,
          'Final total': o.totalAmount ?? '-',
          Paid: o.paid,
          Refunded: o.refunded,
          'Balance due': o.balanceDue,
          Refundable: o.refundable,
          'Cancel reason': o.cancellation?.reason || '-',
        })),
      },
    });
  }, [period, list, branchIds, from, to, money, onLoaded]);

  const cards = useMemo(() => {
    if (!period || !list) return [];
    const r = period.reconciliation;
    const tp = period.throughput;
    const held = list.summary.held;
    return [
      {
        title: 'Scheduled Orders',
        value: money(tp.scheduled.quoted),
        subText: `${formatCount(tp.scheduled.count)} order(s) scheduled in the period (quoted)`,
      },
      {
        title: 'Deposits on Open Orders',
        value: money(period.depositsOnOpen.amount),
        subText: `paid in the period on ${formatCount(period.depositsOnOpen.orders)} order(s) not fulfilled yet`,
      },
      {
        title: 'Refunded',
        value: money(r.refundsPaid),
        subText: `${formatCount(r.refundsCount)} refund(s) in the period`,
      },
      {
        title: 'Held Now',
        value: money(held.total),
        subText: `${money(held.open.amount)} open, ${money(held.cancelled.amount + held.overpaid.amount)} to refund`,
      },
      {
        title: 'Throughput',
        value: pctText(tp.rates.fulfilledCount),
        subText: tp.scheduled.count
          ? `${tp.fulfilled.count} of ${tp.scheduled.count} fulfilled, ${pctText(tp.rates.fulfilledValue)} of value`
          : 'no orders scheduled in the period',
      },
    ];
  }, [period, list, money]);

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [f.key, (list?.orders || []).filter(f.test).length])
      ),
    [list]
  );
  const shownOrders = useMemo(() => {
    const filter = FILTERS.find((f) => f.key === statusFilter) || FILTERS[0];
    return (list?.orders || []).filter(filter.test);
  }, [list, statusFilter]);

  const afterAction = (message) => {
    setAction(null);
    setDetails(null);
    setNotice(message);
    setAttempt((n) => n + 1);
  };

  if (error && !(period && list)) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <ErrorInterface error={error} />
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="text-brand-blue text-sm hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }
  if (!(period && list)) return <Spinner />;

  const r = period.reconciliation;
  const canManage = list.canManage;

  return (
    <div
      className={`flex flex-col gap-4 bg-white transition-opacity ${loading ? 'opacity-60' : ''}`}
    >
      {error && <ErrorInterface error={error} />}
      {notice && (
        <div className="mx-3 sm:mx-5 mt-3 rounded-lg bg-green-shadow7 text-sm px-3 py-2 flex justify-between gap-2">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className="w-full flex justify-center items-center bg-white">
        <section className="grid grid-cols-2 justify-center w-full sm:w-fit sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-6 bg-white p-3 sm:p-4 overflow-x-auto no-scrollbar">
          {cards.map((card) => (
            <KpiCard key={card.title} {...card} showChange={false} />
          ))}
        </section>
      </div>

      <section className="px-3 sm:px-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ThroughPutCard
          pctText={pctText}
          tp={period.throughput}
          money={money}
          period={rangeLabel(from, to)}
        />
        <HeldPanel
          held={list.summary.held}
          money={money}
          onShow={(key) => setStatusFilter(key)}
        />
      </section>

      {/* period: how deposits and refunds explain the cash against sales */}
      <section className="px-3 sm:px-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-shadow8 rounded-xl p-4 shadow-md text-sm flex flex-col gap-1">
          <h3 className="font-semibold text-base">
            Cash vs sales, {rangeLabel(from, to)}
          </h3>
          <Line
            label="Total sales (fulfilled orders)"
            sign=""
            value={money(r.totalSales)}
          />
          <Line
            label="Deposits taken"
            sign="+"
            value={money(r.depositsReceived)}
          />
          <Line
            label="Deposits already counted in sales"
            sign="-"
            value={money(r.depositsApplied)}
          />
          <Line label="Refunds given" sign="-" value={money(r.refundsPaid)} />
          <Line
            strong
            label="Money that should have been taken over this period"
            value={money(r.expectedCollections)}
          />
          <Line
            label="Money recorded at the tills (after refunds)"
            value={money(r.actualCollections)}
          />
          {Math.abs(r.difference) >= 0.01 && (
            <Line error label="Difference" value={money(r.difference)} />
          )}
          <p className="text-xs text-text-gray mt-2">
            Open at the end of the period: {period.openAtEnd.count} order(s),
            quoted {money(period.openAtEnd.quotedValue)}, paid{' '}
            {money(period.openAtEnd.paid)}. Cancelled in the period:{' '}
            {period.cancelledInPeriod.count}, refunded{' '}
            {money(period.cancelledInPeriod.refunded)}, kept{' '}
            {money(period.cancelledInPeriod.retained)}.
          </p>
        </div>
        <div className="border border-gray-shadow8 rounded-xl p-4 shadow-md text-sm overflow-x-auto">
          <h3 className="font-semibold text-base mb-2">
            Money by payment method
          </h3>
          <table className="w-full text-left">
            <thead className="text-text-gray text-xs">
              <tr>
                <th className="py-1">Method</th>
                <th className="py-1 text-right">Deposits</th>
                <th className="py-1 text-right">At fulfilment</th>
                <th className="py-1 text-right">Refunds</th>
                <th className="py-1 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {period.collectionsByMethod.map((m) => (
                <tr key={m.method} className="border-t">
                  <td className="py-1">{methodLabel(m.method)}</td>
                  <td className="py-1 text-right">{money(m.advance)}</td>
                  <td className="py-1 text-right">{money(m.onFulfilment)}</td>
                  <td className="py-1 text-right">{money(m.refunds)}</td>
                  <td className="py-1 text-right font-semibold">
                    {money(m.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* the orders list */}
      <section className="px-3 sm:px-5 pb-5">
        <div className="flex flex-col gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-base">Scheduled orders</h3>
            <p className="text-xs text-text-gray">
              All open orders (any date) and orders that still need a refund,
              plus orders cancelled or refunded in {rangeLabel(from, to)}. Click
              an order to see its details. Orders are fulfilled at the sales
              point only.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label="Filter by status"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key)}
                aria-pressed={statusFilter === f.key}
                className={`text-xs px-3 py-1 rounded-full border ${
                  statusFilter === f.key
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'border-gray-shadow8 hover:bg-gray-shadow10'
                }`}
              >
                {f.label} ({filterCounts[f.key] || 0})
              </button>
            ))}
          </div>
        </div>

        {shownOrders.length === 0 ? (
          <p className="text-sm text-text-gray py-6 text-center">
            {list.orders.length === 0
              ? 'No scheduled orders to show.'
              : 'No orders match this filter.'}
          </p>
        ) : (
          // scrolls inside its own box so the header row stays in view
          <div className="max-h-[70vh] overflow-auto border border-gray-shadow8 rounded-xl">
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
                {shownOrders.map((o) => (
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
        {list.truncated && (
          <p className="text-xs text-text-gray mt-1">
            Showing the first {list.orders.length} orders. Pick fewer branches
            or a shorter period to see the rest.
          </p>
        )}
      </section>

      {details && !action && (
        <OrderDetails
          o={details}
          when={when}
          Tags={Tags}
          money={money}
          canManage={canManage}
          onClose={() => setDetails(null)}
          onCancel={() => setAction({ type: 'cancel', order: details })}
          onRefund={() => setAction({ type: 'refund', order: details })}
        />
      )}
      {action && (
        <ActionModal
          action={action}
          money={money}
          onClose={() => setAction(null)}
          onDone={afterAction}
        />
      )}
    </div>
  );
};

const Line = ({ label, sign = '', value, strong, error }) => (
  <div
    className={`flex justify-between gap-3 ${strong ? 'font-semibold border-t pt-1' : ''} ${error ? 'text-error' : ''}`}
  >
    <span>{label}</span>
    <span className="whitespace-nowrap">
      {sign} {value}
    </span>
  </div>
);

const Tags = ({ order }) => (
  <span className="flex flex-wrap gap-1">
    {tagsOf(order).map((t) => (
      <span
        key={t.label}
        className={`text-xs rounded px-2 py-0.5 whitespace-nowrap ${t.style}`}
      >
        {t.label}
      </span>
    ))}
  </span>
);

export default ScheduledOrders;
