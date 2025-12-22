'use client';
import React, { useState, useEffect } from 'react';
import { useInternetStatus } from '@/contexts/internetStatusContext';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineNotifier = () => {
  const { internetStatus } = useInternetStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('offline'); // 'offline' or 'online'
  const [justWentOnline, setJustWentOnline] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (internetStatus === 'offline') {
      setNotificationType('offline');
      setShowNotification(true);
      setJustWentOnline(false);
    } else if (internetStatus === 'online') {
      // If we just came back online, show online notification briefly
      if (showNotification) {
        setNotificationType('online');
        setJustWentOnline(true);
        setCollapsed(false); // Always expand when coming back online
        // Hide online notification after 3 seconds
        const timer = setTimeout(() => {
          setShowNotification(false);
          setJustWentOnline(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [internetStatus, showNotification]);

  // If collapsed, show a floating round icon at top-left
  // Draggable collapsed icon state
  const [iconPosition, setIconPosition] = useState({ x: 16, y: 16 }); // px from top-left
  const iconRef = React.useRef(null);
  const dragging = React.useRef(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });

  // Mouse/touch event handlers for drag
  const startDrag = (e) => {
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.current = {
      x: clientX - iconPosition.x,
      y: clientY - iconPosition.y,
    };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const onDrag = (e) => {
    if (!dragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = clientX - dragOffset.current.x;
    let y = clientY - dragOffset.current.y;
    x = Math.max(0, Math.min(vw - 56, x)); // 56px = icon size
    y = Math.max(0, Math.min(vh - 56, y));
    setIconPosition({ x, y });
  };

  const stopDrag = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
  };

  React.useEffect(() => {
    // Reset position if uncollapsed
    if (!collapsed) setIconPosition({ x: 16, y: 16 });
  }, [collapsed]);

  if (collapsed && notificationType === 'offline') {
    return (
      <button
        ref={iconRef}
        className="fixed z-50 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-move"
        onClick={() => setCollapsed(false)}
        aria-label="Expand offline notification"
        style={{
          left: iconPosition.x,
          top: iconPosition.y,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          touchAction: 'none',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      </button>
    );
  }

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-lg ${
            notificationType === 'offline'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon */}
              {notificationType === 'offline' ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}

              {/* Message */}
              <div>
                <p className="font-semibold">
                  {notificationType === 'offline'
                    ? 'You are offline'
                    : 'Back online'}
                </p>
                <p className="text-sm opacity-90">
                  {notificationType === 'offline'
                    ? 'Your changes will be saved locally and synced when reconnected'
                    : 'Connection restored. Syncing data...'}
                </p>
              </div>
            </div>

            {/* Collapse button for offline notification */}
            {notificationType === 'offline' && (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors ml-2"
                aria-label="Collapse offline notification"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Close button (only for online notification) */}
            {justWentOnline && (
              <button
                onClick={() => {
                  setShowNotification(false);
                  setJustWentOnline(false);
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors ml-2"
                aria-label="Close notification"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotifier;
