import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button 
          onClick={() => navigate('/home')} 
          className="nav-link"
          type="button"
        >
          דף הבית
        </button>
        <button 
          onClick={() => navigate('/products')} 
          className="nav-link"
          type="button"
        >
          מוצרים
        </button>
        <button 
          onClick={() => navigate('/profilePage')} 
          className="nav-link"
          type="button"
        >
          שינוי פרופיל
        </button>
      </div>
    </nav>
  );
};

export default Navbar;