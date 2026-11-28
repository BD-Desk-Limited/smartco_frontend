import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/account/common/Button';
import ErrorInterface from '@/components/account/common/errorInterface';

// Confirmation step for sensitive MFA changes. Calls onConfirm(password); the parent
// shows server errors through `error`.
const PasswordConfirmModal = ({
  title,
  message,
  confirmText = 'Confirm',
  danger = false,
  loading,
  error,
  onConfirm,
  onClose,
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) onConfirm(password);
  };

  return (
    <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-md rounded-md shadow-md flex flex-col overflow-hidden"
      >
        <h2 className="bg-brand-blue text-text-white text-center py-3">
          {title}
        </h2>
        <div className="flex flex-col gap-4 p-5">
          <p className={`text-sm ${danger ? 'text-error' : 'text-text-gray'}`}>
            {message}
          </p>
          <label className="text-sm font-semibold text-text-gray">
            Enter your password to confirm
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm focus:ring-2 focus:ring-brand-blue"
            />
          </label>
          {error && <ErrorInterface error={error} />}
          <div className="flex flex-row justify-center gap-5">
            <Button
              type="submit"
              text={confirmText}
              loading={loading}
              loadingText="Please wait..."
              buttonStyle={`px-5 ${danger ? 'bg-error hover:bg-error-hover' : ''}`}
            />
            <Button
              onClick={onClose}
              text="Cancel"
              buttonStyle="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 px-5"
            />
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default PasswordConfirmModal;
