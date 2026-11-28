'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  listDeclarations,
  openDeclarationDay,
} from '@/services/cashDeclarationServices';
import DeclarationModal from './DeclarationModal';
import CashRecTotals from './CashRecTotals';
import ExportContent from '@/components/account/common/ExportContent';
import { FaFileExport } from 'react-icons/fa';
import {
  STATUS,
  StatusChip,
  makeMoney,
  showDay,
  showTime,
  ymd,
} from './cashRecHelpers';

const MAX_DAYS = 93; // the server allows the same
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return ymd(d);
};
const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const sumOf = (list, field) =>
  r2(list.reduce((s, r) => s + (r[field] || 0), 0));
const waitingLabel = (w) =>
  w === 'manager' ? 'Manager' : w === 'finance' ? 'Finance' : '-';

// what the Export window gets: the rows shown, a totals row under them, the period totals as
// details, and the breakdowns by branch and by payment method as extra tables
const buildExport = ({ rows, data, dates, branchId, status, side }) => {
  const t = data.aggregate?.totals;
  const branchName =
    (branchId && data.branches?.find((b) => b._id === branchId)?.name) ||
    (side === 'manager' ? 'All my branches' : 'All branches');
  const declared = rows.filter((r) => r.banked !== null);
  const moneyCols = (r) => ({
    Expected: r.expected,
    Deductions: r.deductions,
    'To bank': r.toBank,
    Banked: r.banked,
    Variance: r.variance,
  });
  return {
    fileName: `cash-reconciliation_${dates.from}_${dates.to}`,
    metadata: {
      Period: `${showDay(dates.from)} to ${showDay(dates.to)}`,
      Branches: branchName,
      Status: status === 'all' ? 'All' : STATUS[status].label,
      ...(t
        ? {
            'Period totals (every status)': [
              `${t.days} branch-day(s)`,
              `expected ${r2(t.expected)}`,
              `deductions ${r2(t.deductions)}`,
              `to bank ${r2(t.toBank)}`,
              `banked ${r2(t.declared.banked)} on ${t.declared.days} declared day(s)`,
              `variance ${r2(t.declared.variance)}`,
              `not declared yet ${r2(t.notDeclared.toBank)} on ${t.notDeclared.days} day(s)`,
              `approved ${r2(t.approved.banked)} on ${t.approved.days} day(s)`,
            ],
          }
        : {}),
      // the company's currency is { code, symbol, name }
      ...(data.currency
        ? {
            Currency:
              typeof data.currency === 'object'
                ? [
                    data.currency.name,
                    data.currency.code,
                    data.currency.symbol && `(${data.currency.symbol})`,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : String(data.currency),
          }
        : {}),
      Generated: new Date().toLocaleString(),
    },
    data: rows.map((r) => ({
      Day: r.businessDay,
      Branch: r.branch.name,
      Status: STATUS[r.status]?.label || r.status,
      ...moneyCols(r),
      'Proofs of payment': r.proofs,
      'Waiting on': waitingLabel(r.waitingOn),
    })),
    // banked and variance add up the declared days only, as on the page
    totals: rows.length
      ? {
          Day: 'Total',
          Branch: `${rows.length} day(s)`,
          Status: `${declared.length} declared`,
          Expected: sumOf(rows, 'expected'),
          Deductions: sumOf(rows, 'deductions'),
          'To bank': sumOf(rows, 'toBank'),
          Banked: sumOf(declared, 'banked'),
          Variance: sumOf(declared, 'variance'),
          'Proofs of payment': rows.reduce((s, r) => s + (r.proofs || 0), 0),
          'Waiting on': '',
        }
      : null,
    sections: data.aggregate
      ? [
          {
            title: 'By branch (every status)',
            data: data.aggregate.byBranch.map((b) => ({
              Branch: b.branch.name,
              Days: b.days,
              Approved: b.approved,
              'With finance': b.awaitingFinance,
              'With managers': b.awaitingManager,
              ...moneyCols(b),
            })),
            totals:
              data.aggregate.byBranch.length > 1
                ? {
                    Branch: 'Total',
                    Days: t.days,
                    Approved: t.approved.days,
                    'With finance': sumOf(
                      data.aggregate.byBranch,
                      'awaitingFinance'
                    ),
                    'With managers': sumOf(
                      data.aggregate.byBranch,
                      'awaitingManager'
                    ),
                    Expected: t.expected,
                    Deductions: t.deductions,
                    'To bank': t.toBank,
                    Banked: t.declared.banked,
                    Variance: t.declared.variance,
                  }
                : null,
          },
          {
            title: 'By payment method (every status)',
            data: data.aggregate.byMethod.map((m) => ({
              'Payment method': m.label,
              ...moneyCols(m),
            })),
            totals:
              data.aggregate.byMethod.length > 1
                ? {
                    'Payment method': 'Total',
                    Expected: sumOf(data.aggregate.byMethod, 'expected'),
                    Deductions: sumOf(data.aggregate.byMethod, 'deductions'),
                    'To bank': sumOf(data.aggregate.byMethod, 'toBank'),
                    Banked: sumOf(data.aggregate.byMethod, 'banked'),
                    Variance: sumOf(data.aggregate.byMethod, 'variance'),
                  }
                : null,
          },
        ]
      : [],
  };
};

const FILTERS = [
  'all',
  'not_started',
  'draft',
  'submitted',
  'changes_requested',
  'approved',
];

/*
  Cash reconciliation list: one row per branch per business day that had till activity (or has a
  declaration). side 'manager': prepare and submit; side 'finance': check and approve.
  ?declaration=<id> in the URL (a notification's link) opens that declaration.
*/
const CashReconciliation = ({ side }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const linkedId = params.get('declaration');
  // ?status=<status> (e.g. from the manager dashboard) starts with that filter
  const linkedStatus = params.get('status');

  const [dates, setDates] = React.useState({ from: daysAgo(6), to: ymd() });
  const [branchId, setBranchId] = React.useState('');
  const [status, setStatus] = React.useState(
    FILTERS.includes(linkedStatus) ? linkedStatus : 'all'
  );
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [opening, setOpening] = React.useState(null);
  const [modal, setModal] = React.useState(null); // { id, initial }
  const [showExport, setShowExport] = React.useState(false);
  const staleRef = React.useRef(false);

  const span =
    Math.round((new Date(dates.to) - new Date(dates.from)) / 86400000) + 1;
  const datesError =
    !dates.from || !dates.to
      ? 'Pick both dates.'
      : dates.from > dates.to
        ? 'The start date must be on or before the end date.'
        : span > MAX_DAYS
          ? `Pick at most ${MAX_DAYS} days.`
          : null;

  const load = React.useCallback(async () => {
    if (datesError) return;
    setLoading(true);
    setError(null);
    const { data: d, error: err } = await listDeclarations(side, {
      ...dates,
      branchIds: branchId ? [branchId] : [],
    });
    setLoading(false);
    if (err) return setError(err);
    setData(d);
  }, [side, dates, branchId, datesError]);

  React.useEffect(() => {
    load();
  }, [load]);

  // a notification link opens its declaration
  React.useEffect(() => {
    if (linkedId) setModal({ id: linkedId, initial: null });
  }, [linkedId]);

  const money = React.useMemo(
    () => makeMoney(data?.currency),
    [data?.currency]
  );

  // A day not started yet: the manager starts it (a draft); finance sees the till figures read only,
  // from where they can ask the branch to declare it.
  const openRow = async (row) => {
    if (row.declarationId) {
      return setModal({ id: row.declarationId, initial: null });
    }
    const key = `${row.branch._id}|${row.businessDay}`;
    setOpening(key);
    const { data: d, error: err } = await openDeclarationDay(
      side,
      row.branch._id,
      row.businessDay
    );
    setOpening(null);
    if (err) return setError(err);
    if (!d.preview) staleRef.current = true;
    setModal({ id: d._id, initial: d, key: d._id || `preview-${key}` });
  };

  const closeModal = () => {
    setModal(null);
    if (linkedId) router.replace(pathname);
    if (staleRef.current) {
      staleRef.current = false;
      load();
    }
  };

  const rows = (data?.rows || []).filter(
    (r) => status === 'all' || r.status === status
  );
  const count = (s) =>
    s === 'all' ? data?.rows?.length || 0 : data?.summary?.[s] || 0;

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-5 w-full min-w-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-lg text-text-black">
          Cash reconciliation
        </h1>
        <p className="text-sm text-text-gray">
          {side === 'manager'
            ? 'For each branch and day: what the tills recorded, less approved deductions, against what was banked. Upload the proof of payment and submit it for finance to approve.'
            : 'Check what managers declared as banked against the bank or settlement records, then approve it or send it back with what needs to change.'}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2 text-sm">
        <label className="flex flex-col">
          <span className="text-xs text-text-gray">From</span>
          <input
            type="date"
            value={dates.from}
            max={dates.to || undefined}
            onChange={(e) => setDates((d) => ({ ...d, from: e.target.value }))}
            className="p-1 rounded-md border border-gray-300"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-text-gray">To</span>
          <input
            type="date"
            value={dates.to}
            min={dates.from || undefined}
            max={ymd()}
            onChange={(e) => setDates((d) => ({ ...d, to: e.target.value }))}
            className="p-1 rounded-md border border-gray-300"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-text-gray">Branch</span>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="p-1 rounded-md border border-gray-300 min-w-[10rem]"
          >
            <option value="">
              {side === 'manager' ? 'All my branches' : 'All branches'}
            </option>
            {(data?.branches || []).map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setDates({ from: daysAgo(6), to: ymd() })}
          className="px-2 py-1 rounded-md border border-brand-green text-brand-green"
        >
          Last 7 days
        </button>
        <button
          type="button"
          onClick={() => setDates({ from: daysAgo(29), to: ymd() })}
          className="px-2 py-1 rounded-md border border-brand-green text-brand-green"
        >
          Last 30 days
        </button>
        {datesError && (
          <span className="text-xs text-red-600 w-full">{datesError}</span>
        )}
      </div>

      {data?.aggregate && (
        <div
          className={
            loading ? 'opacity-60 transition-opacity' : 'transition-opacity'
          }
        >
          <CashRecTotals aggregate={data.aggregate} money={money} side={side} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Status">
          {FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`px-3 py-1 rounded-full text-sm border ${status === s ? 'bg-brand-green text-white border-brand-green' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {s === 'all' ? 'All' : STATUS[s].label} ({count(s)})
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowExport(true)}
          disabled={!data || loading}
          className="px-3 py-1 rounded-md text-sm border border-gray-300 text-text-gray hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50"
        >
          <FaFileExport /> Export
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="max-h-[70vh] overflow-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs text-gray-600 shadow-sm">
            <tr>
              <th className="text-left p-2">Day</th>
              <th className="text-left p-2">Branch</th>
              <th className="text-left p-2">Status</th>
              <th className="text-right p-2">Expected</th>
              <th className="text-right p-2">Deductions</th>
              <th className="text-right p-2">To bank</th>
              <th className="text-right p-2">Banked</th>
              <th className="text-right p-2">Variance</th>
              <th className="text-center p-2">Proof</th>
              <th className="text-left p-2">Waiting on</th>
              <th className="text-left p-2">Last message</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-gray-500">
                  Nothing for these dates.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const key = `${r.branch._id}|${r.businessDay}`;
              return (
                <tr
                  key={key}
                  onClick={() => openRow(r)}
                  title={
                    r.declarationId
                      ? 'Open'
                      : side === 'manager'
                        ? 'Start this day'
                        : 'See the till figures and ask the branch to declare it'
                  }
                  className="border-t cursor-pointer hover:bg-green-50"
                >
                  <td className="p-2 whitespace-nowrap">
                    {showDay(r.businessDay)}
                  </td>
                  <td className="p-2">{r.branch.name}</td>
                  <td className="p-2">
                    {opening === key ? (
                      'Opening…'
                    ) : (
                      <StatusChip status={r.status} />
                    )}
                  </td>
                  <td className="p-2 text-right">{money(r.expected)}</td>
                  <td className="p-2 text-right">
                    {r.deductions ? `- ${money(r.deductions)}` : '-'}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {money(r.toBank)}
                  </td>
                  <td className="p-2 text-right">
                    {r.banked === null ? '-' : money(r.banked)}
                  </td>
                  <td
                    className={`p-2 text-right whitespace-nowrap ${r.variance && Math.abs(r.variance) >= 0.01 ? 'text-red-600 font-semibold' : ''}`}
                  >
                    {r.variance === null ? '-' : money(r.variance)}
                  </td>
                  <td className="p-2 text-center">{r.proofs || '-'}</td>
                  <td className="p-2 whitespace-nowrap">
                    {r.waitingOn === 'manager'
                      ? 'Manager'
                      : r.waitingOn === 'finance'
                        ? 'Finance'
                        : '-'}
                  </td>
                  <td className="p-2 whitespace-nowrap text-xs text-gray-600">
                    {r.lastActivity
                      ? `${r.lastActivity.side === 'finance' ? 'Finance' : 'Manager'} · ${showTime(r.lastActivity.at)}`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showExport && data && (
        <div
          className="inset-0 fixed bg-black bg-opacity-60 z-[80] flex justify-center items-center"
          onClick={() => setShowExport(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ExportContent
              title="Cash reconciliation"
              emptyMessage="Nothing for these dates."
              {...buildExport({ rows, data, dates, branchId, status, side })}
              onClose={() => setShowExport(false)}
            />
          </div>
        </div>
      )}

      {modal && (
        <DeclarationModal
          key={modal.key || modal.id}
          side={side}
          declarationId={modal.id}
          initial={modal.initial}
          onClose={closeModal}
          onChanged={() => {
            staleRef.current = true;
          }}
        />
      )}
    </div>
  );
};

export default CashReconciliation;
