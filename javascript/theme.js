// Use consistent localStorage keys
const THEME_KEY = 'clime-mate-theme';
const BG_COLOR_KEY = 'clime-mate-bg-color';
const TEXT_COLOR_KEY = 'clime-mate-text-color';
const VIEW_KEY = 'clime-mate-view';

// Initialize theme as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    // Document already loaded, run immediately
    initTheme();
}

// Function to initialize theme and settings
function initTheme() {
    console.log('Initializing theme...');
    
    // 1. Load the saved theme (default to 'dark' if none found)
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    
    // 2. Update the theme selector if it exists
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
    
    // 3. Apply the theme
    applyTheme(savedTheme);
    
    // 4. If custom theme is saved, apply saved custom colors
    if (savedTheme === 'custom') {
        const bgColor = localStorage.getItem(BG_COLOR_KEY) || '#fffff0';
        const textColor = localStorage.getItem(TEXT_COLOR_KEY) || '#000000';
        
        document.documentElement.style.setProperty('--background-color', bgColor);
        document.documentElement.style.setProperty('--text-color', textColor);
        
        // Apply custom colors to all elements that might need it
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
        
        // Apply to container elements
        const containers = document.querySelectorAll('.container, .container-map, .card');
        containers.forEach(container => {
            container.style.backgroundColor = bgColor;
            container.style.color = textColor;
        });
        
        // Update color inputs if they exist
        const bgColorInput = document.getElementById('bg-color');
        const textColorInput = document.getElementById('text-color');
        
        if (bgColorInput) bgColorInput.value = bgColor;
        if (textColorInput) textColorInput.value = textColor;
        
        // Show custom theme settings if they exist
        const customThemeSettings = document.querySelector('.custom-theme-settings');
        if (customThemeSettings) {
            customThemeSettings.style.display = 'block';
        }
        
        // Apply theme to iframe content if possible
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    const iframeDoc = iframe.contentDocument;
                    iframeDoc.documentElement.style.setProperty('--background-color', bgColor);
                    iframeDoc.documentElement.style.setProperty('--text-color', textColor);
                    iframeDoc.body.style.backgroundColor = bgColor;
                    iframeDoc.body.style.color = textColor;
                }
            } catch (e) {
                console.log('Could not apply theme to iframe:', e);
            }
        });
    }
    
    // 5. Apply saved view setting to body
    const savedView = localStorage.getItem(VIEW_KEY) || 'detailed';
    document.body.setAttribute('data-view', savedView);
    
    // Update view selector if it exists
    const viewSelector = document.getElementById('view-selector');
    if (viewSelector) {
        viewSelector.value = savedView;
    }
    
    console.log('Theme initialization complete:', savedTheme);
}

// Function to apply theme to the current page
function applyTheme(theme) {
    console.log('Applying theme:', theme);
    
    // Reset data-theme attribute
    document.documentElement.removeAttribute('data-theme');
    
    if (theme === 'light') {
        // For light theme, we don't set data-theme (using default CSS variables)
        document.documentElement.style.setProperty('--background-color', '#f0f0f0');
        document.documentElement.style.setProperty('--text-color', '#333');
        
        // Update Bootstrap theme
        document.body.setAttribute('data-bs-theme', 'light');
        
        // If using Bootstrap navbar, also update its theme
        const navbar = document.querySelector('nav.navbar');
        if (navbar) {
            navbar.setAttribute('data-bs-theme', 'light');
        }
        
        // Update alert colors for light theme
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.classList.contains('alert-primary')) {
                alert.style.backgroundColor = '#cfe2ff';
                alert.style.color = '#084298';
            }
        });
    } else if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--background-color', '#333');
        document.documentElement.style.setProperty('--text-color', '#f0f0f0');
        
        // Update Bootstrap theme
        document.body.setAttribute('data-bs-theme', 'dark');
        
        // If using Bootstrap navbar, also update its theme
        const navbar = document.querySelector('nav.navbar');
        if (navbar) {
            navbar.setAttribute('data-bs-theme', 'dark');
        }
        
        // Update alert colors for dark theme
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.classList.contains('alert-primary')) {
                alert.style.backgroundColor = '#031633';
                alert.style.color = '#6ea8fe';
            }
        });
    } else if (theme === 'custom') {
        document.documentElement.setAttribute('data-theme', 'custom');
        
        // Custom colors will be applied separately in initTheme
        
        // Update Bootstrap theme based on brightness of background color
        const bgColor = localStorage.getItem(BG_COLOR_KEY) || '#fffff0';
        const textColor = localStorage.getItem(TEXT_COLOR_KEY) || '#000000';
        
        // Calculate brightness (simple formula: (R*299 + G*587 + B*114) / 1000)
        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // If background is dark, use light text for Bootstrap elements
        if (brightness < 128) {
            document.body.setAttribute('data-bs-theme', 'dark');
        } else {
            document.body.setAttribute('data-bs-theme', 'light');
        }
        
        // Update alert colors for custom theme
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.classList.contains('alert-primary')) {
                alert.style.backgroundColor = bgColor;
                alert.style.color = textColor;
            }
        });
    }
    
    // Apply theme to iframe content if possible
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            if (iframe.contentDocument) {
                const iframeDoc = iframe.contentDocument;
                if (theme === 'light') {
                    iframeDoc.documentElement.style.setProperty('--background-color', '#f0f0f0');
                    iframeDoc.documentElement.style.setProperty('--text-color', '#333');
                } else if (theme === 'dark') {
                    iframeDoc.documentElement.style.setProperty('--background-color', '#333');
                    iframeDoc.documentElement.style.setProperty('--text-color', '#f0f0f0');
                } else if (theme === 'custom') {
                    const bgColor = localStorage.getItem(BG_COLOR_KEY) || '#fffff0';
                    const textColor = localStorage.getItem(TEXT_COLOR_KEY) || '#000000';
                    iframeDoc.documentElement.style.setProperty('--background-color', bgColor);
                    iframeDoc.documentElement.style.setProperty('--text-color', textColor);
                }
            }
        } catch (e) {
            console.log('Could not apply theme to iframe:', e);
        }
    });
}

