import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item"><Link className="nav-link" to="/upload">Incluir Upload</Link></li>
        
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
