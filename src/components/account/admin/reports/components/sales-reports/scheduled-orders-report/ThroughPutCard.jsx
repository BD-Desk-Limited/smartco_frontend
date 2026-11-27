import React from 'react';

// Orders scheduled in the period and where they stand now
const ThroughPutCard = ({ tp, money, period, pctText }) => {
  const rows = [
    {
      label: 'Fulfilled',
      color: 'bg-brand-green',
      group: tp.fulfilled,
      countPct: tp.rates.fulfilledCount,
      valuePct: tp.rates.fulfilledValue,
    },
    {
      label: 'Still open',
      color: 'bg-yellow-400',
      group: tp.open,
      countPct: tp.rates.openCount,
      valuePct: tp.rates.openValue,
    },
    {
      label: 'Cancelled',
      color: 'bg-red-500',
      group: tp.cancelled,
      countPct: tp.rates.cancelledCount,
      valuePct: tp.rates.cancelledValue,
    },
  ];
  return (
    <div className="border border-gray-shadow8 rounded-xl p-4 shadow-md text-sm flex flex-col gap-2">
      <div>
        <h3 className="font-semibold text-base">Throughput</h3>
        <p className="text-xs text-text-gray">
          The {tp.scheduled.count} order(s) scheduled in {period} (quoted{' '}
          {money(tp.scheduled.quoted)}) and where they stand now.
        </p>
      </div>
      {tp.scheduled.count > 0 && (
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-gray-shadow10"
          aria-hidden="true"
        >
          {rows.map((row) =>
            row.group.count ? (
              <span
                key={row.label}
                className={row.color}
                style={{ width: `${row.countPct}%` }}
              />
            ) : null
          )}
        </div>
      )}
      <table className="w-full text-left">
        <thead className="text-text-gray text-xs">
          <tr>
            <th className="py-1" />
            <th className="py-1 text-right">Orders</th>
            <th className="py-1 text-right">% of orders</th>
            <th className="py-1 text-right">Quoted value</th>
            <th className="py-1 text-right">% of value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t">
              <td className="py-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${row.color}`}
                />
                {row.label}
              </td>
              <td className="py-1 text-right">{row.group.count}</td>
              <td className="py-1 text-right">{pctText(row.countPct)}</td>
              <td className="py-1 text-right">{money(row.group.quoted)}</td>
              <td className="py-1 text-right">{pctText(row.valuePct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-text-gray">
        Refunded on these orders: {money(tp.refunded)} (
        {pctText(tp.rates.refundedOfPaid)} of the {money(tp.paid)} paid), on{' '}
        {tp.refundedOrders} order(s) ({pctText(tp.rates.refundedOrders)}).
        {tp.fulfilled.count > 0 &&
          ` The fulfilled ones sold for ${money(tp.fulfilled.sales)} at the prices on the day they were fulfilled.`}
      </p>
    </div>
  );
};

export default ThroughPutCard;
