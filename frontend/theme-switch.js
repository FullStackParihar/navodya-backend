// Theme Switch - Physical Toggle Button

class ThemeSwitch {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme on page load
        this.applyTheme(this.currentTheme);
        
        // Create theme switch
        this.createThemeSwitch();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }

    createThemeSwitch() {
        // Check if switch already exists
        if (document.querySelector('.theme-switch-container')) {
            return;
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'theme-switch-container';
        container.innerHTML = `
            <div class="theme-switch-label">Theme</div>
            <div class="theme-switch ${this.currentTheme === 'dark' ? 'active' : ''}" id="themeSwitch">
                <div class="theme-switch-knob">
                    <i class="fas ${this.currentTheme === 'light' ? 'fa-sun' : 'fa-moon'} icon"></i>
                </div>
            </div>
            <div class="theme-labels">
                <span class="theme-label ${this.currentTheme === 'light' ? 'active' : ''}" id="lightLabel">Light</span>
                <span class="theme-label ${this.currentTheme === 'dark' ? 'active' : ''}" id="darkLabel">Dark</span>
            </div>
        `;

        // Add event listener
        const switchElement = container.querySelector('.theme-switch');
        switchElement.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add to page
        document.body.appendChild(container);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            this.saveTheme(theme);
            this.currentTheme = theme;
            this.updateSwitchState();
            
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

    updateSwitchState() {
        const switchElement = document.querySelector('.theme-switch');
        const knobElement = document.querySelector('.theme-switch-knob');
        const iconElement = knobElement.querySelector('.icon');
        const lightLabel = document.getElementById('lightLabel');
        const darkLabel = document.getElementById('darkLabel');

        if (switchElement && knobElement && iconElement && lightLabel && darkLabel) {
            if (this.currentTheme === 'dark') {
                switchElement.classList.add('active');
                iconElement.className = 'fas fa-moon icon';
                darkLabel.classList.add('active');
                lightLabel.classList.remove('active');
            } else {
                switchElement.classList.remove('active');
                iconElement.className = 'fas fa-sun icon';
                lightLabel.classList.add('active');
                darkLabel.classList.remove('active');
            }
        }
    }

    updateMetaThemeColor(theme) {
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
                this.updateSwitchState();
            }
        }
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
            
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
            this.updateSwitchState();
        }
    }
}

// Initialize theme switch when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitch = new ThemeSwitch();
    
    // Make theme switch globally available
    window.toggleTheme = () => window.themeSwitch.toggleTheme();
    window.setTheme = (theme) => window.themeSwitch.setThemeProgrammatically(theme);
    window.getTheme = () => window.themeSwitch.getTheme();
    window.isDarkMode = () => window.themeSwitch.isDarkMode();
    window.setLightMode = () => window.themeSwitch.setThemeProgrammatically('light');
    window.setDarkMode = () => window.themeSwitch.setThemeProgrammatically('dark');
    window.resetTheme = () => window.themeSwitch.resetToSystemTheme();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitch;
}

// React Hook for theme management
if (typeof React !== 'undefined' && typeof React.useState === 'function') {
    window.useThemeSwitch = () => {
        const [theme, setTheme] = React.useState(window.themeSwitch?.getTheme() || 'light');
        
        React.useEffect(() => {
            const handleThemeChange = (event) => {
                setTheme(event.detail.theme);
            };
            
            window.addEventListener('themeChanged', handleThemeChange);
            return () => window.removeEventListener('themeChanged', handleThemeChange);
        }, []);
        
        return {
            theme,
            toggleTheme: () => window.themeSwitch?.toggleTheme(),
            setLightMode: () => window.themeSwitch?.setThemeProgrammatically('light'),
            setDarkMode: () => window.themeSwitch?.setThemeProgrammatically('dark'),
            setTheme: (newTheme) => window.themeSwitch?.setThemeProgrammatically(newTheme),
            isDarkMode: theme === 'dark',
            isLightMode: theme === 'light'
        };
    };
}
