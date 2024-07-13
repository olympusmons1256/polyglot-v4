import React from 'react';
import { Nav, NavItem } from 'react-spectrum/Nav';
import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <nav className="side-menu">
      <Nav>
        <NavItem key="search" value="search">
          <Link to="/search">Search</Link>
        </NavItem>
        {/* Add more menu items as needed */}
      </Nav>
    </nav>
  );
};

export default SideMenu;