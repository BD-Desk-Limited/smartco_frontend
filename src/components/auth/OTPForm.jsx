'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OTPInput from './OTPInput';
import MfaMethodSwitcher, { MFA_METHOD_LABELS } from './MfaMethodSwitcher';
import { sendMfaCodeService, verifyMfaService } from '@/services/mfaServices';
import {
  clearMfaChallenge,
  loadMfaChallenge,
  saveMfaChallenge,
} from '@/utilities/mfaChallengeStorage';
import { saveRememberToken } from '@/utilities/deviceInfo';
import { useAuth } from '@/contexts/authContext';
import Spinner from '../account/common/Spinner';

const RESEND_COOLDOWN = 30; // seconds before "Resend code" is allowed again
const emptyCode = () => new Array(6).fill('');

const secondsUntil = (date) =>
  date ? Math.max(0, Math.round((new Date(date) - Date.now()) / 1000)) : 0;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const OTPForm = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState(emptyCode());
  const [answer, setAnswer] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [rememberThisDevice, setRememberThisDevice] = useState(false);

  useEffect(() => {
    const stored = loadMfaChallenge();
    if (!stored) {
      router.push('/pages/auth/login');
      return;
    }
    setChallenge(stored);
    setExpiresIn(secondsUntil(stored.codeExpiresAt));
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((t) => (t > 0 ? t - 1 : 0));
      setCooldown((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isQuestion = challenge?.method === 'security_question';
  const canSubmit = isQuestion ? answer.trim().length > 0 : !otp.includes('');

  const backToLogin = () => {
    clearMfaChallenge();
    window.location.href = '/pages/auth/login';
  };

  const handleFailure = (response) => {
    setError(response.error);
    if (response.restart) setTimeout(backToLogin, 2500);
  };

  // Resend on the same method, or switch to another one.
  const handleSend = async (method) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await sendMfaCodeService(challenge.challengeId, method);
      if (response.error) return handleFailure(response);

      const next = { ...challenge, ...response.data };
      saveMfaChallenge(next, challenge.purpose);
      setChallenge(next);
      setOtp(emptyCode());
      setAnswer('');
      setExpiresIn(secondsUntil(response.data.codeExpiresAt));
      setCooldown(RESEND_COOLDOWN);
      setMessage(response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const redirectAfterLogin = (data) => {
    // Untrusted device: admins register it, others are told it is not authorized.
    if (data.trustedDevice !== 'true') {
      router.push('/pages/auth/login-attempt-notification');
    } else if (data.user?.role === 'admin') {
      router.push('/pages/account/admin');
    } else if (data.user?.role === 'manager') {
      router.push('/pages/account/manager');
    } else {
      setSuccess(false);
      setError('unauthorized user role, please contact admin');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await verifyMfaService(challenge.challengeId, {
        ...(isQuestion ? { answer } : { code: otp.join('') }),
        rememberDevice: rememberThisDevice,
      });
      if (response.error) {
        setOtp(emptyCode());
        return handleFailure(response);
      }

      clearMfaChallenge();
      saveRememberToken(
        response.data.rememberToken,
        response.data.rememberedUntil
      );
      sessionStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setMessage('Verified successfully! logging in...');
      setSuccess(true);
      redirectAfterLogin(response.data);
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return <Spinner />;

  return (
    <div className="relative overflow-hidden flex items-center justify-center h-full w-full z-20">
      {!success ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center h-full w-full z-20">
          <form
            onSubmit={handleVerify}
            className="bg-brand-blue min-h-[50%] w-[calc(100%-2rem)] max-w-md md:w-[50%] lg:w-[30%] md:max-w-none rounded-lg flex flex-col"
          >
            <h1 className="py-3 text-text-white text-center">
              Two step verification · {MFA_METHOD_LABELS[challenge.method]}
            </h1>
            <div className="flex-1 bg-white flex flex-col items-center justify-between gap-4 p-4">
              {isQuestion ? (
                <label className="flex flex-col gap-2 w-full text-sm text-center">
                  <strong>{challenge.question}</strong>
                  <input
                    type="text"
                    value={answer}
                    autoFocus
                    autoComplete="off"
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="border border-brand-blue rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <span className="text-xs text-text-gray">
                    Answers are not case sensitive.
                  </span>
                </label>
              ) : (
                <>
                  <span className="text-sm text-center">
                    Enter the 6-digit code sent to
                    <strong> {challenge.destination} </strong>
                  </span>
                  <span className="flex flex-col items-center gap-1">
                    <OTPInput otp={otp} setOtp={setOtp} />
                    <span className="text-sm">
                      {expiresIn > 0 ? (
                        <>
                          Code expires in{' '}
                          <strong>{formatTime(expiresIn)}</strong>
                        </>
                      ) : (
                        <span className="text-error">
                          Code expired, request a new one
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-sm">
                    Code not received?{' '}
                    <button
                      type="button"
                      onClick={() => handleSend(challenge.method)}
                      disabled={loading || cooldown > 0}
                      className={`${
                        loading || cooldown > 0
                          ? 'cursor-not-allowed text-text-gray'
                          : 'cursor-pointer hover:font-semibold text-brand-green'
                      }`}
                    >
                      Resend code{cooldown > 0 ? ` (${cooldown}s)` : ''}
                    </button>
                  </span>
                </>
              )}

              <MfaMethodSwitcher
                methods={challenge.methods}
                current={challenge.method}
                onSelect={handleSend}
                disabled={loading}
              />

              {challenge.purpose === 'login' && (
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberThisDevice}
                    onChange={(e) => setRememberThisDevice(e.target.checked)}
                    className="h-4 w-4 accent-brand-blue"
                  />
                  Remember this device for 24 hours
                  <span className="text-xs text-text-gray">
                    (not on shared computers)
                  </span>
                </label>
              )}

              <div className="w-full text-center text-sm">
                {error && (
                  <span className="text-error w-full items-center flex justify-center gap-2">
                    <Image
                      src="/assets/error.png"
                      alt=""
                      width={20}
                      height={20}
                    />
                    <span>{error}</span>
                  </span>
                )}
                {message && <span className="text-success">{message}</span>}
              </div>

              <div className="flex flex-wrap items-center justify-center w-full gap-4 sm:gap-10">
                <button
                  type="button"
                  onClick={backToLogin}
                  className="rounded-lg border border-blue-shadow10 hover:bg-blue-shadow9 px-5 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className={`${
                    loading || !canSubmit
                      ? 'cursor-not-allowed opacity-70'
                      : 'cursor-pointer hover:bg-blue-shadow4'
                  } rounded-lg px-5 py-2 bg-brand-blue text-text-white`}
                >
                  {loading ? 'Please wait...' : 'Verify'}
                </button>
              </div>
            </div>
          </form>
          {challenge.purpose === 'registration' && (
            <div className="flex justify-center items-center gap-2 pt-5">
              <span className="h-2 w-2 bg-brand-blue rounded-[100%]"></span>
              <span className="h-0.5 w-10 bg-brand-blue"></span>
              <span className="h-2 w-2 bg-brand-blue rounded-[100%]"></span>
              <span className="h-0.5 w-10 bg-brand-gray"></span>
              <span className="h-2 w-2 bg-brand-gray rounded-[100%]"></span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative overflow-hidden flex items-center justify-center h-full z-20 gap-1 flex-col">
          <motion.h1
            className="text-5xl font-bold flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image src="/assets/verified.png" alt="" width={150} height={150} />
          </motion.h1>
          <div className="text-center text-text-gray">{message}</div>
          <div className="mt-4">
            <Spinner />
            <p className="text-sm text-gray-600 mt-2">Redirecting ...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-[40vh] left-[10vw] z-0">
        <Image
          src="/assets/brand_mark1.png"
          alt="Logo"
          width={250}
          height={233}
          style={{ height: 'auto' }}
        />
      </div>
      <div className="absolute bottom-[10vh] right-[-20vw] z-0">
        <Image
          src="/assets/brand_mark2.png"
          alt="Logo"
          width={1057}
          height={942}
          style={{ width: 650, height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default OTPForm;
