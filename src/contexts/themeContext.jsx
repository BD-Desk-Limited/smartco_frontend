'use client';
import React, { createContext, useState } from 'react';
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const THEME_MODE_KEY = 'theme-mode';
  const darkThemeStyle = `bg-[#242424] text-text-white`;
  const lightThemeStyle = `bg-white text-text-black`;

  const [mode, SetMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_MODE_KEY) || 'light';
    }
    return 'light';
  });

  const setMode = (themeMode) => {
    SetMode(themeMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_MODE_KEY, themeMode);
    }
  };

  const style = mode === 'light' ? lightThemeStyle : darkThemeStyle;

  const value = {
    mode,
    setMode,
    lightThemeStyle,
    darkThemeStyle,
    style,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
