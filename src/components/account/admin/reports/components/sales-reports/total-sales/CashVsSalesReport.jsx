import React from 'react';

/*
  Why the money taken can differ from total sales. Deposits on scheduled orders are cash in the till
  but not sales until the order is fulfilled, so they are shown here, never added to total sales.
*/

const CashVsSalesReport = ({ cash, money }) => {
  const held = cash.heldForScheduledOrders || {};
  const lines = [
    { label: 'Total sales (fulfilled orders)', value: cash.totalSales },
    {
      label: `Deposits taken for scheduled orders (${cash.depositsReceivedCount})`,
      value: cash.depositsReceived,
      sign: '+',
      hint: 'Cash in, not a sale yet',
    },
    {
      label: `Deposits already counted in sales (${cash.depositsAppliedOrders} orders)`,
      value: cash.depositsApplied,
      sign: '-',
      hint: 'Paid on an earlier day, sold in this period',
    },
    {
      label: `Refunds given (${cash.refundsCount})`,
      value: cash.refundsPaid,
      sign: '-',
    },
  ];
  return (
    <section className="w-full px-3 sm:px-5 pb-5">
      <div className="border border-gray-shadow8 rounded-xl p-4 shadow-md flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-text-black">Cash vs sales</h3>
          <p className="text-xs text-text-gray">
            Deposits on scheduled orders are money collected on sales not yet
            fulfilled, so they are shown here and never added to total sales.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <ul className="flex-1 text-sm flex flex-col gap-1">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-3">
                <span>
                  {l.label}
                  {l.hint && (
                    <span className="block text-xs text-text-gray">
                      {l.hint}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap">
                  {l.sign ? `${l.sign} ` : ''} {money(l.value)}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-3 border-t pt-1 font-semibold">
              <span>Total Money that should have been available</span>
              <span>{money(cash.expectedCollections)}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Money recorded at the tills (less refunds)</span>
              <span>{money(cash.actualCollections)}</span>
            </li>
            {Math.abs(cash.difference) >= 0.01 && (
              <li className="flex justify-between gap-3 text-error">
                <span>
                  Difference
                  <span className="block text-xs text-text-gray">
                    A sale fulfilled with part unpaid, or money held above an
                    order&apos;s price that has not been refunded yet
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  {money(cash.difference)}
                </span>
              </li>
            )}
          </ul>
          <div className="lg:w-64 rounded-lg bg-green-shadow7 p-3 text-sm flex flex-col gap-1 h-fit">
            <span className="font-semibold">Held for all scheduled orders</span>
            <span className="text-xl font-bold">{money(held.paid)}</span>
            <span className="text-xs text-text-gray">
              paid on {held.count || 0} open order(s) up to selected date, not
              in sales yet. Details in the Scheduled Orders tab.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashVsSalesReport;
