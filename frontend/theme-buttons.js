// Separate Theme Buttons - Dark Mode & Light Mode Buttons

class ThemeButtonsManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme on page load
        this.applyTheme(this.currentTheme);
        
        // Create theme buttons
        this.createThemeButtons();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }

    createThemeButtons() {
        // Check if buttons already exist
        if (document.querySelector('.theme-buttons-container')) {
            return;
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'theme-buttons-container';
        container.innerHTML = `
            <div class="theme-buttons-label">Theme</div>
            <button class="theme-btn light-mode-btn ${this.currentTheme === 'light' ? 'active' : ''}" 
                    data-theme="light" aria-label="Switch to Light Mode">
                <i class="fas fa-sun"></i>
                <span>Light</span>
            </button>
            <button class="theme-btn dark-mode-btn ${this.currentTheme === 'dark' ? 'active' : ''}" 
                    data-theme="dark" aria-label="Switch to Dark Mode">
                <i class="fas fa-moon"></i>
                <span>Dark</span>
            </button>
        `;

        // Add event listeners
        const lightBtn = container.querySelector('.light-mode-btn');
        const darkBtn = container.querySelector('.dark-mode-btn');

        lightBtn.addEventListener('click', () => {
            this.setTheme('light');
        });

        darkBtn.addEventListener('click', () => {
            this.setTheme('dark');
        });

        // Add to page
        document.body.appendChild(container);
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.saveTheme(theme);
            this.currentTheme = theme;
            this.updateButtonStates();
            
            // Add animation class
            document.body.classList.add('theme-loading');
            setTimeout(() => {
                document.body.classList.remove('theme-loading');
            }, 300);

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: theme } 
            }));
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    updateButtonStates() {
        const lightBtn = document.querySelector('.light-mode-btn');
        const darkBtn = document.querySelector('.dark-mode-btn');

        if (lightBtn && darkBtn) {
            if (this.currentTheme === 'light') {
                lightBtn.classList.add('active');
                darkBtn.classList.remove('active');
            } else {
                darkBtn.classList.add('active');
                lightBtn.classList.remove('active');
            }
        }
    }

    updateMetaThemeColor(theme) {
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
    }

    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                }
            });

            // Apply system theme on initial load if no saved preference
            if (!localStorage.getItem('theme')) {
                const systemTheme = darkModeQuery.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
                this.currentTheme = systemTheme;
                this.updateButtonStates();
            }
        }
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L for Light Mode
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.setTheme('light');
            }
            
            // Ctrl/Cmd + Shift + D for Dark Mode
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.setTheme('dark');
            }
            
            // Ctrl/Cmd + Shift + T to toggle (old behavior)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
        });
    }

    // Get current theme
    getTheme() {
        return this.currentTheme;
    }

    // Check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    // Set theme programmatically
    setThemeProgrammatically(theme) {
        this.setTheme(theme);
    }

    // Reset to system preference
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        
        if (window.matchMedia) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.applyTheme(systemTheme);
            this.currentTheme = systemTheme;
            this.updateButtonStates();
        }
    }

    // Toggle theme (for backward compatibility)
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Initialize theme buttons manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeButtonsManager = new ThemeButtonsManager();
    
    // Make theme manager globally available
    window.setTheme = (theme) => window.themeButtonsManager.setThemeProgrammatically(theme);
    window.getTheme = () => window.themeButtonsManager.getTheme();
    window.isDarkMode = () => window.themeButtonsManager.isDarkMode();
    window.toggleTheme = () => window.themeButtonsManager.toggleTheme();
    window.setLightMode = () => window.themeButtonsManager.setThemeProgrammatically('light');
    window.setDarkMode = () => window.themeButtonsManager.setThemeProgrammatically('dark');
    window.resetTheme = () => window.themeButtonsManager.resetToSystemTheme();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeButtonsManager;
}

// React Hook for theme management
if (typeof React !== 'undefined' && typeof React.useState === 'function') {
    window.useThemeButtons = () => {
        const [theme, setTheme] = React.useState(window.themeButtonsManager?.getTheme() || 'light');
        
        React.useEffect(() => {
            const handleThemeChange = (event) => {
                setTheme(event.detail.theme);
            };
            
            window.addEventListener('themeChanged', handleThemeChange);
            return () => window.removeEventListener('themeChanged', handleThemeChange);
        }, []);
        
        return {
            theme,
            setLightMode: () => window.themeButtonsManager?.setThemeProgrammatically('light'),
            setDarkMode: () => window.themeButtonsManager?.setThemeProgrammatically('dark'),
            toggleTheme: () => window.themeButtonsManager?.toggleTheme(),
            setTheme: (newTheme) => window.themeButtonsManager?.setThemeProgrammatically(newTheme),
            isDarkMode: theme === 'dark',
            isLightMode: theme === 'light'
        };
    };
}
