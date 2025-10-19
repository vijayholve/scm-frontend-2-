import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const LMSThemeContext = createContext();

export const useLMSTheme = () => {
  const context = useContext(LMSThemeContext);
  if (!context) {
    throw new Error('useLMSTheme must be used within LMSThemeProvider');
  }
  return context;
};

export const LMSThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('lms-theme');
    return savedTheme === 'dark';
  });

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('lms-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Create theme based on current mode
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0'
      },
      secondary: {
        main: '#dc004e'
      },
      background: {
        default: isDarkMode ? '#000000' : '#ffffff',
        paper: isDarkMode ? '#121212' : '#ffffff',
        alternate: isDarkMode ? '#1a1a1a' : '#f8fafc'
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
        secondary: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
      },
      divider: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000'
          }
        }
      }
    }
  });

  const contextValue = {
    isDarkMode,
    toggleTheme,
    theme
  };

  return (
    <LMSThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LMSThemeContext.Provider>
  );
};
