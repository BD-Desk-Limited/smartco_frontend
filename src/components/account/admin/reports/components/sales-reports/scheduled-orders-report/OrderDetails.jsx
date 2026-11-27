import { methodLabel } from '@/utilities/paymentMethods';
import React, { useEffect } from 'react';

// Everything about one order: items, payments, refunds and the reasons given
const OrderDetails = ({
  o,
  when,
  money,
  canManage,
  onClose,
  onCancel,
  onRefund,
  Tags,
}) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const history = [
    ...o.payments.map((p) => ({ ...p, at: p.paidAt })),
    ...o.refunds.map((x) => ({ ...x, at: x.refundedAt, refund: true })),
  ].sort((a, b) => new Date(a.at) - new Date(b.at));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${o.orderId}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-4 text-sm"
      >
        <div className="flex justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base">
              {o.customer?.name || 'Walk-in customer'} · {o.orderId}
            </h3>
            <Tags order={o} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none h-fit"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Branch">{o.branch?.name || '-'}</Field>
          <Field label="Customer number">
            {o.customer?.customerNumber || '-'}
          </Field>
          <Field label="Phone">{o.customer?.phone || '-'}</Field>
          <Field label="Scheduled on">{when(o.scheduledAt)}</Field>
          <Field label="Due for">{when(o.scheduledFor)}</Field>
          {o.fulfilledAt && (
            <Field label="Fulfilled on">{when(o.fulfilledAt)}</Field>
          )}
          <Field label="Quoted total">{money(o.quotedTotal)}</Field>
          {o.totalAmount !== null && (
            <Field label="Final total">{money(o.totalAmount)}</Field>
          )}
          <Field label="Paid">{money(o.paid)}</Field>
          <Field label="Refunded">{money(o.refunded)}</Field>
          <Field label="Held (paid less refunded)">{money(o.netPaid)}</Field>
          {o.actions.cancel && (
            <Field label="Balance due (quoted)">{money(o.balanceDue)}</Field>
          )}
          {o.refundable > 0 && (
            <Field label="Can be refunded">{money(o.refundable)}</Field>
          )}
        </div>

        {o.cancellation && (
          <div className="rounded-lg bg-red-50 p-3">
            <span className="font-semibold">Cancelled</span>{' '}
            {when(o.cancellation.cancelledAt)}
            {o.cancellation.cancelledBy
              ? ` by ${o.cancellation.cancelledBy}`
              : ''}
            <p className="mt-1">Reason: {o.cancellation.reason || '-'}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-1">Items</h4>
          <ul className="flex flex-col gap-0.5">
            {o.items.map((item, i) => (
              <li
                key={`${item.name}-${i}`}
                className="flex justify-between gap-3 border-b py-1"
              >
                <span>{item.name}</span>
                <span>× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-1">Payments and refunds</h4>
          {history.length === 0 ? (
            <p className="text-text-gray">No payments yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {history.map((h, i) => (
                <li
                  key={`${h.at}-${i}`}
                  className={`flex justify-between gap-3 border-b py-1 ${h.refund ? 'text-red-600' : ''}`}
                >
                  <span>
                    {when(h.at)} ·{' '}
                    {h.refund
                      ? 'Refund'
                      : h.stage === 'advance'
                        ? 'Deposit'
                        : 'At fulfilment'}{' '}
                    · {methodLabel(h.method)}
                    {h.refund
                      ? h.refundedBy && ` · by ${h.refundedBy}`
                      : h.recordedBy && ` · taken by ${h.recordedBy}`}
                    {h.late && (
                      <span className="block text-xs text-error">
                        Late: this checkout reached the server after the order
                        had changed, so it did not change the order. The money
                        is kept here; refund it if it should not have been
                        taken.
                      </span>
                    )}
                    {h.reason && (
                      <span className="block text-xs text-text-gray">
                        Reason: {h.reason}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap">
                    {h.refund ? '-' : ''}
                    {money(h.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {o.actions.fulfilAtSalesPoint && (
            <span className="text-xs text-text-gray mr-auto self-center">
              Fulfil this order at the sales point.
            </span>
          )}
          {canManage && o.actions.cancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded border border-red-500 text-red-600 hover:bg-red-50"
            >
              Cancel order
            </button>
          )}
          {canManage && o.actions.refund && (
            <button
              type="button"
              onClick={onRefund}
              className="px-3 py-2 rounded border border-brand-blue text-brand-blue hover:bg-blue-50"
            >
              Refund
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded border"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderDetails;

const Field = ({ label, children }) => (
  <div className="flex flex-col">
    <span className="text-xs text-text-gray">{label}</span>
    <span>{children}</span>
  </div>
);
