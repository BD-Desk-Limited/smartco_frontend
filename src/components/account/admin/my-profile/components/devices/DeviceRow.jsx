import React from 'react';
import { FaDesktop } from 'react-icons/fa';
import { formatDeviceTime } from '../sessions/SessionRow';

const MAX_CHIPS = 2;

const timeAgo = (value) => {
  if (!value) return null;
  const minutes = Math.round((Date.now() - new Date(value)) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} day${days === 1 ? '' : 's'} ago` : formatDeviceTime(value);
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

const BranchChips = ({ device }) => {
  if (device.allBranches) {
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-brand-blue">All branches</span>;
  }
  const shown = device.branches.slice(0, MAX_CHIPS);
  const extra = device.branches.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1" title={device.branches.map((b) => b.name).join(', ')}>
      {shown.map((b) => (
        <span key={b._id} className="px-2 py-0.5 text-xs rounded-full bg-gray-shadow5 text-text-black">
          {b.name}
        </span>
      ))}
      {extra > 0 && <span className="px-2 py-0.5 text-xs text-text-gray">+{extra} more</span>}
    </div>
  );
};

// One trusted device in the Device Authorization table.
const DeviceRow = ({ device, canManage, busy, onEdit, onRevoke }) => (
  <tr className="text-sm text-text-black border-b border-gray-border last:border-b-0">
    <td className="py-3 pr-4">
      <div className="flex items-center gap-2">
        <FaDesktop className="text-brand-blue shrink-0" />
        <span className="font-medium break-words">{device.deviceName}</span>
        {device.isCurrent && (
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-brand-green text-text-white whitespace-nowrap">
            This device
          </span>
        )}
      </div>
    </td>
    <td className="py-3 pr-4">
      <BranchChips device={device} />
    </td>
    <td className="py-3 pr-4 whitespace-nowrap">{device.addedBy?.fullName || '—'}</td>
    <td className="py-3 pr-4 whitespace-nowrap">{formatDate(device.createdAt)}</td>
    <td className="py-3 pr-4 whitespace-nowrap" title={device.lastUsedAt ? formatDeviceTime(device.lastUsedAt) : ''}>
      {device.lastUsedAt ? (
        <>
          {timeAgo(device.lastUsedAt)}
          {device.lastUsedBy && (
            <span className="block text-xs text-text-gray">by {device.lastUsedBy.fullName}</span>
          )}
        </>
      ) : (
        <span className="text-text-gray">Not recorded yet</span>
      )}
    </td>
    <td className="py-3 text-center whitespace-nowrap">
      {canManage ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(device)}
            className="text-sm text-brand-blue hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onRevoke(device)}
            className="text-sm text-text-gray hover:text-error hover:underline disabled:opacity-60"
          >
            {busy ? 'Revoking…' : 'Revoke'}
          </button>
        </div>
      ) : (
        <span className="text-xs text-text-gray">View only</span>
      )}
    </td>
  </tr>
);

export default DeviceRow;
