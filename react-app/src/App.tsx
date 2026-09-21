import { Link, Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import './App.css';

export const App = () => {
  return (
    <>
      <AppBar position="static" color="primary" className="mat-elevation-z6">
        <Toolbar>
          <Button component={Link} to="/" color="inherit">
            <span>COURSES</span>
          </Button>
          <Button component={Link} to="/about" color="inherit">
            <span>ABOUT</span>
          </Button>
        </Toolbar>
      </AppBar>

      <Outlet />
    </>
  );
};
