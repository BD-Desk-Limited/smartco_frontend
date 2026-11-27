import React from 'react';

const OrderRow = ({
  order: o,
  money,
  when,
  canManage,
  onOpen,
  onCancel,
  onRefund,
  Tags,
}) => {
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };
  return (
    <tr
      className="border-t align-top cursor-pointer hover:bg-gray-shadow10"
      onClick={onOpen}
    >
      <td className="p-2">
        <button
          type="button"
          onClick={stop(onOpen)}
          className="text-left hover:underline"
        >
          <span className="font-semibold block">
            {o.customer?.name || 'Walk-in customer'}
          </span>
          <span className="text-xs text-text-gray block">{o.orderId}</span>
          <span className="text-xs text-text-gray">
            {o.branch?.name} · {o.itemCount} item(s)
          </span>
        </button>
      </td>
      <td className="p-2">{when(o.scheduledFor)}</td>
      <td className="p-2">
        <Tags order={o} />
      </td>
      <td className="p-2 text-right">
        {o.totalAmount !== null ? (
          money(o.totalAmount)
        ) : (
          <>
            {money(o.quotedTotal)}
            <span className="block text-xs text-text-gray">quoted</span>
          </>
        )}
      </td>
      <td className="p-2 text-right">
        {money(o.netPaid)}
        {o.refunded > 0 && (
          <span className="block text-xs text-text-gray">
            {money(o.paid)} paid, {money(o.refunded)} refunded
          </span>
        )}
      </td>
      <td className="p-2 text-right">
        {o.actions.cancel ? money(o.balanceDue) : '-'}
        {o.refundable > 0 && (
          <span className="block text-xs text-error">
            {money(o.refundable)} refundable
          </span>
        )}
      </td>
      <td className="p-2">
        <div className="flex flex-wrap gap-1">
          {canManage && o.actions.cancel && (
            <button
              type="button"
              onClick={stop(onCancel)}
              className="text-xs px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
          )}
          {canManage && o.actions.refund && (
            <button
              type="button"
              onClick={stop(onRefund)}
              className="text-xs px-2 py-1 rounded border border-brand-blue text-brand-blue hover:bg-blue-50"
            >
              Refund
            </button>
          )}
        </div>
        {o.actions.fulfilAtSalesPoint && (
          <span className="block text-xs text-text-gray mt-1">
            Fulfil at the sales point
          </span>
        )}
        {!o.actions.cancel && !o.actions.refund && (
          <span className="block text-xs text-text-gray">
            Nothing more to do
          </span>
        )}
      </td>
    </tr>
  );
};
export default OrderRow;
