'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a online-offline tracker context
const InternetStatusContext = createContext(null);

export const InternetStatusProvider = ({ children }) => {
  const [internetStatus, setInternetStatus] = useState('online');
  const [userMode, setUserMode] = useState('online'); // 'online' or 'offline'

  useEffect(() => {
    // check if window is defined (to avoid issues during server-side rendering)
    if (typeof window === 'undefined') return;

    // Function to update online status
    const updateOnlineStatus = () => {
      setInternetStatus(navigator.onLine ? 'online' : 'offline');
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Load user mode preference from localStorage
    const savedUserMode = localStorage.getItem('userMode');
    if (savedUserMode === 'online' || savedUserMode === 'offline') {
      setUserMode(savedUserMode);
    }

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Function to toggle user mode
  const toggleUserMode = (mode) => {
    if (mode === 'online' || mode === 'offline') {
      setUserMode(mode);
      localStorage.setItem('userMode', mode);
    }
  };

  return (
    <InternetStatusContext.Provider
      value={{
        internetStatus,
        userMode,
        toggleUserMode,
      }}
    >
      {children}
    </InternetStatusContext.Provider>
  );
};

// Custom hook to use the InternetStatusContext
export const useInternetStatus = () => {
  return useContext(InternetStatusContext);
};
