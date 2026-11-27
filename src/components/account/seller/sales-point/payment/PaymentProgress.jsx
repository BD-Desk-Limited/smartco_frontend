import React from 'react';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { methodLabel } from '@/utilities/paymentMethods';

// on every scheduled order note: its price is fixed only when it is collected
export const SCHEDULED_PRICE_NOTICE =
  'Please note: prices are confirmed when your order is collected. The total may change if prices change before then; everything you have paid is taken off the final total.';

// where an order stands on payment (what the server stores as selectedPaymentPlan)
export const PAYMENT_PLAN_LABELS = {
  full: 'Paid in full',
  partial: 'Part paid',
  none: 'Not paid',
};

const Row = ({ label, value, strong, accent }) => (
  <div
    className={`flex justify-between gap-2 ${strong ? 'font-semibold' : ''} ${accent || ''}`}
  >
    <span>{label}</span>
    <span>{commaNumberFormat(value, 2)}</span>
  </div>
);

/*
  What the customer has paid, what is collected at this checkout and what is left, so the cashier only
  has to think about the money in front of them.
  progress: { total, earlierPayments, earlierRefunds, paidBefore, collectingNow, balanceAfter }
  paidBefore is what was paid less what was refunded.
*/
const PaymentProgress = ({ progress, mode }) => {
  const {
    total,
    earlierPayments = [],
    earlierRefunds = [],
    paidBefore,
    collectingNow,
    balanceAfter,
  } = progress;

  // payments and refunds, oldest first
  const history = [
    ...earlierPayments.map((e) => ({
      at: e.paidAt,
      method: e.method,
      amount: e.amount,
    })),
    ...earlierRefunds.map((r) => ({
      at: r.refundedAt,
      method: r.method,
      amount: -r.amount,
      refund: true,
    })),
  ].sort((a, b) => new Date(a.at) - new Date(b.at));

  return (
    <div
      className={`mt-3 p-2 rounded-lg border text-sm flex flex-col gap-1 ${mode === 'light' ? 'bg-white' : 'bg-gray-800'}`}
    >
      <h3 className="font-semibold">Payment</h3>
      <Row label="Order total (today's prices)" value={total} />

      {history.length > 0 && (
        <ul className="border-y py-1 my-1 text-text-gray">
          {history.map((line, i) => (
            <li
              key={`${line.at}-${i}`}
              className={`flex justify-between gap-2 ${line.refund ? 'text-red-500' : ''}`}
            >
              <span>
                {new Date(line.at).toLocaleDateString()} ·{' '}
                {line.refund ? 'Refund · ' : ''}
                {methodLabel(line.method)}
              </span>
              <span>{commaNumberFormat(line.amount, 2)}</span>
            </li>
          ))}
        </ul>
      )}
      <Row label="Paid so far" value={paidBefore} />
      <Row
        label="Collecting now"
        value={collectingNow}
        strong
        accent="text-brand-green"
      />
      <Row
        label="Balance after this payment"
        value={balanceAfter}
        strong
        accent={balanceAfter > 0 ? 'text-red-500' : ''}
      />
    </div>
  );
};

export default PaymentProgress;
