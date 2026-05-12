document.addEventListener('DOMContentLoaded', () => {
    // Accessibility Logic (Same as Course/Index)
    const accessButton = document.querySelector('.accessibility-button');
    const panel = document.getElementById('accessibility-panel');
    const textSizeButtons = document.querySelectorAll('.text-size-button');
    const contrastToggle = document.getElementById('high-contrast-toggle');

    if (typeof AccessibilitySettings !== 'undefined') {
        AccessibilitySettings.apply();
    }

    accessButton.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('open');
        accessButton.setAttribute('aria-expanded', String(isOpen));
    });

    textSizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            textSizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (typeof AccessibilitySettings !== 'undefined') {
                AccessibilitySettings.updateBodyClasses();
                AccessibilitySettings.save();
            }
        });
    });

    contrastToggle.addEventListener('change', () => {
        if (typeof AccessibilitySettings !== 'undefined') {
            AccessibilitySettings.updateBodyClasses();
            AccessibilitySettings.save();
        }
    });

    // Text-to-Speech
    const speakButtons = document.querySelectorAll('.speak-btn');
    speakButtons.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.closest('.topic-item');
            const text = topic.querySelector('.body-text').innerText;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        });
    });
});

function toggleModule(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('open');
    header.querySelector('span:last-child').innerText = content.classList.contains('open') ? '▲' : '▼';
}

function markComplete(btn) {
    if (btn.classList.contains('finished')) return;

    btn.classList.add('finished');
    btn.innerText = "✓ Completed";
    
    // Calculate progress for the specific module card
    const card = btn.closest('.module-card');
    const totalTopics = card.querySelectorAll('.topic-item').length;
    const completedTopics = card.querySelectorAll('.btn-complete.finished').length;
    
    const percentage = Math.round((completedTopics / totalTopics) * 100);
    card.querySelector('.progress-text').innerText = `${percentage}% Complete`;
}