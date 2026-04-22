import { createTheme } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: teal[500],
    },
    secondary: {
      main: red.A200,
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});
