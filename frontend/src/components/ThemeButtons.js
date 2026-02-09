import React, { useState, useEffect } from 'react';

const ThemeButtons = () => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to light
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    };

    darkModeQuery.addEventListener('change', handleChange);
    
    // Apply system theme on initial load if no saved preference
    if (!localStorage.getItem('theme')) {
      const systemTheme = darkModeQuery.matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }

    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const updateMetaThemeColor = (theme) => {
    let themeColor = '#2f4a67'; // Default to brand color
    
    if (theme === 'dark') {
      themeColor = '#1a1a1a'; // Dark background
    } else {
      themeColor = '#ffffff'; // Light background
    }

    // Update or create theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  };

  const setLightMode = () => {
    setTheme('light');
  };

  const setDarkMode = () => {
    setTheme('dark');
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Shift + L for Light Mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      setLightMode();
    }
    
    // Ctrl/Cmd + Shift + D for Dark Mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setDarkMode();
    }
    
    // Ctrl/Cmd + Shift + T to toggle (old behavior)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <>
      <div className="theme-buttons-container">
        <div className="theme-buttons-label">Theme</div>
        <button
          className={`theme-btn light-mode-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={setLightMode}
          aria-label="Switch to Light Mode"
        >
          <i className="fas fa-sun"></i>
          <span>Light</span>
        </button>
        <button
          className={`theme-btn dark-mode-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={setDarkMode}
          aria-label="Switch to Dark Mode"
        >
          <i className="fas fa-moon"></i>
          <span>Dark</span>
        </button>
      </div>
      
      <style jsx>{`
        /* Theme Buttons Container */
        .theme-buttons-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--bg-primary, #ffffff);
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          border: 1px solid var(--border-color, #dee2e6);
          transition: all 0.3s ease;
        }

        .theme-buttons-container:hover {
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        /* Individual Theme Buttons */
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 2px solid var(--border-color, #dee2e6);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #212529);
          min-width: 120px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .theme-btn i {
          font-size: 16px;
          transition: all 0.3s ease;
        }

        /* Light Mode Button */
        .light-mode-btn {
          background: #ffffff;
          color: #212529;
          border-color: #dee2e6;
        }

        .light-mode-btn:hover {
          background: #f8f9fa;
          border-color: var(--primary-color, #2f4a67);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .light-mode-btn.active {
          background: var(--primary-color, #2f4a67);
          color: white;
          border-color: var(--primary-color, #2f4a67);
          box-shadow: 0 0 0 3px rgba(47, 74, 103, 0.18);
        }

        /* Dark Mode Button */
        .dark-mode-btn {
          background: #2d3748;
          color: #ffffff;
          border-color: #4a5568;
        }

        .dark-mode-btn:hover {
          background: #1a202c;
          border-color: var(--primary-color, #2f4a67);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .dark-mode-btn.active {
          background: var(--primary-color, #2f4a67);
          color: white;
          border-color: var(--primary-color, #2f4a67);
          box-shadow: 0 0 0 3px rgba(47, 74, 103, 0.18);
        }

        /* Active State Indicators */
        .theme-btn.active::before {
          content: '✓';
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        /* Theme Buttons Label */
        .theme-buttons-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary, #6c757d);
          text-align: center;
          margin-bottom: 4px;
          padding: 0 4px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .theme-buttons-container {
            top: 15px;
            right: 15px;
          }
          
          .theme-btn {
            padding: 8px 12px;
            font-size: 12px;
            min-width: 100px;
          }
          
          .theme-btn i {
            font-size: 14px;
          }
          
          .theme-buttons-label {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .theme-buttons-container {
            top: 10px;
            right: 10px;
            gap: 8px;
            padding: 6px;
          }
          
          .theme-btn {
            padding: 6px 10px;
            font-size: 11px;
            min-width: 85px;
          }
          
          .theme-btn i {
            font-size: 12px;
          }
          
          .theme-buttons-label {
            font-size: 9px;
            margin-bottom: 2px;
          }
        }
      `}</style>
    </>
  );
};

export default ThemeButtons;
