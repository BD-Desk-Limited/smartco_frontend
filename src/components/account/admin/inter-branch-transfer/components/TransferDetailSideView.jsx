import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { formatDate, ISOStringToLocalTime } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';
import { commaNumberFormat } from '@/utilities/numbersUtils';

const HISTORY_LABELS = {
  note: 'Note',
  dispute: 'Disputed',
  reply: 'Resubmitted',
  accepted: 'Accepted',
  cancelled: 'Cancelled',
};

const MODE_COPY = {
  accept: {
    title: 'Accept this transfer?',
    help: (t) =>
      `Each batch is copied to ${t.toBranch?.name} with its original cost and expiry, and the quantity is taken off ${t.fromBranch?.name}. After this the transfer is view-only.`,
    label: 'Note (optional)',
    button: 'Confirm accept',
    style: 'bg-brand-blue',
  },
  dispute: {
    title: 'Raise a dispute',
    help: () =>
      'Say what is wrong. The sender will see this and can adjust or explain.',
    label: 'What is the problem?',
    button: 'Send dispute',
    style: 'bg-error',
  },
  resubmit: {
    title: 'Resubmit to receiver',
    help: () =>
      'Adjust the quantities if needed (set a quantity to 0 to remove an item).',
    label: 'Message to the receiver',
    button: 'Resubmit',
    style: 'bg-brand-blue',
  },
  cancel: {
    title: 'Cancel this transfer?',
    help: () =>
      'Nothing has moved, so no stock changes. This cannot be undone.',
    label: 'Reason (optional)',
    button: 'Cancel transfer',
    style: 'bg-error',
  },
};

