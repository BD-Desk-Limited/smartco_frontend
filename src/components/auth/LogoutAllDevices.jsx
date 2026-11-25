import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { logOutAllDevicesService } from '@/services/authServices';

const primaryButton =
  'bg-brand-blue hover:bg-blue-shadow5 text-white w-full rounded-md h-10 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70';
const secondaryButton =
  'border border-brand-blue text-brand-blue hover:bg-blue-shadow5 hover:text-text-white w-full rounded-md h-10 flex items-center justify-center';

// Opened from "Log out from all devices" in the login notification email
// (link: /pages/auth/logout-all-devices?token=...).
// Waits for a click instead of acting on page load, because email security scanners
// open links automatically and would otherwise log the user out without them asking.
const LogoutAllDevices = ({ token }) => {
  const [status, setStatus] = useState(token ? 'confirm' : 'error'); // confirm | done | error
  const [message, setMessage] = useState(
    token ? '' : 'This link is incomplete. Please open it again from the email.'
  );
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const response = await logOutAllDevicesService(token);
    setLoading(false);

    if (response.error && !response.alreadyDone) {
      setMessage(response.error);
      setStatus('error');
      return;
    }
    // This browser's own login (if any) has just been ended too.
    sessionStorage.removeItem('token');
    setAlreadyDone(Boolean(response.alreadyDone));
    setMessage(response.data?.message || response.error);
    setStatus('done');
  };

  if (status === 'confirm') {
    return (
      <div className="w-full flex flex-col items-center gap-6 text-center">
        <Image src="/assets/Shield.png" width={110} height={110} alt="" />
        <h1 className="text-2xl text-brand-blue font-semibold">
          Log out of all devices?
        </h1>
        <div className="text-sm text-text-gray flex flex-col gap-2">
          <p>
            You got this link because someone logged in to your SmartCo account.
            If it wasn&apos;t you, log out everywhere now.
          </p>
          <p>
            Every device signed in to your account will be logged out, including
            this one, and you&apos;ll need your password (and verification code,
            if MFA is on) to log in again.
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className={primaryButton}
        >
          {loading ? (
            <>
              <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full" />
              <span>Logging out...</span>
            </>
          ) : (
            'Log out of all devices'
          )}
        </button>
        <Link
          href="/pages/auth/login"
          className="text-sm text-brand-blue hover:font-semibold"
        >
          It was me, take me to sign in
        </Link>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="w-full flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image src="/assets/verified.png" alt="" width={120} height={120} />
        </motion.div>
        <h1 className="text-2xl text-brand-blue font-semibold">
          {alreadyDone ? 'Already logged out' : 'Logged out of all devices'}
        </h1>
        <p className="text-sm text-text-gray">{message}</p>

        {/* Logging out doesn't stop someone who knows the password from logging in again */}
        <div className="w-full text-left text-sm text-error rounded-md p-4 flex flex-col gap-2">
          <p className="font-semibold ">If that login wasn&apos;t you:</p>
          <ol className="list-decimal pl-5 flex flex-col gap-1">
            <li>
              Reset your password now, because whoever logged in may know it.
            </li>
            <li>
              After signing in, turn on Multifactor Authentication in My Profile
              → Security.
            </li>
            <li>
              Check My Profile → Security → My sessions for devices you
              don&apos;t recognise.
            </li>
          </ol>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Link href="/pages/auth/forgot-password" className={primaryButton}>
            Reset my password
          </Link>
          <Link href="/pages/auth/login" className={secondaryButton}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl text-error font-semibold">
        This link can&apos;t be used
      </h1>
      <p className="text-sm text-text-gray">{message}</p>
      <p className="text-sm text-text-gray">
        If you think someone else is using your account, reset your password.
        That also logs you out of every device.
      </p>
      <div className="w-full flex flex-col gap-3">
        <Link href="/pages/auth/forgot-password" className={primaryButton}>
          Reset my password
        </Link>
        <Link href="/pages/auth/login" className={secondaryButton}>
          Go to sign in
        </Link>
      </div>
    </div>
  );
};

export default LogoutAllDevices;
