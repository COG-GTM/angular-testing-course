import { createTheme } from '@mui/material/styles';
import { red, teal } from '@mui/material/colors';

// Matches src/styles.scss: M2 light theme, primary teal 500, accent red A200, Roboto.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: teal[500], contrastText: '#fff' },
    secondary: { main: red.A200, light: red.A100, dark: red.A400, contrastText: '#fff' },
    background: { default: '#fff', paper: '#fff' },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
});