const TransferDetailSideView = ({
  transfer,
  setTransfer,
  STATUS_OPTIONS,
  onAction, // (kind, id, payload) => Promise<{ ok } | { error }>
  onExport, // receives { data, title, metadata, fileName } and opens the export modal
}) => {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState('');
  const [qty, setQty] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const p = transfer.permissions || {};
  const canAct = p.canAccept || p.canDispute || p.canResubmit || p.canCancel;
  const statusOption = STATUS_OPTIONS.find((s) => s.value === transfer.status);
  const accepted = transfer.status === 'accepted';
  const close = () => setTransfer(null);

  const startMode = (next) => {
    setMode(next);
    setText('');
    setError('');
    if (next === 'resubmit') {
      setQty(
        Object.fromEntries(
          transfer.items.map((i) => [i._id, String(i.quantity)])
        )
      );
    }
  };

  const submit = async () => {
    setError('');
    let payload = {};

    if (mode === 'accept') payload = { note: text };
    if (mode === 'cancel') payload = { reason: text };
    if (mode === 'dispute') {
      if (!text.trim())
        return setError('Explain what is wrong so the sender can fix it.');
      payload = { reason: text };
    }
    if (mode === 'resubmit') {
      if (!text.trim())
        return setError('Add a message explaining what changed.');
      const items = transfer.items
        .map((i) => ({ batchId: i.batchId, quantity: Number(qty[i._id]) }))
        .filter((i) => i.quantity > 0);
      if (items.length === 0) {
        return setError(
          'Keep at least one item above 0, or cancel the transfer instead.'
        );
      }
      const original = new Map(
        transfer.items.map((i) => [i.batchId, i.quantity])
      );
      const changed =
        items.length !== transfer.items.length ||
        items.some((i) => original.get(i.batchId) !== i.quantity);
      payload = { message: text, ...(changed && { items }) };
    }

    setBusy(true);
    const result = await onAction(mode, transfer._id, payload);
    setBusy(false);
    if (result?.error) return setError(result.error);
    setMode(null);
    setText('');
  };

  const handleExport = () => {
    const data = transfer.items.map((i) => ({
      Item: i.name,
      Batch: i.batchNumber || '-',
      Brand: i.brand || '-',
      Expiry: i.expiryDate ? formatDate(new Date(i.expiryDate)) : '-',
      Quantity: i.quantity,
      Unit: i.unit || '-',
      'Unit Cost': Math.round(i.unitCost * 100) / 100,
      'Line Total': i.lineTotal,
    }));

    const history = transfer.history
      .map(
        (h) =>
          `${HISTORY_LABELS[h.kind] || h.kind} - ${h.by?.fullName || 'Unknown'}, ${ISOStringToLocalTime(h.createdAt)}${
            h.detail ? `\n${h.detail}` : ''
          }`
      )
      .join('\n\n');

    onExport?.({
      data,
      title: 'Stock Transfer',
      fileName: `stock-transfer_${transfer.transferID}`,
      emptyMessage: 'No items',
      metadata: {
        'Transfer ID': transfer.transferID,
        From: transfer.fromBranch?.name || 'N/A',
        To: transfer.toBranch?.name || 'N/A',
        Status: capitalizeFirst(transfer.status),
        Raised: ISOStringToLocalTime(transfer.createdAt),
        'Raised by': transfer.createdBy?.fullName || 'N/A',
        Total: commaNumberFormat(transfer.totalCost || 0, 2),
        ...(accepted && {
          Accepted: ISOStringToLocalTime(transfer.acceptedAt),
          'Accepted by': transfer.acceptedBy?.fullName || 'N/A',
        }),
        ...(history && { History: history }),
      },
    });
  };

  const copy = mode ? MODE_COPY[mode] : null;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/3 h-full bg-text-white flex flex-col px-3 text-sm text-text-gray gap-3 overflow-y-auto scrollbar-thin"
    >
      <div className="sticky top-0 z-40 py-1 bg-text-white">
        <div className="flex items-center justify-between pr-8">
          <h3 className="font-semibold text-text-black">TRANSFER DETAILS</h3>
          {onExport && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-2 py-1 border border-gray-border rounded-md hover:bg-gray-shadow10"
            >
              <FaPrint aria-hidden="true" /> Print / Export
            </button>
          )}

          <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
            <FaTimes className="text-text-white" onClick={close} />
          </div>
        </div>
        <hr></hr>
      </div>

      <div className="flex flex-row justify-between">
        <span>Transfer ID</span>
        <span className="text-text-black">{transfer.transferID}</span>
      </div>
      <div className="flex flex-row justify-between">
        <span>From</span>
        <span className="text-text-black">
          {capitalizeFirst(transfer.fromBranch?.name) || 'N/A'}
        </span>
      </div>
      <div className="flex flex-row justify-between">
        <span>To</span>
        <span className="text-text-black">
          {capitalizeFirst(transfer.toBranch?.name) || 'N/A'}
        </span>
      </div>
      <div className="flex flex-row justify-between">
        <span>Raised</span>
        <span className="flex flex-col items-end">
          <span>{ISOStringToLocalTime(transfer.createdAt)}</span>
          <span>by {transfer.createdBy?.fullName || 'N/A'}</span>
        </span>
      </div>
      {transfer.revision > 1 && (
        <div className="flex flex-row justify-between">
          <span>Revision</span>
          <span>{transfer.revision}</span>
        </div>
      )}
      <hr></hr>

      <div className="flex flex-row justify-between items-start">
        <span>Status</span>
        <span className="flex flex-col items-end">
          <span
            className={`${statusOption?.color || 'bg-gray-500 text-text-white'} p-1 rounded-md`}
          >
            {capitalizeFirst(transfer.status)}
          </span>
          {accepted && (
            <span className="mt-1">
              {ISOStringToLocalTime(transfer.acceptedAt)} by{' '}
              {transfer.acceptedBy?.fullName || 'N/A'}
            </span>
          )}
        </span>
      </div>
      <hr></hr>

      <div className="flex flex-col">
        <span>Items:</span>
        <ul className="flex flex-col w-full gap-2 p-2 bg-blue-shadow10">
          {transfer.items?.length ? (
            transfer.items.map((item) => (
              <li key={item._id} className="flex flex-col w-full border-b pb-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-text-black">{item.name}</span>
                  {mode === 'resubmit' ? (
                    <span className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={qty[item._id] ?? ''}
                        onChange={(e) =>
                          setQty((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        }
                        className="w-24 h-7 px-2 border border-gray-border rounded-md text-right"
                      />
                      <span>{item.unit}</span>
                    </span>
                  ) : (
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                  )}
                </div>
                <span className="text-xs">
                  Batch {item.batchNumber || 'N/A'}
                  {item.brand ? ` · ${item.brand}` : ''}
                  {item.expiryDate
                    ? ` · Exp ${formatDate(new Date(item.expiryDate))}`
                    : ''}
                  {` · ${commaNumberFormat(item.unitCost, 2)} each`}
                </span>
                {mode === 'resubmit' && item.sourceBalance != null && (
                  <span className="text-xs">
                    In stock now: {item.sourceBalance} {item.unit}
                    {Number(qty[item._id]) > item.sourceBalance
                      ? ' (this will take the batch negative)'
                      : ''}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li>No items</li>
          )}
        </ul>
        <div className="flex justify-between font-semibold mt-1">
          <span>Total value</span>
          <span>{commaNumberFormat(transfer.totalCost || 0, 2)}</span>
        </div>
      </div>
      <hr></hr>

      <div>
        <span>History:</span>
        <ul className="bg-gray-shadow9 rounded-md max-h-56 overflow-y-auto scrollbar-thin">
          {transfer.history?.length ? (
            transfer.history.map((h) => (
              <li
                key={h._id}
                className="p-2 flex flex-col w-full text-text-black"
              >
                <span className="font-semibold">
                  {HISTORY_LABELS[h.kind] || h.kind}
                </span>
                {h.detail && (
                  <p className="whitespace-pre-wrap break-words">{h.detail}</p>
                )}
                <span className="font-thin italic text-right">
                  {h.by?.fullName || 'Unknown'} ·{' '}
                  {ISOStringToLocalTime(h.createdAt)}
                </span>
                <hr className="border border-gray-shadow2" />
              </li>
            ))
          ) : (
            <li className="p-2 italic">No activity yet</li>
          )}
        </ul>
      </div>

      {/* ---- actions ---- */}
      {!canAct && (accepted || transfer.status === 'cancelled') && (
        <p className="italic">
          This transfer is {transfer.status}. It can only be viewed.
        </p>
      )}
      {!canAct && !accepted && transfer.status !== 'cancelled' && (
        <p className="italic">
          {transfer.status === 'pending'
            ? 'Waiting for the receiving branch to accept or dispute.'
            : 'Waiting for the sending branch to respond to the dispute.'}
        </p>
      )}

      {canAct && !mode && (
        <div className="flex flex-wrap gap-2">
          {p.canAccept && (
            <button
              onClick={() => startMode('accept')}
              className="py-2 px-3 rounded-lg bg-brand-blue text-text-white"
            >
              Accept
            </button>
          )}
          {p.canDispute && (
            <button
              onClick={() => startMode('dispute')}
              className="py-2 px-3 rounded-lg border border-error text-error"
            >
              Raise dispute
            </button>
          )}
          {p.canResubmit && (
            <button
              onClick={() => startMode('resubmit')}
              className="py-2 px-3 rounded-lg bg-brand-blue text-text-white"
            >
              Adjust and resubmit
            </button>
          )}
          {p.canCancel && (
            <button
              onClick={() => startMode('cancel')}
              className="py-2 px-3 rounded-lg border border-gray-border"
            >
              Cancel transfer
            </button>
          )}
        </div>
      )}

      {canAct && mode && (
        <div className="flex flex-col gap-2 p-2 border border-gray-border rounded-md">
          <span className="font-semibold text-text-black">{copy.title}</span>
          <span>{copy.help(transfer)}</span>
          <label className="flex flex-col gap-1">
            {copy.label}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full border border-gray-border rounded-md p-2 text-text-black focus:outline-none focus:ring focus:border-brand-blue"
            />
          </label>
          {error && <span className="text-error">{error}</span>}
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={busy}
              className={`py-2 px-3 rounded-lg text-text-white disabled:opacity-50 ${copy.style}`}
            >
              {busy ? 'Working...' : copy.button}
            </button>
            <button
              onClick={() => setMode(null)}
              disabled={busy}
              className="py-2 px-3 rounded-lg border border-gray-border"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransferDetailSideView;
