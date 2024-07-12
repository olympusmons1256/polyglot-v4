import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftMenu from '../LeftMenu';
import './MainContainer.css';

export default function MainContainer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    setMenuOpen(false);
  };

  return (
    <div className={`main-container ${menuOpen ? 'menu-open' : ''}`}>
      <LeftMenu navigation={handleNavigation} />
      <div className="content">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <div>
          <h1>Welcome to Polyglot</h1>
          <p>Select an option from the menu to get started.</p>
        </div>
      </div>
    </div>
  );
}
