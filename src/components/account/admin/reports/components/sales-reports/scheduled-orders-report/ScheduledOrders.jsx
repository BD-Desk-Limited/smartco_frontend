import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/account/common/Spinner';
import ErrorInterface from '@/components/account/common/errorInterface';
import {
  fetchOpenScheduledOrdersService,
  fetchScheduledOrdersReportService,
} from '@/services/reportServices';
import KpiCard from '../../KpiCard';
import { formatCount, formatMoney, rangeLabel } from '../../../reportFormat';
import ThroughPutCard from './ThroughPutCard';
import ActionModal from './ActionModal';
import HeldPanel from './HeldPanel';
import OrderDetails from './OrderDetails';
import CashVsSalesPanel from './CashVsSalesPanel';
import OrderList from './OrderList';

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

// status chips above the list (filtered and counted by the server)
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 're-scheduled', label: 'Rescheduled' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'needs-refund', label: 'Needs refund' },
];
const PAGE_SIZE = 20;

const when = (d) => (d ? new Date(d).toLocaleString() : '-');

// one order as an export row
const exportRow = (o) => ({
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
});

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
  const [periodResult, setPeriodResult] = useState({ key: null, error: null });
  const [listResult, setListResult] = useState({ key: null, error: null });
  const [action, setAction] = useState(null); // { type: 'cancel' | 'refund', order }
  const [details, setDetails] = useState(null); // order shown in the details window
  const [notice, setNotice] = useState(null); // message after an action
  // list filters; they go back to the start when the report's period or branches change
  const [listState, setListState] = useState({
    key: requestKey,
    branchIds: [],
    status: 'all',
    page: 1,
  });
  const listFilters =
    listState.key === requestKey
      ? listState
      : { key: requestKey, branchIds: [], status: 'all', page: 1 };
  const setListFilters = (change) =>
    setListState({ ...listFilters, page: 1, ...change });

  const listRequestKey = JSON.stringify({
    listBranchIds: listFilters.branchIds,
    status: listFilters.status,
    page: listFilters.page,
  });

  const periodKey = `${requestKey}${attempt}`;
  const listKey = `${requestKey}${listRequestKey}${attempt}`;
  const periodLoading = periodResult.key !== periodKey;
  const listLoading = listResult.key !== listKey;

  const error =
    (periodLoading ? null : periodResult.error) ||
    (listLoading ? null : listResult.error);

  // the period figures: only when the period or the report's branches change (or after an action)
  useEffect(() => {
    let current = true;
    fetchScheduledOrdersReportService(JSON.parse(requestKey)).then((res) => {
      if (!current) return;
      if (res.data) setPeriod(res.data);
      setPeriodResult({ key: periodKey, error: res.error || null });
    });
    return () => {
      current = false;
    };
  }, [requestKey, periodKey]);

  // the list: also when its branches, status or page change
  useEffect(() => {
    let current = true;
    fetchOpenScheduledOrdersService({
      ...JSON.parse(requestKey),
      ...JSON.parse(listRequestKey),
      pageSize: PAGE_SIZE,
    }).then((res) => {
      if (!current) return;
      if (res.data) setList(res.data);
      setListResult({ key: listKey, error: res.error || null });
    });
    return () => {
      current = false;
    };
  }, [requestKey, listRequestKey, listKey]);

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
    const listBranchIds = list.filters?.listBranchIds || [];
    const listStatus = list.filters?.status || 'all';
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
          Branches: listBranchIds.length
            ? period.filters.branches
                .filter((b) => listBranchIds.includes(b._id))
                .map((b) => b.name)
            : branchNames,
          Status:
            FILTERS.find((f) => f.key === listStatus)?.label || listStatus,
          Generated: new Date().toLocaleString(),
        },
        // every page of the list as filtered now, loaded when the export opens
        load: async () => {
          const res = await fetchOpenScheduledOrdersService({
            from,
            to,
            branchIds,
            listBranchIds,
            status: listStatus,
            all: true,
          });
          if (res.error) throw new Error(res.error);
          return res.data.orders.map(exportRow);
        },
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

  // the list's branch picker offers the report's branches (all of them when none is picked)
  const listBranchOptions = useMemo(() => {
    const all = period?.filters?.branches || [];
    return branchIds.length
      ? all.filter((b) => branchIds.includes(b._id))
      : all;
  }, [period, branchIds]);

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
      className={`flex flex-col gap-4 bg-white transition-opacity ${periodLoading ? 'opacity-60' : ''}`}
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
          onShow={(key) => setListFilters({ status: key })}
        />
      </section>

      <CashVsSalesPanel
        Line={Line}
        money={money}
        from={from}
        to={to}
        r={r}
        period={period}
      />

      <OrderList
        rangeLabel={rangeLabel}
        money={money}
        when={when}
        from={from}
        to={to}
        FILTERS={FILTERS}
        list={list}
        listBranchOptions={listBranchOptions}
        listFilters={listFilters}
        setListFilters={setListFilters}
        listLoading={listLoading}
        setAction={setAction}
        Tags={Tags}
        canManage={canManage}
        setDetails={setDetails}
        setListState={setListState}
      />

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
