'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', newMode);
    }
    applyTheme(newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const applyTheme = (themeMode: ThemeMode) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(themeMode);
      root.style.colorScheme = themeMode;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeMode') as ThemeMode | null;
      if (saved && ['dark', 'light'].includes(saved)) {
        setModeState(saved);
        applyTheme(saved);
      } else {
        applyTheme('dark');
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
