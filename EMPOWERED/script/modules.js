// script/modules.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Accessibility Engine Configs
    if (typeof AccessibilitySettings !== 'undefined') {
        AccessibilitySettings.apply();
    }

    // 2. Localized DOM Navigation Control Overrides
    const accessButton = document.querySelector('.accessibility-button');
    const panel = document.getElementById('accessibility-panel');
    const textSizeButtons = document.querySelectorAll('.text-size-button');
    const contrastToggle = document.getElementById('high-contrast-toggle');

    if (accessButton && panel) {
        accessButton.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.accessibility-menu')) panel.classList.remove('open');
        });
    }

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

    if (contrastToggle) {
        contrastToggle.addEventListener('change', () => {
            if (typeof AccessibilitySettings !== 'undefined') {
                AccessibilitySettings.updateBodyClasses();
                AccessibilitySettings.save();
            }
        });
    }

    // 3. Text-to-Speech "Read Aloud" Button Logic with "Stop" function
    const readAloudButtons = document.querySelectorAll('.speak-btn');
    let currentUtterance = null;
    let activeSpeakBtn = null;

    readAloudButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = button.closest('.topic-item');
            const title = item.querySelector('.lesson-title').innerText;
            const text = item.querySelector('.body-text').innerText;
            
            if (activeSpeakBtn === button) {
                window.speechSynthesis.cancel();
                button.classList.remove('reading');
                button.querySelector('span').innerText = "Read Aloud";
                activeSpeakBtn = null;
            } else {
                window.speechSynthesis.cancel();
                if (activeSpeakBtn) {
                    activeSpeakBtn.classList.remove('reading');
                    activeSpeakBtn.querySelector('span').innerText = "Read Aloud";
                }
                
                currentUtterance = new SpeechSynthesisUtterance(`${title}. ${text}`);
                activeSpeakBtn = button;
                
                currentUtterance.onstart = () => {
                    button.classList.add('reading');
                    button.querySelector('span').innerText = "Stop";
                };
                
                currentUtterance.onend = () => {
                    button.classList.remove('reading');
                    button.querySelector('span').innerText = "Read Aloud";
                    if (activeSpeakBtn === button) activeSpeakBtn = null;
                };
                
                window.speechSynthesis.speak(currentUtterance);
            }
        });
    });

    // Clean up audio streams if a user leaves the viewport layout
    window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());

    // 4. RESTORE COMPLETION PERSISTENCE STATES ON LOAD
    initializeCompletionStates();
});

// ================= ACCORDION ACCESSIBILITY CONTROLLER =================
function toggleModule(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector('span:last-child');
    const isOpen = content.classList.toggle('open');
    if (arrow) {
        arrow.innerText = isOpen ? '▲' : '▼';
    }
}

// ================= DYNAMIC PERSISTENT COMPLETION SYSTEM =================
function initializeCompletionStates() {
    const completionButtons = document.querySelectorAll('.btn-complete');
    
    completionButtons.forEach(btn => {
        const lessonId = btn.getAttribute('data-lesson-id');
        const isCompleted = localStorage.getItem(`lesson_${lessonId}_complete`) === 'true';
        
        if (isCompleted) {
            btn.classList.add('finished');
            btn.innerText = "✓ Completed";
        } else {
            btn.classList.remove('finished');
            btn.innerText = "Mark as Complete";
        }
    });

    // Recalculate module percentages and top course summary counters
    updateAllModuleCardPercentages();
    if (typeof window.updateOverallProgress === 'function') {
        window.updateOverallProgress();
    }
}

function markComplete(btn) {
    const lessonId = btn.getAttribute('data-lesson-id');
    const currentlyCompleted = btn.classList.contains('finished');
    
    if (currentlyCompleted) {
        // Toggle Off
        btn.classList.remove('finished');
        btn.innerText = "Mark as Complete";
        localStorage.setItem(`lesson_${lessonId}_complete`, 'false');
    } else {
        // Toggle On
        btn.classList.add('finished');
        btn.innerText = "✓ Completed";
        localStorage.setItem(`lesson_${lessonId}_complete`, 'true');
    }
    
    // Recalculate tracking matrices dynamically
    updateAllModuleCardPercentages();
    if (typeof window.updateOverallProgress === 'function') {
        window.updateOverallProgress();
    }
}

function updateAllModuleCardPercentages() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach(card => {
        const totalTopics = card.querySelectorAll('.topic-item').length;
        const completedTopics = card.querySelectorAll('.btn-complete.finished').length;
        const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        
        const progressText = card.querySelector('.progress-text');
        if (progressText) {
            progressText.innerText = `${percentage}% Complete`;
        }
    });
}