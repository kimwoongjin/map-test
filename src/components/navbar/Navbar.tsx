import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
  return (
    <div className="heading">
      <h2>My App</h2>
      <div className="nav">
        <Link to={'/'} className="nav_item">
          home
        </Link>
        <Link to={'/3d'} className="nav_item">
          3D
        </Link>
      </div>
    </div>
  );
}
