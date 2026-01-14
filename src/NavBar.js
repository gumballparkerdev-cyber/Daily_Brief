import React, { useState } from 'react';
import './NavBar.css';

const NavBar = ({ onThemeToggle, theme }) => {
  const [isToggled, setIsToggled] = useState(theme === 'dark');

  const handleToggle = () => {
    const newTheme = isToggled ? 'light' : 'dark';
    setIsToggled(!isToggled);
    if (onThemeToggle) {
      onThemeToggle(newTheme);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="app-name">Daily Brief</h1>
        <div className="toggle-container">
          <div className={`toggle-switch ${isToggled ? 'toggled' : ''}`} onClick={handleToggle}>
            <div className="toggle-bg">
              <div className="toggle-slider"></div>
              <div className="toggle-arrow"></div>
              <div className="toggle-body-left"></div>
              <div className="toggle-body-right"></div>
            </div>
            <div className="toggle-dot"></div>
            <div className="toggle-line"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;