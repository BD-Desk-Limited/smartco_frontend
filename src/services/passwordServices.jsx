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
    return { error: 'Network error, please check your connection and try again' };
  }
};

// -> { challengeId, method, methods, destination, question, codeExpiresAt, message }
export const startPasswordChangeService = (currentPassword) =>
  post('/auth/password/change/start', { currentPassword });

export const completePasswordChangeService = ({
  challengeId,
  code,
  answer,
  newPassword,
  confirmPassword,
}) =>
  post('/auth/password/change', { challengeId, code, answer, newPassword, confirmPassword });
