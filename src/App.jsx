import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import InputModule from './components/InputModule';
import CanvasArea from './components/CanvasArea';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './components/SearchPage';
import SSOLogin from './components/SSOLogin';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <div className="app-container">
        <SideMenu />
        <div className="main-area">
          <CanvasArea />
          <InputModule />
        </div>
      </div>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<SSOLogin />} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </Router>
  );
}

export default App;