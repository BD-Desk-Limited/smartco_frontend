import React from 'react';
import { FaEnvelope, FaQuestionCircle, FaSms } from 'react-icons/fa';

const describe = (method, settings) => {
  if (method === 'email') {
    return { title: 'Email code', detail: `Code sent to ${settings.maskedEmail}` };
  }
  if (method === 'sms') {
    return {
      title: 'SMS code',
      detail: !settings.maskedPhone
        ? 'Add a phone number in Personal Information to use SMS'
        : settings.availableMethods.includes('sms')
          ? `Code sent to ${settings.maskedPhone}`
          : 'SMS verification is not available yet',
    };
  }
  return {
    title: 'Security question',
    detail: settings.securityQuestions.length
      ? `Answer one of your ${settings.securityQuestions.length} questions`
      : 'Set up security questions below to use this method',
  };
};

const ICONS = { email: FaEnvelope, sms: FaSms, security_question: FaQuestionCircle };

// Radio-card list for choosing the preferred second factor.
const MfaMethodOptions = ({ settings, disabled, onSelect }) => (
  <div role="radiogroup" className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {['email', 'sms', 'security_question'].map((method) => {
      const available = settings.availableMethods.includes(method);
      const selected = settings.preferredMethod === method;
      const { title, detail } = describe(method, settings);
      const Icon = ICONS[method];
      const blocked = disabled || !available;

      return (
        <button
          key={method}
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={blocked}
          onClick={() => !selected && onSelect(method)}
          className={`flex flex-col items-start gap-1 text-left rounded-lg border p-3 transition-colors ${
            selected
              ? 'border-brand-green bg-green-50 ring-1 ring-brand-green'
              : 'border-gray-border hover:border-brand-blue'
          } ${blocked ? 'opacity-60 cursor-not-allowed hover:border-gray-border' : 'cursor-pointer'}`}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-text-black">
            <Icon className={selected ? 'text-brand-green' : 'text-brand-blue'} />
            {title}
            {selected && (
              <span className="ml-auto text-[10px] uppercase tracking-wide text-brand-green">
                Preferred
              </span>
            )}
          </span>
          <span className="text-xs text-text-gray">{detail}</span>
        </button>
      );
    })}
  </div>
);

export default MfaMethodOptions;
