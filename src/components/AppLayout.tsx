import { AppBar, Button, Toolbar } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <AppBar position="static" color="primary" elevation={6}>
        <Toolbar>
          <Button component={Link} to="/" color="inherit">
            COURSES
          </Button>
          <Button component={Link} to="/about" color="inherit">
            ABOUT
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
