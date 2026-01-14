import React, { useState, useEffect } from 'react';
import '../CSS/navBar.css';
import Switch from './Switch';
import PortConfig from './PortConfig';

const NavBar = ({ onThemeToggle, theme, streak }) => {
  const [isToggled, setIsToggled] = useState(theme === 'dark');
  const [increased, setIncreased] = useState(false);
  const [showPortConfig, setShowPortConfig] = useState(false);

  useEffect(() => {
    // Check if streak increased (simple animation trigger)
    const lastStreak = parseInt(localStorage.getItem('lastStreak') || '0', 10);
    if (streak > lastStreak) {
      setIncreased(true);
      setTimeout(() => setIncreased(false), 1000);
    }
    localStorage.setItem('lastStreak', streak.toString());
  }, [streak]);

  const handleToggle = () => {
    const newTheme = isToggled ? 'light' : 'dark';
    setIsToggled(!isToggled);
    if (onThemeToggle) {
      onThemeToggle(newTheme);
    }
  };

  return (
    <>
      <nav className={`navbar ${theme}`}>
        <div className="navbar-content">
          <h1 className="app-name">Daily Brief</h1>
          <span className={`streak ${increased ? 'increased' : ''}`}>🔥 {streak}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowPortConfig(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '4px',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              title="Backend Settings"
            >
              ⚙️
            </button>
            <div className="toggle-container">
              <Switch checked={isToggled} onChange={handleToggle} />
            </div>
          </div>
        </div>
      </nav>
      
      {showPortConfig && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1999
            }}
            onClick={() => setShowPortConfig(false)}
          />
          <PortConfig onClose={() => setShowPortConfig(false)} />
        </>
      )}
    </>
  );
};

export default NavBar;