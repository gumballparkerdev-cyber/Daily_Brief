// core imports
import React, { useState } from 'react';

// component imports
import MainPage from './components/MainPage';
import NavBar from './components/NavBar';

// app component

function App() {
  const [theme, setTheme] = useState('dark');
  const [streak, setStreak] = useState(0);

  const handleThemeToggle = (newTheme) => {
    setTheme(newTheme);
    // Apply theme to the app (e.g., change body class or CSS variables)
  };

  const handleStreakUpdate = (newStreak) => {
    setStreak(newStreak);
  };

  return (
    <div className={`App ${theme}`}>
      <NavBar onThemeToggle={handleThemeToggle} theme={theme} streak={streak} />
      <MainPage onStreakUpdate={handleStreakUpdate} />

    </div>
  );
}

export default App;
