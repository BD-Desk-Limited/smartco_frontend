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

// Columns of the Device Authorization table (a table from md up, cards on phones).
export const deviceColumns = [
  {
    key: 'device',
    header: 'Device',
    mobile: 'title',
    cell: (device) => (
      <span className="flex flex-wrap items-center gap-2">
        <FaDesktop className="text-brand-blue shrink-0" />
        <span className="font-medium break-words">{device.deviceName}</span>
        {device.isCurrent && (
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-brand-green text-text-white whitespace-nowrap">
            This device
          </span>
        )}
      </span>
    ),
  },
  {
    key: 'branches',
    header: 'Branches',
    mobile: 'wide',
    cell: (device) => <BranchChips device={device} />,
  },
  {
    key: 'addedBy',
    header: 'Added by',
    cell: (device) => device.addedBy?.fullName || '—',
  },
  {
    key: 'added',
    header: 'Date added',
    cell: (device) => formatDate(device.createdAt),
  },
  {
    key: 'lastUsed',
    header: 'Last used',
    cell: (device) =>
      device.lastUsedAt ? (
        <span title={formatDeviceTime(device.lastUsedAt)}>
          {timeAgo(device.lastUsedAt)}
          {device.lastUsedBy && (
            <span className="block text-xs text-text-gray">
              by {device.lastUsedBy.fullName}
            </span>
          )}
        </span>
      ) : (
        <span className="text-text-gray">Not recorded yet</span>
      ),
  },
];

// Edit / Revoke for one device (the Action column / bottom of the card).
export const DeviceActions = ({ device, canManage, busy, onEdit, onRevoke }) =>
  canManage ? (
    <>
      <button
        type="button"
        onClick={() => onEdit(device)}
        className="text-sm text-brand-blue hover:underline px-1"
      >
        Edit
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onRevoke(device)}
        className="text-sm text-text-gray hover:text-error hover:underline disabled:opacity-60 px-1"
      >
        {busy ? 'Revoking…' : 'Revoke'}
      </button>
    </>
  ) : (
    <span className="text-xs text-text-gray">View only</span>
  );
