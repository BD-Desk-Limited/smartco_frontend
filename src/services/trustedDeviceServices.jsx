'use client';

// Company trusted devices (Device Authorization screen).
const API = process.env.NEXT_PUBLIC_API_URL;

const request = async (path, { method = 'GET', body, deviceToken } = {}) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    };
    // Lets the server mark this browser as "This device" (it never sends tokens back)
    if (deviceToken) headers['X-Device-Id'] = deviceToken;

    const response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) return { data: payload };
    return { error: payload?.message || 'Something went wrong, please try again' };
  } catch (error) {
    console.error('Trusted device request failed:', error);
    return { error: 'Network error, please check your connection and try again' };
  }
};

// -> { data: devices[], filters: { branches, addedBy }, canManage }
export const getTrustedDevicesService = (deviceToken) =>
  request('/auth/trusted-devices', { deviceToken });

// body: { deviceName?, deviceBranches? } ('-1' in deviceBranches = all branches)
export const updateTrustedDeviceService = (entryId, body) =>
  request(`/auth/trusted-devices/${entryId}`, { method: 'PATCH', body });

export const revokeTrustedDeviceService = (entryId) =>
  request(`/auth/trusted-devices/${entryId}`, { method: 'DELETE' });
