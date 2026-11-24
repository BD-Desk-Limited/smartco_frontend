import React, { useState } from 'react';
import Image from 'next/image';

// Password field with the show/hide eye used on the auth screens.
const PasswordInput = ({ id, label, value, onChange, autoComplete, autoFocus, invalid }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-text-gray">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder="********"
          value={value}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-md px-4 pr-10 h-10 shadow-sm focus:outline-none text-base ${
            invalid ? 'border-2 border-error text-error' : 'border-brand-blue'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Image
            src={visible ? '/assets/eye-closed.png' : '/assets/eye-open.png'}
            alt=""
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
