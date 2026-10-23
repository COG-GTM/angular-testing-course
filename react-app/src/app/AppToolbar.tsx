import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router';

// Placeholder owned by W2-D (Shell): port of the mat-toolbar in app.component.html.
export function AppToolbar() {
  return (
    <AppBar position="static" color="primary" elevation={6}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          COURSES
        </Button>
        <Button color="inherit" component={Link} to="/about">
          ABOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
}
