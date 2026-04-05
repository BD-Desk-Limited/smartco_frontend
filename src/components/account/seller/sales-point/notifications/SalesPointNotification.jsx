import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';

const SalesPointNotification = ({
  message,
  title,
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  onClose,
  autoCloseDuration = 3000, // milliseconds, null to disable auto-close
  position = 'top-right', // 'top-right' | 'top-center' | 'bottom-right'
}) => {
  useEffect(() => {
    if (!autoCloseDuration) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-success',
      borderColor: 'border-success',
      icon: FaCheckCircle,
      accentColor: 'bg-brand-green',
    },
    error: {
      bgColor: 'bg-error',
      borderColor: 'border-error',
      icon: FaExclamationCircle,
      accentColor: 'bg-error',
    },
    warning: {
      bgColor: 'bg-warning',
      borderColor: 'border-warning',
      icon: FaExclamationCircle,
      accentColor: 'bg-warning',
    },
    info: {
      bgColor: 'bg-brand-blue',
      borderColor: 'border-brand-blue',
      icon: FaInfoCircle,
      accentColor: 'bg-brand-blue',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${positionClasses[position]} z-[999px] max-w-sm border-2 border-gray-border rounded-lg shadow-lg `}
      >
        <div
          className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-lg shadow-lg p-4 flex items-start gap-3`}
        >
          {/* Icon */}
          <Icon className="flex-shrink-0 text-text-white text-xl mt-0.5" />

          {/* Content */}
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-text-white text-sm">{title}</h4>
            )}
            {message && (
              <p className="text-text-white text-sm opacity-90">{message}</p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-text-gray hover:text-text-white transition-colors duration-200 p-1"
            aria-label="Close notification"
          >
            <FaTimes className="text-text-white text-sm" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SalesPointNotification;
