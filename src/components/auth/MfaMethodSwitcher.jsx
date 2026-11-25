import React from 'react';
import { FaEnvelope, FaQuestionCircle, FaSms } from 'react-icons/fa';

export const MFA_METHOD_LABELS = {
  email: 'Email code',
  sms: 'SMS code',
  security_question: 'Security question',
};

const ICONS = {
  email: FaEnvelope,
  sms: FaSms,
  security_question: FaQuestionCircle,
};

// "Try another way" list shown under the verification input.
const MfaMethodSwitcher = ({ methods = [], current, onSelect, disabled }) => {
  const others = methods.filter((method) => method !== current);
  if (others.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <span className="text-xs text-text-gray">Try another way</span>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        {others.map((method) => {
          const Icon = ICONS[method];
          return (
            <button
              key={method}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(method)}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-brand-blue text-brand-blue ${
                disabled
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:bg-brand-blue hover:text-text-white'
              }`}
            >
              {Icon && <Icon />}
              {MFA_METHOD_LABELS[method] || method}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MfaMethodSwitcher;
