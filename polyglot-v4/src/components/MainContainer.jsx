import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomeScreen from '../HomeScreen';
import LessonScreen from '../LessonScreen';
import PracticeScreen from '../PracticeScreen';
import ProfileScreen from '../ProfileScreen';
import LeftMenu from './LeftMenu';
import './MainContainer.css';

export default function MainContainer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (route) => {
    navigate(route.toLowerCase());
    setMenuOpen(false);
  };

  return (
    <div className={`main-container ${menuOpen ? 'menu-open' : ''}`}>
      <LeftMenu navigation={handleNavigation} />
      <div className="content">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/lessons" element={<LessonScreen />} />
          <Route path="/practice" element={<PracticeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </div>
  );
}
