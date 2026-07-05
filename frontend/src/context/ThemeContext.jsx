import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage for saved preference
    const savedTheme = localStorage.getItem('school-election-theme');
    if (savedTheme === 'light') {
      setIsLight(true);
    }
  }, []);

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme');
      localStorage.setItem('school-election-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('school-election-theme', 'dark');
    }
  }, [isLight]);

  const toggleTheme = () => setIsLight(!isLight);

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
