'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaRegBell, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/authContext';
import {
  fetchNotificationSummary,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnread,
  snoozeNotification,
} from '@/services/notificationServices';

const POLL_MS = 60 * 1000;
const MAX_SNOOZE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// Only managers and admins have the bell. Sales point users (sellers) are told what they need on the
// sales point itself, so they get no bell and no reminders.
export const canHaveBell = (user) =>
  ['manager', 'admin'].includes(user?.role) || Boolean(user?.superAdmin);

export const timeAgo = (date) => {
  const s = Math.max(0, (Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} d ago`;
  return new Date(date).toLocaleDateString();
};

// 9:00 tomorrow on this device
const tomorrowMorning = () => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(9, 0, 0, 0);
  return t;
};

// a Date as the value of <input type="datetime-local"> (local time)
const toLocalInput = (d) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const PRESETS = [
  { label: 'In 15 minutes', minutes: 15 },
  { label: 'In 1 hour', minutes: 60 },
  { label: 'In 3 hours', minutes: 180 },
  { label: 'Tomorrow morning', until: tomorrowMorning },
];

const snoozedLabel = (until) =>
  `Reminds you ${new Date(until).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })}`;

/*
  "Remind me later": a preset, or a date and time the person picks (up to 30 days ahead).
  onPick({ minutes } | { until: Date })
*/
export const SnoozeOptions = ({ onPick, onCancel, idSuffix = '' }) => {
  const [custom, setCustom] = React.useState('');
  const [error, setError] = React.useState(null);
  const inputId = `snooze-at${idSuffix}`;
  // the earliest and latest times that can be picked, fixed when the picker opens
  const [{ min, max }] = React.useState(() => ({
    min: toLocalInput(new Date(Date.now() + 2 * 60 * 1000)),
    max: toLocalInput(new Date(Date.now() + MAX_SNOOZE_DAYS * DAY_MS)),
  }));

  const pickCustom = () => {
    const at = new Date(custom);
    const ahead = at.getTime() - Date.now();
    if (!custom || !Number.isFinite(ahead) || ahead < 60 * 1000) {
      return setError('Pick a time later than now.');
    }
    if (ahead > MAX_SNOOZE_DAYS * DAY_MS) {
      return setError(`Pick a time within ${MAX_SNOOZE_DAYS} days.`);
    }
    return onPick({ until: at });
  };

  return (
    // clicks inside must not open the notification underneath
    <div
      className="flex flex-col gap-2 text-sm"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() =>
              onPick(p.until ? { until: p.until() } : { minutes: p.minutes })
            }
            className="px-2.5 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-gray-600" htmlFor={inputId}>
          Or pick a time
        </label>
        <input
          id={inputId}
          type="datetime-local"
          value={custom}
          min={min}
          max={max}
          onChange={(e) => {
            setCustom(e.target.value);
            setError(null);
          }}
          className="flex-1 min-w-0 rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={pickCustom}
          disabled={!custom}
          className="px-2.5 py-1 rounded-md bg-brand-green text-white disabled:opacity-50"
        >
          Set
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1 text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

/*
  The bell in the header, for managers and admins (see canHaveBell).
  - red badge: unread count
  - click: panel with the newest notifications. Opening one marks it read and goes to its page; each can
    be marked unread again.
  - reminders: a notification that needs action comes up on its own (bottom right) until it is opened or
    no longer needed. "Remind me later" snoozes it until a time the person picks; it comes back then.
*/
const NotificationBell = ({ className = '', iconClassName = 'text-lg' }) => {
  const router = useRouter();
  const { user } = useAuth();
  const allowed = canHaveBell(user);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [reminders, setReminders] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [unreadOnly, setUnreadOnly] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  // whose "remind me later" picker is open: a notification id (panel) or `card:<id>` (reminder card)
  const [snoozing, setSnoozing] = React.useState(null);
  const [snoozeError, setSnoozeError] = React.useState(null);
  const boxRef = React.useRef(null);

  const refreshSummary = React.useCallback(async () => {
    if (
      !allowed ||
      typeof window === 'undefined' ||
      !sessionStorage.getItem('token')
    )
      return;
    const { data } = await fetchNotificationSummary();
    if (data) {
      setUnreadCount(data.unreadCount);
      setReminders(data.reminders || []);
    }
  }, [allowed]);

  // poll while the tab is visible, and as soon as it comes back
  React.useEffect(() => {
    if (!allowed) return undefined;
    refreshSummary();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refreshSummary();
    }, POLL_MS);
    const onFocus = () => refreshSummary();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [allowed, refreshSummary]);

  const loadPage = React.useCallback(
    async (before) => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await fetchNotifications({
        unreadOnly,
        before,
      });
      setLoading(false);
      if (err) return setError(err);
      setItems((prev) => (before ? [...prev, ...data.items] : data.items));
      setCursor(data.nextCursor);
      setUnreadCount(data.unreadCount);
    },
    [unreadOnly]
  );

  React.useEffect(() => {
    if (open) loadPage();
  }, [open, loadPage]);

  // close on a click outside or Escape
  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!allowed) return null;

  const replaceItem = (updated) =>
    setItems((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));

  const openNotification = async (n) => {
    setOpen(false);
    setSnoozing(null);
    if (!n.read) {
      const { data } = await markNotificationRead(n._id);
      if (data) replaceItem(data);
    }
    refreshSummary();
    if (n.link) router.push(n.link);
  };

  const toggleRead = async (e, n) => {
    e.stopPropagation();
    const { data } = n.read
      ? await markNotificationUnread(n._id)
      : await markNotificationRead(n._id);
    if (data) {
      replaceItem(data);
      if (unreadOnly && data.read) {
        setItems((prev) => prev.filter((x) => x._id !== data._id));
      }
    }
    refreshSummary();
  };

  const readAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) =>
      unreadOnly ? [] : prev.map((n) => ({ ...n, read: true }))
    );
    refreshSummary();
  };

  // snooze until { minutes } from now or { until } a picked time
  const later = async (n, when) => {
    setSnoozeError(null);
    const { data, error: err } = await snoozeNotification(n._id, when);
    if (err) return setSnoozeError(err);
    setSnoozing(null);
    setReminders((prev) => prev.filter((x) => x._id !== n._id));
    replaceItem(data);
    return refreshSummary();
  };

  const toggleSnoozing = (key) => {
    setSnoozeError(null);
    setSnoozing((current) => (current === key ? null : key));
  };

  const reminder = !open ? reminders[0] : null;
  const cardKey = reminder ? `card:${reminder._id}` : null;
  const snoozable = (n) => n.actionRequired && !n.read;

  return (
    <div ref={boxRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        title="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative p-1 hover:opacity-80"
      >
        <FaRegBell className={iconClassName} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-[18px] text-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-10 z-[60] sm:w-96 max-h-[70vh] flex flex-col rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b">
            <span className="font-semibold">Notifications</span>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUnreadOnly((v) => !v)}
                className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                {unreadOnly ? 'Show all' : 'Unread only'}
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={readAll}
                  className="px-2 py-1 rounded-md text-brand-green hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <ul className="overflow-y-auto flex-1">
            {error && <li className="p-3 text-sm text-red-600">{error}</li>}
            {!error && !loading && items.length === 0 && (
              <li className="p-6 text-center text-sm text-gray-500">
                {unreadOnly ? 'Nothing unread.' : 'No notifications yet.'}
              </li>
            )}
            {items.map((n) => (
              <li key={n._id} className="border-b last:border-b-0">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openNotification(n)}
                  onKeyDown={(e) => e.key === 'Enter' && openNotification(n)}
                  className={`flex gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${n.read ? '' : 'bg-green-50'}`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-red-600'}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${n.read ? '' : 'font-semibold'} break-words`}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-xs text-gray-600 line-clamp-2 break-words">
                        {n.body}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                      <span>{timeAgo(n.createdAt)}</span>
                      {n.actionRequired && (
                        <span className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-800">
                          Action needed
                        </span>
                      )}
                      {snoozable(n) &&
                        n.snoozedUntil &&
                        new Date(n.snoozedUntil) > new Date() && (
                          <span>{snoozedLabel(n.snoozedUntil)}</span>
                        )}
                      {snoozable(n) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSnoozing(n._id);
                          }}
                          aria-expanded={snoozing === n._id}
                          className="text-amber-700 hover:underline"
                        >
                          Remind me later
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => toggleRead(e, n)}
                        className="ml-auto text-brand-green hover:underline"
                      >
                        {n.read ? 'Mark as unread' : 'Mark as read'}
                      </button>
                    </div>
                    {snoozing === n._id && (
                      <div className="mt-2">
                        <SnoozeOptions
                          idSuffix={`-${n._id}`}
                          onPick={(when) => later(n, when)}
                          onCancel={() => setSnoozing(null)}
                        />
                        {snoozeError && (
                          <p className="text-xs text-red-600 mt-1">
                            {snoozeError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {loading && (
              <li className="p-3 text-center text-sm text-gray-500">
                Loading…
              </li>
            )}
          </ul>
          {cursor && !loading && (
            <button
              type="button"
              onClick={() => loadPage(cursor)}
              className="py-2 text-sm text-brand-green border-t hover:bg-gray-50"
            >
              Show older
            </button>
          )}
        </div>
      )}

      {reminder && (
        <div
          role="alertdialog"
          aria-label="Reminder"
          className="fixed bottom-20 md:bottom-4 right-4 left-4 sm:left-auto z-[70] sm:w-96 rounded-xl border-l-4 border-amber-500 bg-white text-gray-800 shadow-2xl p-3 flex flex-col gap-2"
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-amber-700">
                Needs your action
                {reminders.length > 1 ? ` (1 of ${reminders.length})` : ''}
              </p>
              <p className="font-semibold text-sm break-words">
                {reminder.title}
              </p>
              {reminder.body && (
                <p className="text-xs text-gray-600 line-clamp-3 break-words">
                  {reminder.body}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Remind me in 1 hour"
              title="Remind me in 1 hour"
              onClick={() => later(reminder, { minutes: 60 })}
              className="p-1 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={() => {
                setReminders((prev) =>
                  prev.filter((x) => x._id !== reminder._id)
                );
                openNotification(reminder);
              }}
              className="px-3 py-1 rounded-md bg-brand-green text-white"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => toggleSnoozing(cardKey)}
              aria-expanded={snoozing === cardKey}
              className="px-3 py-1 rounded-md border border-gray-300"
            >
              Remind me later
            </button>
          </div>
          {snoozing === cardKey && (
            <SnoozeOptions
              idSuffix="-card"
              onPick={(when) => later(reminder, when)}
              onCancel={() => setSnoozing(null)}
            />
          )}
          {snoozeError && snoozing === cardKey && (
            <p className="text-xs text-red-600">{snoozeError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
