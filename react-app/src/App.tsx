import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Home from './components/Home';
import About from './components/About';
import Course from './components/Course';

export default function App() {
  return (
    <>
      <AppBar position="static" color="primary" elevation={6}>
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">
            <span>COURSES</span>
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            <span>ABOUT</span>
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses/:id" element={<Course />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
