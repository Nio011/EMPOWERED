const accessButton = document.querySelector('.accessibility-button');
const panel = document.getElementById('accessibility-panel');
const textSizeButtons = document.querySelectorAll('.text-size-button');
const contrastButtons = document.querySelectorAll('.contrast-button');

const updateBodyClasses = () => {
    document.body.classList.remove('text-small', 'text-medium', 'text-large', 'high-contrast');
    const activeText = document.querySelector('.text-size-button.active');
    const activeContrast = document.querySelector('.contrast-button.active');
    if (activeText) document.body.classList.add(`text-${activeText.dataset.size}`);
    if (activeContrast && activeContrast.dataset.contrast === 'high') document.body.classList.add('high-contrast');
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
    });
});

contrastButtons.forEach(button => {
    button.addEventListener('click', () => {
        contrastButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateBodyClasses();
    });
});

document.addEventListener('click', event => {
    if (!event.target.closest('.accessibility-menu')) {
        panel.classList.remove('open');
        accessButton.setAttribute('aria-expanded', 'false');
    }
});

updateBodyClasses();
