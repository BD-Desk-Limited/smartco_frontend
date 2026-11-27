import ErrorInterface from '@/components/account/errorInterface';
import { OFFERED_METHODS } from '@/utilities/paymentMethods';
import React, { useState } from 'react';

// Cancel (optionally with a refund) or refund an order. The server re-checks every limit.
const ActionModal = ({ action, money, onClose, onDone }) => {
  const { type, order } = action;
  const isCancel = type === 'cancel';
  const [reason, setReason] = useState('');
  const [giveRefund, setGiveRefund] = useState(
    !isCancel || order.refundable > 0
  );
  const [amount, setAmount] = useState(
    order.refundable > 0 ? String(order.refundable) : ''
  );
  const [method, setMethod] = useState(OFFERED_METHODS[0]?.value || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const amountNum = Number(amount);
  const refundValid =
    !giveRefund || (amountNum >= 0.01 && amountNum <= order.refundable + 0.001);
  const canSubmit =
    !saving && refundValid && (!isCancel || reason.trim().length >= 3);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    const refund = giveRefund ? { amount: amountNum, method } : undefined;
    const res = isCancel
      ? await cancelScheduledOrderService(order.orderId, {
          reason: reason.trim(),
          refund,
        })
      : await refundOrderService(order.orderId, {
          ...refund,
          reason: reason.trim() || undefined,
        });
    setSaving(false);
    if (res.error) return setError(res.error);
    onDone(
      isCancel
        ? `Order ${order.orderId} cancelled${refund ? `, ${money(refund.amount)} refunded` : ''}.`
        : `${money(refund.amount)} refunded on order ${order.orderId}.`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[90] flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-xl p-5 w-full max-w-md flex flex-col gap-3 text-sm"
      >
        <h3 className="font-semibold text-base">
          {isCancel ? 'Cancel scheduled order' : 'Refund'} · {order.orderId}
        </h3>
        <p className="text-text-gray">
          {order.customer?.name || 'Walk-in customer'} · paid{' '}
          {money(order.netPaid)}
          {order.refunded > 0
            ? ` (after ${money(order.refunded)} refunded)`
            : ''}
          . Up to {money(order.refundable)} can be refunded.
        </p>

        <label className="flex flex-col gap-1">
          {isCancel ? 'Reason for cancelling' : 'Reason (optional)'}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={2}
            required={isCancel}
            className="border rounded-md p-2 outline-brand-green"
          />
        </label>

        {isCancel && order.refundable > 0 && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={giveRefund}
              onChange={(e) => setGiveRefund(e.target.checked)}
              className="accent-brand-green"
            />
            Refund the customer now
          </label>
        )}
        {isCancel && order.refundable > 0 && !giveRefund && (
          <p className="text-xs text-text-gray">
            {money(order.refundable)} stays held on the cancelled order (e.g. a
            kept deposit). It can still be refunded later.
          </p>
        )}

        {giveRefund && (
          <div className="flex gap-2">
            <label className="flex flex-col gap-1 flex-1">
              Amount to refund
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={order.refundable}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded-md p-2 outline-brand-green"
              />
            </label>
            <label className="flex flex-col gap-1 flex-1">
              Refunded by
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="border rounded-md p-2 outline-brand-green"
              >
                {OFFERED_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {giveRefund && !refundValid && (
          <p className="text-xs text-error">
            Enter an amount between {money(0.01)} and {money(order.refundable)}.
          </p>
        )}

        {error && <ErrorInterface error={error} />}
        <div className="flex justify-end gap-2 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded border"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-3 py-2 rounded text-white ${isCancel ? 'bg-red-600' : 'bg-brand-blue'} ${canSubmit ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            {saving ? 'Saving...' : isCancel ? 'Cancel order' : 'Refund'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionModal;
