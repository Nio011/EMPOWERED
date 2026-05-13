const accessButton = document.querySelector('.accessibility-button');
const panel = document.getElementById('accessibility-panel');
const textSizeButtons = document.querySelectorAll('.text-size-button');
const contrastToggle = document.getElementById('high-contrast-toggle');

// Load saved settings on page load
if (typeof AccessibilitySettings !== 'undefined') {
    AccessibilitySettings.apply();
}

const updateBodyClasses = () => {
    if (typeof AccessibilitySettings !== 'undefined') {
        AccessibilitySettings.updateBodyClasses();
    }
};

accessButton.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    accessButton.setAttribute('aria-expanded', String(isOpen));
});

textSizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        textSizeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateBodyClasses();
        if (typeof AccessibilitySettings !== 'undefined') {
            AccessibilitySettings.save();
        }
    });
});

contrastToggle.addEventListener('change', () => {
    updateBodyClasses();
    if (typeof AccessibilitySettings !== 'undefined') {
        AccessibilitySettings.save();
    }
});

document.addEventListener('click', event => {
    if (!event.target.closest('.accessibility-menu')) {
        panel.classList.remove('open');
        accessButton.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('DOMContentLoaded', function() {
        const btn = document.querySelector('.accessibility-button');
        const panel = document.getElementById('accessibility-panel');
        
        btn.addEventListener('click', function() {
            console.log('Button clicked!'); // Check console
            panel.classList.toggle('open');
            this.setAttribute('aria-expanded', panel.classList.contains('open'));
        });
    });

const courseCard = document.querySelector('.course-card');
if (courseCard) {
    courseCard.style.cursor = 'pointer';
    courseCard.addEventListener('click', () => {
        window.location.href = 'course-buttons.html';
    });
}

const progressCard = document.querySelector('.progress-btn');
if (progressCard) {
    progressCard.style.cursor = 'pointer';
    progressCard.addEventListener('click', () => {
        window.location.href = 'progress.html';
    });
}