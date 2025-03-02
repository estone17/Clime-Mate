document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the saved theme (default to 'light' if none found)
    const savedTheme = localStorage.getItem('theme') || 'light';
    switchTheme(savedTheme);

    // 2. If custom theme is saved, apply saved custom colors
    if (savedTheme === 'custom') {
        const bgColor = localStorage.getItem('custom-bg-color') || '#fffff0';
        const textColor = localStorage.getItem('custom-text-color') || '#000000';

        document.documentElement.style.setProperty('--background-color', bgColor);
        document.documentElement.style.setProperty('--text-color', textColor);
    }

    // 3. Check for view-selector on the page; only do view logic if it exists
    const viewSelector = document.getElementById('view-selector');
    if (viewSelector) {
        const savedView = localStorage.getItem('view') || 'compact';
        viewSelector.value = savedView;
        switchView(savedView);
    }
});

// Switch between predefined themes (light, dark, custom)
function switchTheme(theme) {
    // Some pages (like index.html) may not have the custom-theme-settings section
    const customThemeSettings = document.querySelector('.custom-theme-settings');

    if (theme === 'custom') {
        // Show custom theme settings if it exists
        if (customThemeSettings) {
            customThemeSettings.style.display = 'block';
        }
        document.documentElement.setAttribute('data-theme', 'custom');
        localStorage.setItem('theme', 'custom');
    } else {
        // Hide custom theme settings if it exists
        if (customThemeSettings) {
            customThemeSettings.style.display = 'none';
        }
        document.documentElement.setAttribute('data-theme', theme);

        // Reset colors for light/dark themes
        if (theme === 'light') {
            document.documentElement.style.setProperty('--background-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-color', '#333');
        } else if (theme === 'dark') {
            document.documentElement.style.setProperty('--background-color', '#333');
            document.documentElement.style.setProperty('--text-color', '#f0f0f0');
        }

        // Remove custom theme colors from localStorage when switching away from custom
        localStorage.removeItem('custom-bg-color');
        localStorage.removeItem('custom-text-color');

        localStorage.setItem('theme', theme);
    }
}

// Update custom theme colors
function updateCustomTheme() {
    // Only run if the custom color inputs are on the page
    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');

    if (!bgColorInput || !textColorInput) {
        return; // Exit if we’re not on the settings page
    }

    const bgColor = bgColorInput.value;
    const textColor = textColorInput.value;

    // Apply custom colors to CSS variables
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);

    // Save custom colors
    localStorage.setItem('custom-bg-color', bgColor);
    localStorage.setItem('custom-text-color', textColor);

    // Ensure data-theme is set to custom
    document.documentElement.setAttribute('data-theme', 'custom');
    localStorage.setItem('theme', 'custom');
}

// Switch between compact and detailed views
function switchView(view) {
    document.body.setAttribute('data-view', view);
    localStorage.setItem('view', view);
}
