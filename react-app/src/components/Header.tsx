import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ boxShadow: 6 }}>
      <Toolbar>
        <Button color="inherit" onClick={() => navigate('/')}>
          COURSES
        </Button>
        <Button color="inherit" onClick={() => navigate('/about')}>
          ABOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
