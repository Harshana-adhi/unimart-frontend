// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2451b5',
      light: '#5b7fd6',
      dark: '#173a8a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5a3',
      light: '#4fd1cf',
      dark: '#0a7d7c',
      contrastText: '#ffffff',
    },
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#5b6472',
    },
    divider: 'rgba(17, 24, 39, 0.08)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: ['Roboto', 'system-ui', 'Segoe UI', 'sans-serif'].join(','),
    h1: { fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.5 },
    h3: { fontWeight: 700, letterSpacing: -0.25 },
    h4: { fontWeight: 700, letterSpacing: -0.25 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f5f7fb' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(36, 81, 181, 0.25)',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(36, 81, 181, 0.32)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(17, 24, 39, 0.06)',
          transition: 'transform 160ms ease, box-shadow 160ms ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
