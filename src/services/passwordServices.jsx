'use client';
import { deviceHeaders } from '@/utilities/deviceInfo';

// Change password while logged in: current password -> MFA -> new password.
// Resending the code / switching method uses sendMfaCodeService from mfaServices.
const API = process.env.NEXT_PUBLIC_API_URL;

const post = async (path, body) => {
  try {
    const response = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        ...deviceHeaders(),
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload };
    return {
      error: payload?.message || 'Something went wrong, please try again',
      restart: Boolean(payload?.restart),
    };
  } catch (error) {
    console.error('Password request failed:', error);
    return {
      error: 'Network error, please check your connection and try again',
    };
  }
};

// The companies this person has an account in (same email), to pick whose password to change.
// -> { companies: [{ id, name, current }] }
export const listPasswordCompaniesService = async () => {
  try {
    const response = await fetch(`${API}/auth/password/companies`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        ...deviceHeaders(),
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload };
    return { error: payload?.message || 'Could not load your companies' };
  } catch {
    return { error: 'Network error, please check your connection and try again' };
  }
};

// companyId: whose password (default: the company signed in to)
// -> { challengeId, method, methods, destination, question, codeExpiresAt, message }
export const startPasswordChangeService = (currentPassword, companyId) =>
  post('/auth/password/change/start', {
    currentPassword,
    ...(companyId ? { companyId } : {}),
  });

export const completePasswordChangeService = ({
  challengeId,
  code,
  answer,
  newPassword,
  confirmPassword,
}) =>
  post('/auth/password/change', {
    challengeId,
    code,
    answer,
    newPassword,
    confirmPassword,
  });
