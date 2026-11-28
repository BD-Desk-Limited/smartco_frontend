'use client';

// The bell in the header: the signed-in person's own notifications.
const API = process.env.NEXT_PUBLIC_API_URL;

const request = async (method, path, body) => {
  try {
    const response = await fetch(`${API}/notifications${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload.data };
    return { error: payload?.message || 'Could not load notifications' };
  } catch {
    return { error: 'Network error, please check your connection' };
  }
};

// -> { unreadCount, reminders: [due action-required notifications] }   (polled)
export const fetchNotificationSummary = () => request('GET', '/summary');

// -> { items, unreadCount, nextCursor }
export const fetchNotifications = ({ unreadOnly = false, before } = {}) => {
  const q = new URLSearchParams();
  if (unreadOnly) q.set('unread', '1');
  if (before) q.set('before', before);
  const qs = q.toString();
  return request('GET', qs ? `?${qs}` : '');
};

export const markNotificationRead = (id) => request('PUT', `/${id}/read`);
export const markNotificationUnread = (id) => request('PUT', `/${id}/unread`);
export const markAllNotificationsRead = () => request('PUT', '/read-all');
// "remind me later": { minutes } for a preset, or { until: Date } for a time the person picks
export const snoozeNotification = (id, { minutes, until }) =>
  request(
    'PUT',
    `/${id}/snooze`,
    until ? { until: new Date(until).toISOString() } : { minutes }
  );
