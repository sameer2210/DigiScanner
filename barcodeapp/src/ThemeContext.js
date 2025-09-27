// barcode/barcodeapp/src/ThemeContext.js
import { createContext, useMemo, useState } from 'react';

export const LightTheme = {
  colors: {
    background: '#F5F5F5',
    text: '#1A1A1A',
    primary: '#0288D1',
    accent: '#FF5722',
    surface: '#FFFFFF',
    error: '#D32F2F',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
  },
};

export const DarkModeTheme = {
  colors: {
    background: '#343434ff',
    text: '#F5F5F5',
    primary: '#70dbffff',
    accent: '#ff9d80ff',
    surface: '#3f3f3fff',
    error: '#EF5350',
    cardShadow: 'rgba(255, 255, 255, 0.21)',
  },
};

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: LightTheme,
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const theme = useMemo(() => (isDarkMode ? DarkModeTheme : LightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
