import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, Home, Award } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo" aria-label="Go to dashboard home">
          <Award className="logo-icon" />
          <span>Go Business</span>
        </Link>
        <div className="navbar-actions">
          <nav className="navbar-navigation" aria-label="Primary">
            <Link to="/" className="nav-link">
              <Home className="nav-icon" />
              <span>Home</span>
            </Link>
          </nav>
          <button onClick={handleLogout} className="logout-button">
            <LogOut className="nav-icon" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
