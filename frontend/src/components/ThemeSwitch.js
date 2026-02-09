import React, { useState, useEffect } from 'react';

const ThemeSwitch = () => {
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
      themeColor = '#0f1419'; // Dark background
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
    
    // Ctrl/Cmd + Shift + L for Light Mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      setTheme('light');
    }
    
    // Ctrl/Cmd + Shift + D for Dark Mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setTheme('dark');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <>
      <div className="theme-switch-container">
        <div className="theme-switch-label">Theme</div>
        <div 
          className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label="Toggle theme"
        >
          <div className="theme-switch-knob">
            <i className={`fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'} icon`}></i>
          </div>
        </div>
        <div className="theme-labels">
          <span className={`theme-label ${theme === 'light' ? 'active' : ''}`}>Light</span>
          <span className={`theme-label ${theme === 'dark' ? 'active' : ''}`}>Dark</span>
        </div>
      </div>
      
      <style jsx>{`
        /* Theme Switch Container */
        .theme-switch-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: var(--bg-primary, #ffffff);
          padding: 15px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border: 1px solid var(--border-color, #dee2e6);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .theme-switch-container:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        /* Theme Switch Label */
        .theme-switch-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary, #6c757d);
          margin-bottom: 12px;
          text-align: center;
        }

        /* Physical Toggle Switch */
        .theme-switch {
          position: relative;
          width: 80px;
          height: 40px;
          background: var(--switch-bg, #f0f0f0);
          border: 2px solid var(--switch-border, #ddd);
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .theme-switch::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--switch-active-bg, linear-gradient(135deg, #2f4a67, #23394f));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 40px;
        }

        .theme-switch.active::before {
          transform: scaleX(1);
        }

        /* Switch Knob/Button */
        .theme-switch-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 30px;
          height: 30px;
          background: var(--switch-knob, #ffffff);
          border-radius: 50%;
          box-shadow: var(--switch-knob-shadow, 0 2px 8px rgba(0,0,0,0.15));
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--text-secondary, #6c757d);
          z-index: 2;
        }

        .theme-switch.active .theme-switch-knob {
          left: 43px;
          background: var(--switch-active-knob, #ffffff);
          box-shadow: var(--switch-active-knob-shadow, 0 2px 12px rgba(47, 74, 103, 0.4));
          color: var(--primary-color, #2f4a67);
        }

        /* Icons inside the switch */
        .theme-switch-knob .icon {
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .theme-switch.active .theme-switch-knob .icon {
          opacity: 1;
          transform: scale(1.1);
        }

        /* Theme Labels */
        .theme-labels {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding: 0 5px;
        }

        .theme-label {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted, #adb5bd);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .theme-label.active {
          color: var(--primary-color, #2f4a67);
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .theme-switch-container {
            top: 15px;
            right: 15px;
            padding: 12px;
          }
          
          .theme-switch {
            width: 70px;
            height: 35px;
          }
          
          .theme-switch-knob {
            width: 26px;
            height: 26px;
            top: 2.5px;
            left: 2.5px;
          }
          
          .theme-switch.active .theme-switch-knob {
            left: 37.5px;
          }
          
          .theme-switch-label {
            font-size: 11px;
            margin-bottom: 10px;
          }
          
          .theme-labels {
            margin-top: 8px;
          }
          
          .theme-label {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .theme-switch-container {
            top: 10px;
            right: 10px;
            padding: 10px;
          }
          
          .theme-switch {
            width: 60px;
            height: 30px;
          }
          
          .theme-switch-knob {
            width: 22px;
            height: 22px;
            top: 2px;
            left: 2px;
            font-size: 12px;
          }
          
          .theme-switch.active .theme-switch-knob {
            left: 32px;
          }
          
          .theme-switch-label {
            font-size: 10px;
            margin-bottom: 8px;
          }
          
          .theme-labels {
            margin-top: 6px;
          }
          
          .theme-label {
            font-size: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default ThemeSwitch;
