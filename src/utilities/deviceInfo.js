// Device details sent to the backend so the sessions screen can show each device's clock,
// plus the "remember this device" tokens that let this browser skip MFA for 24 hours.

const REMEMBER_KEY = 'mfa-remembered-devices';
const MAX_TOKENS = 10;

const pad = (n) => String(Math.abs(Math.trunc(n))).padStart(2, '0');

// Local time with UTC offset, e.g. 2026-11-23T14:05:00+01:00 (toISOString() would lose the offset).
export const localIsoTime = (date = new Date()) => {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(offset / 60)}:${pad(offset % 60)}`
  );
};

const timezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
};

// For request bodies (login, MFA verify, sales point login)
export const getDeviceInfo = () => ({ deviceTime: localIsoTime(), timezone: timezone() });

// For authenticated requests: the backend updates the session's device clock from these.
export const deviceHeaders = () => ({
  'X-Device-Time': localIsoTime(),
  'X-Device-Timezone': timezone(),
});

// ---- remembered-device tokens (localStorage: must survive closing the tab)

const readTokens = () => {
  try {
    const list = JSON.parse(localStorage.getItem(REMEMBER_KEY) || '[]');
    const now = Date.now();
    return Array.isArray(list)
      ? list.filter((t) => t?.token && new Date(t.until).getTime() > now)
      : [];
  } catch {
    return [];
  }
};

const writeTokens = (list) => {
  try {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(list.slice(-MAX_TOKENS)));
  } catch {
    // storage unavailable (private mode): the device just won't be remembered
  }
};

// Sent at login; the server checks which (if any) belongs to the user logging in.
export const getRememberTokens = () => readTokens().map((t) => t.token);

export const saveRememberToken = (token, until) => {
  if (!token) return;
  writeTokens([...readTokens().filter((t) => t.token !== token), { token, until }]);
};
