'use client';
import { getDeviceInfo } from '@/utilities/deviceInfo';

// Multi-factor authentication: second login step + the user's MFA settings.
const API = process.env.NEXT_PUBLIC_API_URL;

const getToken = () =>
  typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

// Returns { data } on success or { error, restart } on failure (restart => log in again).
const request = async (path, { method = 'GET', body, auth = false } = {}) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) headers.Authorization = `Bearer ${getToken()}`;

    const response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));

    if (response.ok) return { data: payload };
    return {
      error: payload?.message || 'Something went wrong, please try again',
      restart: Boolean(payload?.restart),
    };
  } catch (error) {
    console.error('MFA request failed:', error);
    return { error: 'Network error, please check your connection and try again' };
  }
};

// ---- second step of login / registration (uses the challengeId, not a session token)
export const sendMfaCodeService = (challengeId, method) =>
  request('/auth/mfa/send', { method: 'POST', body: { challengeId, method } });

// rememberDevice: skip MFA on this browser for 24 hours (server returns rememberToken)
export const verifyMfaService = (challengeId, { code, answer, rememberDevice = false }) =>
  request('/auth/mfa/verify', {
    method: 'POST',
    body: { challengeId, code, answer, rememberDevice, deviceInfo: getDeviceInfo() },
  });

// ---- settings for the logged in user
export const getMfaSettingsService = () =>
  request('/auth/mfa/settings', { auth: true });

export const updateMfaSettingsService = (body) =>
  request('/auth/mfa/settings', { method: 'PUT', body, auth: true });

export const saveSecurityQuestionsService = (questions, password) =>
  request('/auth/mfa/security-questions', {
    method: 'PUT',
    body: { questions, password },
    auth: true,
  });

export const removeSecurityQuestionsService = (password) =>
  request('/auth/mfa/security-questions', {
    method: 'DELETE',
    body: { password },
    auth: true,
  });
