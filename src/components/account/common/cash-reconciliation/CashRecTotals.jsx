'use client';

import React from 'react';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const off = (v) => Math.abs(v || 0) >= 0.01;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const Card = ({ title, value, sub, tone }) => (
  <div className="rounded-xl border border-gray-shadow8 bg-white p-3 shadow-sm flex flex-col gap-1 min-w-0">
    <span className="text-xs text-text-gray leading-tight">{title}</span>
    <span
      className={`text-base sm:text-lg font-semibold leading-tight break-words ${
        tone === 'bad'
          ? 'text-red-600'
          : tone === 'good'
            ? 'text-green-700'
            : 'text-text-black'
      }`}
    >
      {value}
    </span>
    {sub && <span className="text-xs text-text-gray leading-snug">{sub}</span>}
  </div>
);

const VIEWS = [
  { key: 'branch', label: 'By branch' },
  { key: 'method', label: 'By payment method' },
];

/*
  Totals for the selected period and branches, over every branch-day listed (not only the
  status filter shown). Banked and variance count only what has been declared, so a day not
  declared yet is not a shortfall: it is under "Not declared yet".
*/
const CashRecTotals = ({ aggregate, money, side }) => {
  const [view, setView] = React.useState(null); // null | 'branch' | 'method'
  if (!aggregate?.totals?.days) return null;
  const { totals: t, byBranch, byMethod } = aggregate;

  const varianceCell = (v) => (
    <span className={off(v) ? 'text-red-600 font-semibold' : ''}>
      {money(v)}
    </span>
  );
  const moneyCols = [
    {
      key: 'expected',
      header: 'Expected',
      align: 'right',
      cell: (r) => money(r.expected),
    },
    {
      key: 'deductions',
      header: 'Deductions',
      align: 'right',
      cell: (r) => (r.deductions ? `- ${money(r.deductions)}` : '-'),
    },
    {
      key: 'toBank',
      header: 'To bank',
      align: 'right',
      cellClass: () => 'font-semibold',
      cell: (r) => money(r.toBank),
    },
    {
      key: 'banked',
      header: 'Banked',
      align: 'right',
      cell: (r) => money(r.banked),
    },
    {
      key: 'variance',
      header: 'Variance',
      align: 'right',
      cell: (r) => varianceCell(r.variance),
    },
  ];
  const sum = (list, f) => list.reduce((s, r) => s + (r[f] || 0), 0);
  const footerRow = (list) => (
    <div className="flex flex-wrap justify-end gap-x-5 gap-y-1 text-xs pt-2 border-t border-gray-border">
      <span>
        Expected <b>{money(sum(list, 'expected'))}</b>
      </span>
      <span>
        To bank <b>{money(sum(list, 'toBank'))}</b>
      </span>
      <span>
        Banked <b>{money(sum(list, 'banked'))}</b>
      </span>
      <span className={off(sum(list, 'variance')) ? 'text-red-600' : ''}>
        Variance <b>{money(sum(list, 'variance'))}</b>
      </span>
    </div>
  );

  return (
    <section aria-label="Totals for the period" className="flex flex-col gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <Card
          title="Expected"
          value={money(t.expected)}
          sub={`${money(t.takenIn)} taken in${t.refunds ? `, ${money(t.refunds)} refunded` : ''} · ${plural(t.days, 'branch-day')}`}
        />
        <Card
          title="To bank"
          value={money(t.toBank)}
          sub={
            t.deductions
              ? `after ${money(t.deductions)} of deductions`
              : 'no deductions'
          }
        />
        <Card
          title="Banked"
          value={money(t.declared.banked)}
          sub={`declared on ${t.declared.days} of ${plural(t.days, 'day')}, against ${money(t.declared.toBank)} to bank`}
        />
        <Card
          title="Variance"
          value={money(t.declared.variance)}
          tone={off(t.declared.variance) ? 'bad' : undefined}
          sub={
            t.daysWithVariance
              ? `${plural(t.daysWithVariance, 'day')} banked differently`
              : 'declared days match'
          }
        />
        <Card
          title="Not declared yet"
          value={money(t.notDeclared.toBank)}
          tone={t.notDeclared.days ? 'bad' : undefined}
          sub={
            t.notDeclared.days
              ? `to bank on ${plural(t.notDeclared.days, 'day')} with nothing declared`
              : 'every day has been declared'
          }
        />
        <Card
          title="Approved by finance"
          value={money(t.approved.banked)}
          tone={t.approved.days === t.days ? 'good' : undefined}
          sub={`${t.approved.days} of ${plural(t.days, 'day')} signed off${
            off(t.approved.variance)
              ? `, variance ${money(t.approved.variance)}`
              : ''
          }`}
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Breakdown">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView((cur) => (cur === v.key ? null : v.key))}
            aria-pressed={view === v.key}
            className={`px-3 py-1 rounded-md text-sm border ${
              view === v.key
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'branch' && (
        <ResponsiveTable
          align="left"
          dense
          maxHeightClass="md:max-h-[50vh]"
          rows={byBranch}
          getRowKey={(r) => r.branch._id}
          emptyMessage="No branches in this period."
          columns={[
            {
              key: 'name',
              header: 'Branch',
              mobile: 'title',
              cell: (r) => r.branch.name,
            },
            {
              key: 'days',
              header: 'Days',
              mobile: 'subtitle',
              cell: (r) => (
                <span className="text-xs">
                  {r.days} · {r.approved} approved
                  {r.awaitingFinance
                    ? ` · ${r.awaitingFinance} with finance`
                    : ''}
                  {r.awaitingManager
                    ? ` · ${r.awaitingManager} ${side === 'manager' ? 'to do' : 'with managers'}`
                    : ''}
                </span>
              ),
            },
            ...moneyCols,
          ]}
          footer={byBranch.length > 1 ? footerRow(byBranch) : null}
        />
      )}
      {view === 'method' && (
        <ResponsiveTable
          align="left"
          dense
          maxHeightClass="md:max-h-[50vh]"
          rows={byMethod}
          getRowKey={(r) => r.method}
          emptyMessage="No payments in this period."
          columns={[
            {
              key: 'method',
              header: 'Payment method',
              mobile: 'title',
              cell: (r) => r.label,
            },
            ...moneyCols,
          ]}
          footer={byMethod.length > 1 ? footerRow(byMethod) : null}
        />
      )}
    </section>
  );
};

export default CashRecTotals;
