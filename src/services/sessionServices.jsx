'use client';
import { deviceHeaders } from '@/utilities/deviceInfo';

// Signed-in devices (sessions) of the logged in user.
const API = process.env.NEXT_PUBLIC_API_URL;

const getToken = () =>
  typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

const request = async (path, { method = 'GET' } = {}) => {
  try {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
        ...deviceHeaders(),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload };
    return {
      error: payload?.message || 'Something went wrong, please try again',
      sessionEnded: Boolean(payload?.sessionEnded),
    };
  } catch (error) {
    console.error('Session request failed:', error);
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

export const getMySessionsService = () => request('/auth/sessions');

export const revokeSessionService = (sessionId) =>
  request(`/auth/sessions/${sessionId}`, { method: 'DELETE' });

export const revokeOtherSessionsService = () =>
  request('/auth/sessions/revoke-others', { method: 'POST' });

// Ends this device's session on the server. Errors are ignored: logging out locally still works.
export const logoutService = () => request('/auth/logout', { method: 'POST' });
