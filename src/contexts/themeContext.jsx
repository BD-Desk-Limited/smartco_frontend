'use client';
import React, { createContext, useState, useEffect } from 'react';
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const THEME_MODE_KEY = 'theme-mode';
  const darkThemeStyle = `bg-[#242424] text-text-white`;
  const lightThemeStyle = `bg-white text-text-black`;

  const [mode, SetMode] = useState('light');
  const [style, setStyle] = useState(lightThemeStyle);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedMode = localStorage.getItem(THEME_MODE_KEY);
      if (persistedMode) {
        SetMode(persistedMode);
      }
    }
  }, []);

  useEffect(() => {
    if (mode === 'light') {
      setStyle(lightThemeStyle);
    } else {
      setStyle(darkThemeStyle);
    }
  }, [mode, lightThemeStyle, darkThemeStyle]);

  const setMode = (themeMode) => {
    SetMode(themeMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_MODE_KEY, themeMode);
    }
  };

  const value = {
    mode,
    setMode,
    lightThemeStyle,
    darkThemeStyle,
    style,
    setStyle,
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
