'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';
import accountTheme from '../lib/accountTheme';

const AccountThemeContext = createContext(null);

function applyTheme(type) {
  const t = accountTheme[type];
  if (!t) return;

  const metaTag = document.querySelector('meta[name="theme-color"]');
  if (metaTag) metaTag.setAttribute('content', t.theme);

  const root = document.documentElement;
  root.style.setProperty('--color-theme', t.theme);
  root.style.setProperty('--color-background', t.background);
  root.style.setProperty('--color-surface', t.surface);
  root.setAttribute('data-account', type);
}

function AccountThemeProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    const userRole = user?.role;
    if (userRole && accountTheme[userRole]) {
      applyTheme(userRole);
    }
  }, [user]);

  return (
    <AccountThemeContext.Provider value={{}}>
      {children}
    </AccountThemeContext.Provider>
  );
}

function useAccountTheme() {
  const ctx = useContext(AccountThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export { AccountThemeProvider, useAccountTheme };
