import { Link } from 'react-router-dom';

export default function Toolbar() {
  return (
    <div className="mat-toolbar mat-elevation-z6">
      <Link className="mat-button" to="/">
        <span>COURSES</span>
      </Link>
      <Link className="mat-button" to="/about">
        <span>ABOUT</span>
      </Link>
    </div>
  );
}
