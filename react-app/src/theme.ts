import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#009688',
      light: '#52c7b8',
      dark: '#00675b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF5252',
      light: '#ff867f',
      dark: '#c50e29',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
  },
});

export default theme;
