const accessButton = document.querySelector('.accessibility-button');
const panel = document.getElementById('accessibility-panel');
const textSizeButtons = document.querySelectorAll('.text-size-button');
const contrastToggle = document.getElementById('high-contrast-toggle');

// Load saved settings on page load (if accessibility settings is available)
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

// Make course cards clickable
const courseCard = document.querySelector('.course-card');
if (courseCard) {
    courseCard.style.cursor = 'pointer';
    courseCard.addEventListener('click', () => {
        window.location.href = 'course.html';
    });
}
