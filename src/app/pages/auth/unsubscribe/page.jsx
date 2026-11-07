'use client';
// pages/unsubscribe.js  (public: no login, no site header)
// The link in every message is  {FRONTEND_URL}/pages/auth/unsubscribe?token=...
// Nothing changes just by opening the page (mail scanners open links); the customer presses the button.
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  fetchUnsubscribeInfoService,
  unsubscribeService,
} from '@/services/customerServices';
import ErrorInterface from '@/components/account/errorInterface';

const CHANNEL_NAME = { email: 'emails', sms: 'text messages' };

const UnsubscribePage = () => {
  const unsubscribeToken = useSearchParams()?.get('token') || '';
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const validateTokenAndFetchInfo = async () => {
      if (!unsubscribeToken) {
        setError(
          'Invalid unsubscribe link. Please check the link and try again.'
        );
        return undefined;
      }
      let cancelled = false;
      await fetchUnsubscribeInfoService(unsubscribeToken).then((res) => {
        if (cancelled) return;
        if (res.error) setError(String(res.error));
        else setInfo(res.data);
      });
      return () => {
        cancelled = true;
      };
    };

    validateTokenAndFetchInfo();
  }, [unsubscribeToken]);

  const change = async (optOut) => {
    setBusy(true);
    setError('');
    const res = await unsubscribeService(unsubscribeToken, optOut);
    setBusy(false);
    if (res.error) return setError(String(res.error));
    setInfo((prev) => ({ ...prev, optedOut: res.data.optedOut }));
  };

  const what = CHANNEL_NAME[info?.channel] || 'messages';

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-1 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center text-text-gray">
        {error && <ErrorInterface error={error} />}
        {!error && !info && <p>Loading...</p>}
        {info && !info.optedOut && (
          <>
            <h1 className="text-xl font-semibold text-text-black mb-2">
              Unsubscribe
            </h1>
            <p className="mb-4">
              Stop receiving {what} from <strong>{info.companyName}</strong>?
            </p>
            <button
              onClick={() => change(true)}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
            >
              {busy ? 'processing...' : 'Yes, unsubscribe me'}
            </button>
          </>
        )}
        {info && info.optedOut && (
          <>
            <h1 className="text-xl font-semibold text-text-black mb-2">
              You are unsubscribed!!!
            </h1>
            <p className="mb-4">
              You will no longer receive {what} from{' '}
              <strong>{info.companyName}</strong>.
            </p>
            <button
              onClick={() => change(false)}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-gray-border disabled:opacity-50 hover:bg-green-shadow5 bg-brand-green text-text-white"
            >
              {busy ? 'processing...' : 'I changed my mind, subscribe me again'}
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default UnsubscribePage;
