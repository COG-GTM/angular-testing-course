import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import type { SxProps, Theme } from '@mui/material/styles';
import { Link } from 'react-router';

// Angular Material M2 typography (`mat.m2-define-typography-config()`) uses this stack, not the body font.
const MAT_FONT = 'Roboto, sans-serif';

// `.mat-toolbar` (M2): title typography, 64px row (56px below 600px), 16px side padding.
const toolbarSx: SxProps<Theme> = {
  height: 64,
  minHeight: 64,
  px: 2,
  fontFamily: MAT_FONT,
  fontSize: 20,
  fontWeight: 500,
  lineHeight: '32px',
  letterSpacing: '0.0125em',
  '@media (max-width: 599px)': { height: 56, minHeight: 56 },
};

// `a[mat-button]` (M2 text button, unthemed): black state layer (hover 4%, focus/pressed 12%) applied
// instantly, black 10% ripple, no focus pulse, no uppercase transform.
const buttonSx: SxProps<Theme> = {
  height: 36,
  minWidth: 64,
  px: 1,
  py: 0,
  borderRadius: '4px',
  fontFamily: MAT_FONT,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '32px',
  letterSpacing: '0.0892857143em',
  textTransform: 'none',
  transition: 'none',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  '&.Mui-focusVisible, &:active': { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
  // MUI ripples render at 30% opacity: 0.3 × 0.333 ≈ the 10% `--mat-text-button-ripple-color`.
  '& .MuiTouchRipple-child': { backgroundColor: 'rgba(0, 0, 0, 0.333)' },
};

/** Port of the `<mat-toolbar color="primary" class="mat-elevation-z6">` in app.component.html. */
export function AppToolbar() {
  return (
    <AppBar position="static" color="primary" elevation={6}>
      <Toolbar disableGutters sx={toolbarSx}>
        <Button color="inherit" component={Link} to="/" disableFocusRipple sx={buttonSx}>
          <span>COURSES</span>
        </Button>
        <Button color="inherit" component={Link} to="/about" disableFocusRipple sx={buttonSx}>
          <span>ABOUT</span>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
