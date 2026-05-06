import { createTheme } from '@mui/material/styles';
import { teal, red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
      contrastText: '#fff',
    },
    secondary: {
      main: red['A200'],
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px',
          '@media (min-width: 600px)': {
            minHeight: '64px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 5px -1px #0003, 0 6px 10px 0 #00000024, 0 1px 18px 0 #0000001f',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: '0 3px 1px -2px #0003, 0 2px 2px 0 #00000024, 0 1px 5px 0 #0000001f',
        },
      },
    },
  },
});

export default theme;
