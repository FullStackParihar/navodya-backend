import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
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
    let themeColor = '#2f4a67'; // Default to muted brand color
    
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Shift + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`}></i>
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
      
      <style jsx>{`
        /* Theme Toggle Button */
        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: var(--primary-color, #2f4a67);
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .theme-toggle:hover {
          background: var(--primary-hover, #23394f);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .theme-toggle i {
          font-size: 18px;
          transition: all 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .theme-toggle {
            top: 15px;
            right: 15px;
            padding: 10px 16px;
            font-size: 12px;
          }
          
          .theme-toggle i {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .theme-toggle {
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            font-size: 11px;
          }
          
          .theme-toggle i {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default ThemeToggle;
