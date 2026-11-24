'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdWifiOff } from 'react-icons/md';

// Full-page "you're offline" state for screens that need the server (admin/manager pages).
// Standalone (no context), so it also works as the app's /offline fallback page.
const OfflineScreen = ({
  title = "You're offline",
  message = 'This page needs an internet connection. Check your internet connection.',
}) => {
  const [checking, setChecking] = useState(false);

  // Come back by itself once the connection returns.
  useEffect(() => {
    const onOnline = () => window.location.reload();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const tryAgain = () => {
    setChecking(true);
    if (navigator.onLine) window.location.reload();
    else setTimeout(() => setChecking(false), 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background-1 px-4">
      <div className="flex flex-col items-center text-center gap-4 max-w-md bg-white rounded-lg shadow-md p-8">
        <span className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-shadow5">
          <MdWifiOff className="text-4xl text-text-gray" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-semibold text-text-black">{title}</h1>
        <p className="text-sm text-text-gray">{message}</p>
        <p className="text-xs text-text-gray">
          This page will reload automatically when you&apos;re back online.
        </p>

        <button
          type="button"
          onClick={tryAgain}
          disabled={checking}
          className="h-10 px-6 rounded-md bg-brand-blue text-white shadow-md hover:bg-blue-shadow1 disabled:opacity-70"
        >
          {checking ? 'Still offline…' : 'Try again'}
        </button>

        <div className="w-full border-t border-gray-border pt-4 text-sm text-text-gray">
          Need to keep selling?{' '}
          <Link
            href="/pages/auth/login/sales-point"
            className="text-brand-blue font-semibold hover:underline"
          >
            The sales point works offline
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;
