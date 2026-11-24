import React, { useEffect, useState } from 'react';
import { FaKey } from 'react-icons/fa';
import ErrorInterface from '@/components/account/errorInterface';
import SuccessModal from '@/components/account/SuccessModal';
import { useAuth } from '@/contexts/authContext';
import { sendMfaCodeService } from '@/services/mfaServices';
import {
  completePasswordChangeService,
  startPasswordChangeService,
} from '@/services/passwordServices';
import PasswordInput from './password/PasswordInput';
import PasswordRules, { passwordMeetsRules } from '@/components/auth/PasswordRules';
import IdentityCheck from './password/IdentityCheck';

const RESEND_COOLDOWN = 30;
const emptyCode = () => new Array(6).fill('');
const secondsUntil = (date) =>
  date ? Math.max(0, Math.round((new Date(date) - Date.now()) / 1000)) : 0;

// Change password: 1) current password  2) MFA + new password. Ends every session on success.
const ResetPassword = () => {
  const { logOut } = useAuth();
  const [step, setStep] = useState('current'); // 'current' | 'verify'
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState(emptyCode());
  const [answer, setAnswer] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [done, setDone] = useState(null); // success message

  useEffect(() => {
    if (step !== 'verify') return undefined;
    const timer = setInterval(() => {
      setExpiresIn((t) => (t > 0 ? t - 1 : 0));
      setCooldown((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const applyChallenge = (data) => {
    setChallenge((prev) => ({ ...prev, ...data }));
    setCode(emptyCode());
    setAnswer('');
    setExpiresIn(secondsUntil(data.codeExpiresAt));
    setCooldown(RESEND_COOLDOWN);
    setMessage(data.message || null);
  };

  const restart = (reason) => {
    setStep('current');
    setChallenge(null);
    setCurrentPassword('');
    setError(reason);
    setMessage(null);
  };

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!currentPassword) return setError('Enter your current password.');
    return run(async () => {
      const response = await startPasswordChangeService(currentPassword);
      if (response.error) return setError(response.error);
      applyChallenge(response.data);
      setStep('verify');
    });
  };

  const handleSend = (method) =>
    run(async () => {
      const response = await sendMfaCodeService(challenge.challengeId, method);
      if (response.restart) return restart(response.error);
      if (response.error) return setError(response.error);
      applyChallenge(response.data);
    });

  const isQuestion = challenge?.method === 'security_question';
  const factorReady = isQuestion ? answer.trim().length > 0 : !code.includes('');
  const canSubmit =
    factorReady && passwordMeetsRules(newPassword) && newPassword === confirmPassword;

  const handleComplete = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    run(async () => {
      const response = await completePasswordChangeService({
        challengeId: challenge.challengeId,
        ...(isQuestion ? { answer } : { code: code.join('') }),
        newPassword,
        confirmPassword,
      });
      if (response.restart) return restart(response.error);
      if (response.error) {
        setCode(emptyCode());
        return setError(response.error);
      }
      setDone(response.data.message);
    });
  };

  return (
    <div className="flex flex-col gap-5 text-text-gray max-w-2xl">
      <section className="flex flex-row gap-3 border-b border-gray-border pb-4">
        <FaKey className="text-2xl mt-1 text-brand-blue" />
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text-black">Change password</h2>
          <p className="text-sm">
            For your security we confirm it&apos;s you with your current password and a
            verification code. All your devices will be signed out afterwards.
          </p>
        </div>
      </section>

      <form
        onSubmit={step === 'current' ? handleStart : handleComplete}
        className="flex flex-col rounded-lg overflow-hidden shadow-md bg-white"
      >
        <h3 className="bg-brand-blue text-text-white text-center py-4">
          {step === 'current' ? 'Step 1 of 2 · Current password' : 'Step 2 of 2 · Verify & set new password'}
        </h3>

        <div className="flex flex-col items-center gap-5 px-6 sm:px-12 py-6">
          {step === 'current' ? (
            <PasswordInput
              id="currentPassword"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              autoFocus
            />
          ) : (
            <>
              <IdentityCheck
                challenge={challenge}
                code={code}
                setCode={setCode}
                answer={answer}
                setAnswer={setAnswer}
                expiresIn={expiresIn}
                cooldown={cooldown}
                loading={loading}
                onSend={handleSend}
              />
              <div className="w-full border-t border-gray-border" />
              <PasswordInput
                id="newPassword"
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />
              <PasswordInput
                id="confirmPassword"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                invalid={Boolean(confirmPassword) && confirmPassword !== newPassword}
              />
              <PasswordRules password={newPassword} confirmPassword={confirmPassword} />
            </>
          )}

          {error && <ErrorInterface error={error} />}
          {message && <span className="text-sm text-success text-center">{message}</span>}

          <div className="flex items-center justify-center w-full gap-6">
            {step === 'verify' && (
              <button
                type="button"
                onClick={() => restart(null)}
                className="rounded-lg border border-blue-shadow10 hover:bg-blue-shadow9 px-5 py-2"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 'verify' && !canSubmit)}
              className="rounded-lg px-5 py-2 bg-brand-blue text-text-white hover:bg-blue-shadow4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : step === 'current' ? 'Continue' : 'Change password'}
            </button>
          </div>
        </div>

        <footer className="bg-brand-blue h-10" />
      </form>

      {done && (
        <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80">
          <SuccessModal
            title="Password changed"
            message={done}
            subText="All your devices have been signed out."
            buttonText="Log in again"
            buttonStyle="text-white bg-brand-blue hover:bg-blue-shadow5 rounded-md px-4 py-2"
            onClose={logOut}
          />
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
