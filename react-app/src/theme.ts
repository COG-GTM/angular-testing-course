import { createTheme } from '@mui/material/styles';

// Mirrors the Angular Material M2 light theme defined in src/styles.scss:
//   $primary: teal-palette 500 (#009688)
//   $accent:  red-palette A200 (#ff5252)
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff5252',
      light: '#ff8a80',
      dark: '#ff1744',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
  components: {
    // Angular Material (M2) does not uppercase button/tab labels; render the
    // literal source text so casing matches the original templates.
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
  },
});
