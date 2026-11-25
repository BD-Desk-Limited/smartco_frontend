import React from 'react';
import OTPInput from '@/components/auth/OTPInput';
import MfaMethodSwitcher, { MFA_METHOD_LABELS } from '@/components/auth/MfaMethodSwitcher';

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Second-factor input for the password change: 6-digit code or security question.
const IdentityCheck = ({
  challenge,
  code,
  setCode,
  answer,
  setAnswer,
  expiresIn,
  cooldown,
  loading,
  onSend,
}) => {
  const isQuestion = challenge.method === 'security_question';

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <h3 className="text-sm font-semibold text-text-black">
        Verify it&apos;s you · {MFA_METHOD_LABELS[challenge.method]}
      </h3>

      {isQuestion ? (
        <label className="flex flex-col gap-2 w-full text-sm text-center">
          <strong className="text-text-black">{challenge.question}</strong>
          <input
            type="text"
            value={answer}
            autoComplete="off"
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="border border-brand-blue rounded-md px-4 h-10 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <span className="text-xs text-text-gray">Answers are not case sensitive.</span>
        </label>
      ) : (
        <>
          <span className="text-sm text-center text-text-gray">
            Enter the 6-digit code sent to <strong>{challenge.destination}</strong>
          </span>
          <OTPInput otp={code} setOtp={setCode} />
          <span className="text-xs text-text-gray">
            {expiresIn > 0 ? (
              <>
                Code expires in <strong>{formatTime(expiresIn)}</strong>
              </>
            ) : (
              <span className="text-error">Code expired, request a new one</span>
            )}
            {' · '}
            <button
              type="button"
              onClick={() => onSend(challenge.method)}
              disabled={loading || cooldown > 0}
              className={
                loading || cooldown > 0
                  ? 'cursor-not-allowed'
                  : 'text-brand-green hover:font-semibold'
              }
            >
              Resend code{cooldown > 0 ? ` (${cooldown}s)` : ''}
            </button>
          </span>
        </>
      )}

      <MfaMethodSwitcher
        methods={challenge.methods}
        current={challenge.method}
        onSelect={onSend}
        disabled={loading}
      />
    </div>
  );
};

export default IdentityCheck;
