'use client';

// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

// a 'YYYY-MM-DD' date on the device's calendar
export const localYmd = (date = new Date()) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// start of the device's LOCAL day `fromYmd` to the end of `toYmd` (both 'YYYY-MM-DD', default today),
// so "today" is the shop's day, not the server's
const localDayRange = (fromYmd = localYmd(), toYmd = fromYmd) => {
  const [fy, fm, fd] = fromYmd.split('-').map(Number);
  const [ty, tm, td] = toYmd.split('-').map(Number);
  const start = new Date(fy, fm - 1, fd, 0, 0, 0, 0);
  const end = new Date(ty, tm - 1, td, 23, 59, 59, 999);
  return { from: start.toISOString(), to: end.toISOString() };
};

// Scheduled orders still open, due between two local dates (default: today). Only a manager or admin
// can ask for days other than today (the server checks).
export const getOrdersForTodayByBranchIdService = async (
  branchId,
  dates = {}
) => {
  const token = getToken();
  try {
    const query = new URLSearchParams(
      localDayRange(
        dates.from || undefined,
        dates.to || dates.from || undefined
      )
    ).toString();
    const response = await fetch(
      `${API}/orders/scheduled/${branchId}?${query}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return { data: responseData.data || [] };
    }

    const errorData = await response.json().catch(() => ({}));
    return {
      error:
        errorData?.message ||
        'error fetching scheduled orders for today for branch, please try again',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      error: 'error fetching scheduled orders for today, please try again',
    };
  }
};

// cancel / refund: managers and admins only (the server checks)
const postOrderAction = async (path, body) => {
  try {
    const response = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload.data };
    return {
      error: payload?.message || 'Could not update the order, please try again',
    };
  } catch (error) {
    console.error('Order action failed:', error);
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

// body: { reason, refund?: { amount, method } }
export const cancelScheduledOrderService = (orderId, body) =>
  postOrderAction(`/orders/${encodeURIComponent(orderId)}/cancel`, body);

// body: { amount, method, reason? }
export const refundOrderService = (orderId, body) =>
  postOrderAction(`/orders/${encodeURIComponent(orderId)}/refunds`, body);
