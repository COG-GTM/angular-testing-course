import { NavLink } from 'react-router-dom';

export function Toolbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'toolbar-link active' : 'toolbar-link';

  return (
    <nav className="toolbar elevation-z6">
      <NavLink to="/" className={linkClass} end>
        <span>COURSES</span>
      </NavLink>

      <NavLink to="/about" className={linkClass}>
        <span>ABOUT</span>
      </NavLink>
    </nav>
  );
}
