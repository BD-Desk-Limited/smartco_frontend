import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/account/common/Spinner';
import ErrorInterface from '@/components/account/common/errorInterface';
import { fetchTotalSalesReportService } from '@/services/reportServices';
import KpiCard from '../../KpiCard';
import ComparisonBarChart from '../../ComparisonBarChart';
import {
  formatChange,
  formatCount,
  formatMoney,
  rangeLabel,
} from '../../../reportFormat';
import BuildInsight from './BuildInsight';
import CashVsSalesReport from './CashVsSalesReport';

const COLORS = { green: '#739400', orange: '#EE7D00', blue: '#003399' };

const METRICS = [
  {
    key: 'totalSales',
    title: 'Total Sales',
    money: true,
    color: COLORS.green,
    badge: 'bg-brand-green',
  },
  {
    key: 'transactionCount',
    title: 'Transaction Count',
    money: false,
    color: COLORS.orange,
    badge: 'bg-[#EE7D00]',
  },
  {
    key: 'averagePerTransaction',
    title: 'Average Spent per Transaction',
    money: true,
    color: COLORS.blue,
    badge: 'bg-brand-blue',
  },
];

// "Total Sales" tab: headline figures for the period, optionally side by side with a comparison
// period. Gives the page its branch list, export rows and insight text through onLoaded.
const TotalSales = ({ filters, onLoaded }) => {
  const { from, to, branchIds, compare } = filters;
  const requestKey = JSON.stringify({ from, to, branchIds, compare });
  const [attempt, setAttempt] = useState(0); // bumped by "Try again"
  const [data, setData] = useState(null); // last good result, kept while the next one loads
  const [result, setResult] = useState({ key: null, error: null });
  const loading = result.key !== `${requestKey}${attempt}`;
  const error = loading ? null : result.error;

  useEffect(() => {
    let current = true; // ignore replies to filters that have since changed
    const key = `${requestKey}${attempt}`;
    fetchTotalSalesReportService(JSON.parse(requestKey)).then((response) => {
      if (!current) return;
      if (response.data) setData(response.data);
      setResult({ key, error: response.error || null });
    });
    return () => {
      current = false;
    };
  }, [requestKey, attempt]);

  const money = useCallback(
    (value, opts) => formatMoney(value, data?.currency, opts),
    [data?.currency]
  );
  const formatOf = useCallback(
    (metric) => (metric.money ? money : (v, o) => formatCount(v, o)),
    [money]
  );
  // only show the comparison once the data for it has arrived
  const shownCompare = data?.compareTotals ? compare : null;

  // tell the page what it needs for the filters, export and insight panel
  useEffect(() => {
    if (!data) return;
    const branchNames = branchIds.length
      ? data.filters.branches
          .filter((b) => branchIds.includes(b._id))
          .map((b) => b.name)
      : ['All branches'];
    const periodName = rangeLabel(from, to);
    const compareName =
      shownCompare && rangeLabel(shownCompare.from, shownCompare.to);
    onLoaded({
      branches: data.filters.branches,
      insight: BuildInsight(data, { from, to }, shownCompare),
      export: {
        title: 'Total Sales',
        fileName: `total-sales_${from}_${to}`,
        metadata: {
          Report: 'Total Sales',
          Period: periodName,
          ...(compareName ? { 'Compared with': compareName } : {}),
          Branches: branchNames,
          Generated: new Date().toLocaleString(),
        },
        data: [
          ...METRICS,
          { key: 'branchesWithSales', title: 'Branches with sales' },
        ].map((m) => ({
          Figure: m.title,
          [periodName]: data.totals[m.key],
          ...(compareName
            ? {
                [compareName]: data.compareTotals[m.key],
                Change: formatChange(data.change[m.key]) || '-',
              }
            : {}),
        })),
      },
    });
  }, [data, shownCompare, branchIds, from, to, onLoaded]);

  //cunnulate all card info and their necessary fields
  const cards = useMemo(() => {
    if (!data) return [];
    const { totals, change } = data;
    return [
      ...METRICS.map((m) => ({
        title: m.title,
        value: formatOf(m)(totals[m.key]),
        change: change?.[m.key] ?? null,
        color: m.badge,
      })),
      {
        title: 'Total Branches',
        value: formatCount(totals.branchesWithSales),
        subText: `with sales, of ${totals.branchCount} selected`,
        noChange: true,
      },
    ];
  }, [data, formatOf]);

  if (error && !data) {
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
  if (!data) return <Spinner />;

  const barsFor = (metric) => [
    { label: rangeLabel(from, to), value: data.totals[metric.key] },
    ...(shownCompare
      ? [
          {
            label: rangeLabel(shownCompare.from, shownCompare.to),
            value: data.compareTotals[metric.key],
            compared: true,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`flex flex-col gap-4 bg-white transition-opacity ${loading ? 'opacity-60' : ''}`}
    >
      {error && <ErrorInterface error={error} />}
      <div className="w-full flex justify-center items-center bg-white">
        <section className="grid grid-cols-2 justify-center w-full sm:w-fit sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-10 bg-white p-3 sm:p-4">
          {cards.map((card) => (
            <KpiCard
              key={card.title}
              {...card}
              showChange={Boolean(shownCompare) && !card.noChange}
            />
          ))}
        </section>
      </div>

      <div className="w-full flex justify-between items-center bg-white">
        <section className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-4 w-full p-3 sm:p-5">
          {METRICS.map((m) => (
            <ComparisonBarChart
              key={m.key}
              title={m.title}
              bars={barsFor(m)}
              color={m.color}
              yLabel={m.money ? 'Amount' : 'Transactions'}
              format={formatOf(m)}
            />
          ))}
        </section>
      </div>

      {data.cash && <CashVsSalesReport cash={data.cash} money={money} />}
    </div>
  );
};

export default TotalSales;
