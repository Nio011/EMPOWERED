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

document.addEventListener('DOMContentLoaded', () => {

    const speakButtons = document.querySelectorAll('.speak-btn');

    let voices = [];

    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    speakButtons.forEach(button => {

        button.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();

            const card = button.closest('.announce-card');
            if (!card) return;

            const title = card.querySelector('h3')?.innerText;
            const content = card.querySelector('.body-text')?.innerText;

            if (!title || !content) return;

            window.speechSynthesis.cancel();

            setTimeout(() => {

                const speech = new SpeechSynthesisUtterance(
                    `${title}. ${content}`
                );

                speech.rate = 0.95;
                speech.pitch = 1;
                speech.volume = 1;

                if (voices.length > 0) {
                    speech.voice = voices.find(v => v.default) || voices[0];
                }

                window.speechSynthesis.speak(speech);

            }, 80);
        });
    });
});