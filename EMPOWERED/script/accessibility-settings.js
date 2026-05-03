// Accessibility Settings - Shared across all pages (Must have UI elements)

const AccessibilitySettings = {
    // Default settings
    defaults: {
        fontSize: 'medium',
        highContrast: false
    },

    // Save settings to localStorage
    save: function() {
        const activeText = document.querySelector('.text-size-button.active');
        const contrastToggle = document.getElementById('high-contrast-toggle');
        
        const settings = {
            fontSize: activeText ? activeText.dataset.size : this.defaults.fontSize,
            highContrast: contrastToggle ? contrastToggle.checked : this.defaults.highContrast
        };
        
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    },

    // Load settings from localStorage
    load: function() {
        const saved = localStorage.getItem('accessibilitySettings');
        return saved ? JSON.parse(saved) : this.defaults;
    },

    // Apply loaded settings to the page
    apply: function() {
        const settings = this.load();

        // Apply font size
        const textSizeButtons = document.querySelectorAll('.text-size-button');
        textSizeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === settings.fontSize) {
                btn.classList.add('active');
            }
        });

        // Apply high contrast
        const contrastToggle = document.getElementById('high-contrast-toggle');
        if (contrastToggle) {
            contrastToggle.checked = settings.highContrast;
        }

        // Update body classes
        this.updateBodyClasses();
    },

    // Update body classes based on current settings
    updateBodyClasses: function() {
        document.body.classList.remove('text-small', 'text-medium', 'text-large', 'high-contrast');
        const activeText = document.querySelector('.text-size-button.active');
        const contrastToggle = document.getElementById('high-contrast-toggle');
        
        if (activeText) document.body.classList.add(`text-${activeText.dataset.size}`);
        if (contrastToggle && contrastToggle.checked) document.body.classList.add('high-contrast');
    }
};