// Switch between predefined themes (light, dark, custom)
// This function is called by the onchange event in your HTML
function switchTheme(theme) {
    console.log('Switching theme to:', theme);
    
    // Save the theme preference
    localStorage.setItem(THEME_KEY, theme);
    
    // Some pages (like index.html) may not have the custom-theme-settings section
    const customThemeSettings = document.querySelector('.custom-theme-settings');
    
    if (theme === 'custom') {
        // Show custom theme settings if it exists
        if (customThemeSettings) {
            customThemeSettings.style.display = 'block';
        }
        
        // Load saved custom colors or use defaults
        const bgColor = localStorage.getItem(BG_COLOR_KEY) || '#fffff0';
        const textColor = localStorage.getItem(TEXT_COLOR_KEY) || '#000000';
        
        // Apply custom colors
        document.documentElement.style.setProperty('--background-color', bgColor);
        document.documentElement.style.setProperty('--text-color', textColor);
        
        // Apply custom colors to all elements that might need it
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
        
        // Apply to container elements
        const containers = document.querySelectorAll('.container, .container-map, .card');
        containers.forEach(container => {
            container.style.backgroundColor = bgColor;
            container.style.color = textColor;
        });
        
        // Update color inputs if they exist
        const bgColorInput = document.getElementById('bg-color');
        const textColorInput = document.getElementById('text-color');
        
        if (bgColorInput) bgColorInput.value = bgColor;
        if (textColorInput) textColorInput.value = textColor;
    } else {
        // Hide custom theme settings if it exists
        if (customThemeSettings) {
            customThemeSettings.style.display = 'none';
        }
    }
    
    // Apply the theme
    applyTheme(theme);
}

// Update custom theme colors
// This function is called by the onchange event on color inputs
function updateCustomTheme() {
    // Only run if the custom color inputs are on the page
    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');
    
    if (!bgColorInput || !textColorInput) {
        return; // Exit if we're not on the settings page
    }
    
    const bgColor = bgColorInput.value;
    const textColor = textColorInput.value;
    
    console.log('Updating custom theme - BG:', bgColor, 'Text:', textColor);
    
    // Apply custom colors to CSS variables
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    
    // Apply custom colors to all elements that might need it
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Apply to container elements
    const containers = document.querySelectorAll('.container, .container-map, .card');
    containers.forEach(container => {
        container.style.backgroundColor = bgColor;
        container.style.color = textColor;
    });
    
    // Save custom colors
    localStorage.setItem(BG_COLOR_KEY, bgColor);
    localStorage.setItem(TEXT_COLOR_KEY, textColor);
    
    // Ensure data-theme is set to custom
    document.documentElement.setAttribute('data-theme', 'custom');
    localStorage.setItem(THEME_KEY, 'custom');
    
    // Apply theme to iframe content if possible
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            if (iframe.contentDocument) {
                const iframeDoc = iframe.contentDocument;
                iframeDoc.documentElement.style.setProperty('--background-color', bgColor);
                iframeDoc.documentElement.style.setProperty('--text-color', textColor);
                iframeDoc.body.style.backgroundColor = bgColor;
                iframeDoc.body.style.color = textColor;
            }
        } catch (e) {
            console.log('Could not apply theme to iframe:', e);
        }
    });
}

// Switch between compact and detailed views
// This function is called by the onchange event on view selector
function switchView(view) {
    console.log('Switching view to:', view);
    document.body.setAttribute('data-view', view);
    localStorage.setItem(VIEW_KEY, view);
}
