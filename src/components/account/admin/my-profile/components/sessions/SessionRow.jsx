import React from 'react';
import flags from 'react-phone-number-input/flags';
import { FaGlobeAfrica, FaShieldAlt } from 'react-icons/fa';

// "Oct 4, 2024 4:16 PM WAT" in the device's own timezone (falls back to this browser's).
export const formatDeviceTime = (value, timeZone) => {
  if (!value) return '—';
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  };
  try {
    return new Date(value).toLocaleString('en-US', { ...options, ...(timeZone && { timeZone }) });
  } catch {
    return new Date(value).toLocaleString('en-US', options); // unknown timezone name
  }
};

const locationText = (location) =>
  [location?.city, location?.region, location?.country].filter(Boolean).join(', ') ||
  'Unknown location';

const CountryFlag = ({ country, title }) => {
  const Flag = country && flags[country];
  return (
    <span
      className="inline-flex w-6 h-4 shrink-0 overflow-hidden rounded-sm [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
      title={title}
    >
      {Flag ? (
        <Flag title={title} />
      ) : (
        <FaGlobeAfrica className="w-full h-full text-text-gray" aria-label={title} />
      )}
    </span>
  );
};

const deviceText = (session) =>
  `${session.browser || 'Unknown browser'} on ${session.os || 'unknown OS'}${
    session.kind === 'sales_point' ? ' (Sales point)' : ''
  }`;

// Columns of the sessions table. Extra details (location, sign-in time, clock) are in tooltips.
export const sessionColumns = [
  {
    key: 'ip',
    header: 'IP Address',
    mobile: 'title',
    cell: (session) => {
      const location = locationText(session.location);
      return (
        <span className="flex items-center gap-3">
          <CountryFlag country={session.location?.country} title={location} />
          <span className="flex flex-col">
            <span className="font-medium">{session.ipAddress || 'Unknown IP'}</span>
            <span className="text-xs text-text-gray font-normal">{location}</span>
          </span>
        </span>
      );
    },
  },
  {
    key: 'lastActive',
    header: 'Last Accessed',
    cell: (session) => {
      const clockOff = Math.abs(session.clockSkewSeconds || 0) > 120;
      return (
        <span
          title={`Signed in ${formatDeviceTime(session.signedInAt, session.deviceTimezone)}${
            session.deviceTimezone ? ` · device timezone ${session.deviceTimezone}` : ''
          }`}
        >
          {formatDeviceTime(session.lastAccessAt, session.deviceTimezone)}
          {clockOff && (
            <span className="block text-xs text-error">
              Device clock off by {Math.round(Math.abs(session.clockSkewSeconds) / 60)} min
            </span>
          )}
        </span>
      );
    },
  },
  {
    key: 'device',
    header: 'Device',
    mobile: 'wide',
    cell: (session) => (
      <>
        <span>{deviceText(session)}</span>
        {session.rememberedUntil && (
          <span
            className="flex items-center gap-1 text-xs text-brand-blue"
            title="This device skips the MFA step until then"
          >
            <FaShieldAlt /> MFA remembered until{' '}
            {formatDeviceTime(session.rememberedUntil, session.deviceTimezone)}
          </span>
        )}
      </>
    ),
  },
];

// Sign-out control for one session (the Action column / bottom of the card).
export const SessionAction = ({ session, onSignOut, busy }) =>
  session.isCurrent ? (
    <span className="text-sm font-semibold text-brand-green">This is you</span>
  ) : session.status === 'active' ? (
    <button
      type="button"
      disabled={busy}
      onClick={() => onSignOut(session)}
      className="text-sm text-text-gray hover:text-error hover:underline disabled:opacity-60 px-1"
    >
      {busy ? 'Signing out…' : 'Unauthorize device'}
    </button>
  ) : (
    <span className="text-xs text-text-gray">
      {session.status === 'expired' ? 'Expired' : 'Signed out'}
    </span>
  );
