import { createContext, useContext, useState, useEffect } from 'react';

// Default theme settings
const defaultTheme = {
  mode: 'light', // 'light' or 'dark'
  direction: 'ltr', // 'ltr' or 'rtl'
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#8b5cf6', // purple-500
  borderRadius: 8, // in pixels
  responsiveFontSizes: true,
};

// Create context
const ThemeContext = createContext({
  ...defaultTheme,
  toggleTheme: () => {},
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  setBorderRadius: () => {},
  toggleDirection: () => {},
  toggleResponsiveFonts: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage, or use default
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('appTheme');
      return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    }
    return defaultTheme;
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appTheme', JSON.stringify(theme));
    
    // Update HTML attributes for theme
    document.documentElement.setAttribute('data-theme', theme.mode);
    document.documentElement.setAttribute('dir', theme.direction);
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    
    // Update meta theme color
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', 
      theme.mode === 'dark' ? '#1f2937' : '#ffffff'
    );
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  // Toggle between LTR and RTL
  const toggleDirection = () => {
    setTheme(prev => ({
      ...prev,
      direction: prev.direction === 'ltr' ? 'rtl' : 'ltr',
    }));
  };

  // Set primary color
  const setPrimaryColor = (color) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: color,
    }));
  };

  // Set secondary color
  const setSecondaryColor = (color) => {
    setTheme(prev => ({
      ...prev,
      secondaryColor: color,
    }));
  };

  // Set border radius
  const setBorderRadius = (radius) => {
    setTheme(prev => ({
      ...prev,
      borderRadius: radius,
    }));
  };

  // Toggle responsive font sizes
  const toggleResponsiveFonts = () => {
    setTheme(prev => ({
      ...prev,
      responsiveFontSizes: !prev.responsiveFontSizes,
    }));
  };

  // Context value
  const value = {
    ...theme,
    toggleTheme,
    toggleDirection,
    setPrimaryColor,
    setSecondaryColor,
    setBorderRadius,
    toggleResponsiveFonts,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
