import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

// Same rules as the backend (utilities/passwords.js). Used by change and forgot-password reset.
export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character (e.g. # @ ! .)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export const passwordMeetsRules = (password) =>
  password.length <= 128 && PASSWORD_RULES.every((rule) => rule.test(password));

const PasswordRules = ({ password, confirmPassword }) => {
  const items = [
    ...PASSWORD_RULES.map((rule) => ({ label: rule.label, ok: rule.test(password) })),
    { label: 'Both passwords match', ok: Boolean(password) && password === confirmPassword },
  ];

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
      {items.map((item) => (
        <li
          key={item.label}
          className={`flex items-center gap-2 text-xs ${item.ok ? 'text-brand-green' : 'text-text-gray'}`}
        >
          {item.ok ? <FaCheckCircle /> : <FaRegCircle />}
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordRules;
