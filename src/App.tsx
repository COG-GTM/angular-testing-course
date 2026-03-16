import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import AboutPage from './pages/AboutPage';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" className="mat-elevation-z6">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            COURSES
          </Button>
          <Button color="inherit" component={Link} to="/about">
            ABOUT
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
