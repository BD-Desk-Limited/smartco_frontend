import React from 'react';
import { rangeLabel } from '../../../reportFormat';
import { methodLabel } from '@/utilities/paymentMethods';
{
  /* period: how deposits and refunds explain the cash against sales */
}

const CashVsSalesPanel = ({ Line, money, from, to, r, period }) => {
  return (
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
  );
};

export default CashVsSalesPanel;
