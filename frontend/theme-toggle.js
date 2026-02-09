// Theme Toggle System - Dark Mode & Light Mode

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme on page load
        this.applyTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createToggleButton();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        // Add keyboard shortcut (Ctrl/Cmd + Shift + T)
        this.addKeyboardShortcut();
    }

    createToggleButton() {
        // Check if button already exists
        if (document.querySelector('.theme-toggle')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = `
            <i class="fas fa-sun sun-icon"></i>
            <i class="fas fa-moon moon-icon"></i>
            <span class="theme-text">Light</span>
        `;

        button.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add to page
        document.body.appendChild(button);

        // Update button text based on current theme
        this.updateButtonText();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        this.currentTheme = newTheme;
        this.updateButtonText();
        
        // Add animation class
        document.body.classList.add('theme-loading');
        setTimeout(() => {
            document.body.classList.remove('theme-loading');
        }, 300);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
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

    updateButtonText() {
        const button = document.querySelector('.theme-toggle');
        const textSpan = button.querySelector('.theme-text');
        
        if (textSpan) {
            textSpan.textContent = this.currentTheme === 'light' ? 'Light' : 'Dark';
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
                    this.applyTheme(systemTheme);
                    this.currentTheme = systemTheme;
                    this.updateButtonText();
                }
            });

            // Apply system theme on initial load if no saved preference
            if (!localStorage.getItem('theme')) {
                const systemTheme = darkModeQuery.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
                this.currentTheme = systemTheme;
                this.updateButtonText();
            }
        }
    }

    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
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
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.saveTheme(theme);
            this.currentTheme = theme;
            this.updateButtonText();
        }
    }

    // Reset to system preference
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        
        if (window.matchMedia) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.applyTheme(systemTheme);
            this.currentTheme = systemTheme;
            this.updateButtonText();
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Make theme manager globally available
    window.toggleTheme = () => window.themeManager.toggleTheme();
    window.setTheme = (theme) => window.themeManager.setTheme(theme);
    window.getTheme = () => window.themeManager.getTheme();
    window.isDarkMode = () => window.themeManager.isDarkMode();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

// React Hook for theme management
if (typeof React !== 'undefined' && typeof React.useState === 'function') {
    window.useTheme = () => {
        const [theme, setTheme] = React.useState(window.themeManager?.getTheme() || 'light');
        
        React.useEffect(() => {
            const handleThemeChange = (event) => {
                setTheme(event.detail.theme);
            };
            
            window.addEventListener('themeChanged', handleThemeChange);
            return () => window.removeEventListener('themeChanged', handleThemeChange);
        }, []);
        
        return {
            theme,
            toggleTheme: () => window.themeManager?.toggleTheme(),
            setTheme: (newTheme) => window.themeManager?.setTheme(newTheme),
            isDarkMode: theme === 'dark'
        };
    };
}
