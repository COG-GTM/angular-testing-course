import { createTheme } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';

// Mirrors ../src/styles.scss: teal primary, red accent (Angular Material M2 theme)
export const theme = createTheme({
  palette: {
    primary: { main: teal[500] },
    secondary: { main: red.A200, light: red.A100, dark: red.A400 },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
});
