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

const myQuestions = [
    {
        question: "A box contains 25 cookies. If you have 4 boxes, how many cookies do you have in total?",
        answers: ["100", "29", "50", "75"],
        correct: 0
    },
    {
        question: "If you divide 80 items into 4 equal groups, how many items are in each group?",
        answers: ["10", "84", "40", "20"],
        correct: 3
    },
    {
        question: "An angle that is greater than 90 degrees is called:",
        answers: ["Acute", "Right", "Obtuse", "Straight"],
        correct: 2
    },
    {
        question: "A shape has 4 sides of equal length and 4 square corners (right angles). What is this shape?",
        answers: ["Triangle", "Circle", "Square", "Rectangle"],
        correct: 2
    },
    {
        question: "What is the value of the digit 7 in the number 7,245?",
        answers: ["700", "70", "7", "7000"],
        correct: 3
    }
];

let currentQuestionIndex = 0;
let points = 0;
let userHistory = [];
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript.toLowerCase();
        console.log("Speech detected:", speech);
        
        let matchedIndex = -1;

        const patterns = [
            { index: 0, triggers: ["triangle", "red", "one"] },
            { index: 1, triggers: ["circle", "yellow", "orange", "three", "round"] },
            { index: 2, triggers: ["square", "green", "four"] },
            { index: 3, triggers: ["rectangle", "blue", "rect", "long"] }
        ];

        patterns.forEach(p => {
            if (p.triggers.some(t => speech.includes(t))) {
                matchedIndex = p.index;
            }
        });

        if (matchedIndex !== -1) {
            showSpeechFeedback("Heard you!", "blue");
            handleAnswer(matchedIndex);
        } else {
            showSpeechFeedback("Try saying the shape name!", "#e67e22");
            const btn = document.getElementById('mic-toggle');
            if (btn) {
                btn.classList.add('shake');
                setTimeout(() => {
                    btn.classList.remove('shake');
                    btn.classList.remove('active');
                    btn.innerText = "🎤";
                    isListening = false;
                }, 400);
            }
        }
    };

    function showSpeechFeedback(text, color) {
        const feedback = document.createElement('div');
        feedback.innerText = text;
        feedback.style.cssText = `
            position: absolute; top: 35%; left: 50%;
            transform: translate(-50%, -50%); color: ${color};
            font-weight: bold; z-index: 1000; pointer-events: none;
            animation: fadeUp 1.2s forwards; white-space: nowrap;
            text-shadow: 0 0 5px white;
        `;
        document.querySelector('.hero').appendChild(feedback);
        setTimeout(() => feedback.remove(), 1200);
    }

    recognition.onend = () => {
        isListening = false;
        const btn = document.getElementById('mic-toggle');
        if (btn) btn.classList.remove('active');
    };
}

function toggleVoice() {
    const btn = document.getElementById('mic-toggle');
    if (!btn) return;
    if (!isListening) {
        recognition.start();
        isListening = true;
        btn.classList.add('active');
        btn.innerText = "🛑";
    } else {
        recognition.stop();
    }
}

function readAloud(text) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}

const quizContainer = document.getElementById('quiz-container');
const progressBar = document.getElementById('progress-bar');
const starAnchor = document.getElementById('star-anchor');

function initGrid() {
    const grid = document.getElementById('question-grid');
    grid.innerHTML = '';
    myQuestions.forEach((_, i) => {
        const box = document.createElement('div');
        box.className = 'nav-box';
        box.id = `nav-box-${i}`;
        box.innerText = i + 1;
        
        box.style.cursor = "pointer";
        box.onclick = () => jumpToQuestion(i);
        
        grid.appendChild(box);
    });
    updateGrid();
}

function updateGrid() {
    const isQuizFinished = userHistory.filter(Boolean).length === myQuestions.length;
    myQuestions.forEach((_, i) => {
        const box = document.getElementById(`nav-box-${i}`);
        if (!box) return;

        box.classList.remove('current');
        
        if (!isQuizFinished && i === currentQuestionIndex) {
            box.classList.add('current');
        }
        
        if (userHistory[i]) {
            box.classList.add(userHistory[i].isCorrect ? 'correct' : 'wrong');
        }
    });
    const pointsElement = document.getElementById('live-points');
    if (pointsElement) pointsElement.innerText = points;
}

function jumpToQuestion(index) {
    if (index === currentQuestionIndex || index >= myQuestions.length) return;

    const block = document.getElementById('current-block');
    if (block) block.classList.add('fade-out');
    
    setTimeout(() => {
        currentQuestionIndex = index;
        showQuestion(currentQuestionIndex);
        
        const newBlock = document.getElementById('current-block');
        if (newBlock) {
            newBlock.classList.remove('fade-out');
        }
    }, 400);
}

function showQuestion(index) {
    const q = myQuestions[index];
    const progressPercent = (index / myQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    const shapes = [
        // Triangle
        `<svg viewBox="0 0 100 100" width="60" height="60" fill="currentColor">
            <polygon points="50,15 92,85 8,85"/>
        </svg>`,
        
        // Circle
        `<svg viewBox="0 0 100 100" width="60" height="60" fill="currentColor">
            <circle cx="50" cy="50" r="42"/>
        </svg>`,
        
        // Square
        `<svg viewBox="0 0 100 100" width="55" height="55" fill="currentColor">
            <rect x="15" y="15" width="70" height="70"/>
        </svg>`,
        
        // Rectangle
        `<svg viewBox="0 0 100 100" width="80" height="55" fill="currentColor">
            <rect x="5" y="22" width="90" height="56"/>
        </svg>`
    ];

    const options = q.answers.map((ans, aIndex) => `
        <button class="answer-option-row opt-${aIndex}" onclick="handleAnswer(${aIndex})">
            <div class="option-content-wrapper">
                <span class="shape-label">${shapes[aIndex]}</span>
                <span class="option-text-label">${ans}</span>
            </div>
        </button>
    `).join('');

    quizContainer.innerHTML = `
        <div class="question-block" id="current-block">
            <h2 style="font-size: 2.25rem; margin-bottom: 25px">${q.question}</h2>

            <div style="display: flex; justify-content: center; margin-bottom: 30px;">
                <button class="read-aloud-btn" onclick="handleReadAloudClick(${index})" style="
                    align-items: center;
                    gap: 8px;
                    background: #f8f9fa;
                    border: 1px solid #ced4da;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 2rem;
                    cursor: pointer;
                    font-weight: 500;
                    color: #495057;
                    transition: all 0.2s ease;
                ">
                    <span style="font-size: 2rem;">🔊</span> Read Aloud
                </button>
            </div>

            <div class="options-grid-container">${options}</div>
        </div>
    `;

    updateGrid();
}

function handleReadAloudClick(index) {
    const questionText = myQuestions[index].question;
    const answers = myQuestions[index].answers;
    
    const shapeLabels = ["Triangle", "Circle", "Square", "Rectangle"];
    
    let fullTextToRead = `${questionText}. Your options are: `;
    
    answers.forEach((ans, aIndex) => {
        const shapeName = shapeLabels[aIndex] || "Option";
        fullTextToRead += `${shapeName}: ${ans}. `;
    });
    
    readAloud(fullTextToRead);
}

function burstStars() {
    const starEmojis = ['⭐', '🌟', '✨', '🔥', '💎'];
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.className = 'particle';
        star.innerText = starEmojis[Math.floor(Math.random() * starEmojis.length)];
        
        const x = (Math.random() - 0.5) * 400 + 'px';
        const y = (Math.random() - 0.5) * 400 + 'px';
        const r = Math.random() * 360 + 'deg';
        
        star.style.setProperty('--x', x);
        star.style.setProperty('--y', y);
        star.style.setProperty('--r', r);
        
        star.style.left = '50%';
        star.style.top = '50%';
        
        document.querySelector('.hero').appendChild(star);
        setTimeout(() => star.remove(), 800);
    }
}

function triggerStarAnimation() {
    const bar = document.getElementById('progress-bar');
    const wrapper = document.querySelector('.progress-wrapper');
    
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('div');
        star.className = 'bar-star';
        star.innerText = '⭐';
        
        const barWidth = bar.offsetWidth;
        const randomOffset = (Math.random() - 0.5) * 30;
        
        star.style.left = (barWidth + randomOffset) + 'px';
        star.style.animationDelay = (i * 0.1) + 's';

        wrapper.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 1200);
    }
}

window.handleAnswer = (selectedIndex) => {
    if (isListening) {
        recognition.stop();
        isListening = false;
    }
    
    const q = myQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    const block = document.getElementById('current-block');
    
    const answerNodes = block.querySelectorAll('.answer-option-row');
    const selectedNode = answerNodes[selectedIndex];

    if (isCorrect) {
        points += 10;
        selectedNode.style.backgroundColor = "#26890c";
        selectedNode.style.borderColor = "#27ae60";
        
        triggerStarAnimation();
        burstStars();
    } else {
        selectedNode.style.backgroundColor = "#e21b3c";
        selectedNode.style.borderColor = "#c0392b";
        
        block.classList.add('shake');
    }

    userHistory[currentQuestionIndex] = {
        question: q.question,
        userAns: q.answers[selectedIndex],
        correctAns: q.answers[q.correct],
        isCorrect: isCorrect
    };

    updateGrid();

    setTimeout(() => {
        block.classList.add('fade-out');
        
        setTimeout(() => {
            let nextIndex = -1;
            for (let i = currentQuestionIndex + 1; i < myQuestions.length; i++) {
                if (!userHistory[i]) {
                    nextIndex = i;
                    break;
                }
            }

            if (nextIndex === -1) {
                for (let i = 0; i < myQuestions.length; i++) {
                    if (!userHistory[i]) {
                        nextIndex = i;
                        break;
                    }
                }
            }

            if (nextIndex !== -1) {
                currentQuestionIndex = nextIndex;
                showQuestion(currentQuestionIndex);
            } else {
                showAllResults();
            }
            
        }, 500);
    }, 800);
};

function showAllResults() {
    burstStars();
    setTimeout(burstStars, 300);

    const backButton = document.getElementById('back-button-container');
    if (backButton) backButton.style.display = 'block';

    const voiceControls = document.getElementById('voice-controls-wrapper');
    if (voiceControls) voiceControls.style.display = 'none';

    const reviewHTML = userHistory.map((item, i) => {
        if (!item) {
            const missingQuestion = myQuestions[i] ? myQuestions[i].question : "Question";
            return `
                <div class="review-item" style="border-left: 6px solid #ccc; background: #f9f9f9;">
                    <h3>${missingQuestion}</h3>
                    <p style="color: #666;"><em>Question skipped</em></p>
                </div>
            `;
        }

        return `
            <div class="review-item" style="border-left: 6px solid ${item.isCorrect ? '#2ecc71' : '#e74c3c'}; padding: 15px; margin-bottom: 12px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: left;">
                <p style="margin:0; font-size: 0.75rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Question ${i + 1}</p>
                <h3 style="margin: 8px 0; color: #333; font-size: 1.1rem;">${item.question}</h3>
                
                <div style="margin-top: 10px;">
                    <span style="font-weight: bold; color: ${item.isCorrect ? '#2ecc71' : '#e74c3c'};">
                        Your Answer: ${item.userAns} ${item.isCorrect ? '✓' : '✗'}
                    </span>
                </div>

                ${!item.isCorrect ? `
                    <div class="correct" style="margin-top: 8px; padding: 8px; background: #e8f5e9; color: #2e7d32; border-radius: 4px; font-size: 0.9rem;">
                        <strong>Correct Answer:</strong> ${item.correctAns}
                    </div>
                ` : `
                    <div class="correct" style="margin-top: 8px; padding: 8px; background: #e3f2fd; color: #1565c0; border-radius: 4px; font-size: 0.9rem;">
                        Perfect! Keep it up!
                    </div>
                `}
            </div>
        `;
    }).join('');

    quizContainer.innerHTML = `
        <div class="results-page" style="padding: 20px; animation: fadeIn 0.8s ease-out;">
            <h1 style="color: #333; margin-bottom: 5px;">Quiz Complete!</h1>
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                <div style="background: #f39c12; color: white; padding: 10px 20px; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 10px rgba(243, 156, 18, 0.3);">
                    Points: ${points}
                </div>
                <div style="background: #9b59b6; color: white; padding: 10px 20px; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 10px rgba(155, 89, 182, 0.3);">
                    Stars: ${userHistory.filter(h => h.isCorrect).length}
                </div>
            </div>
            
            <div class="review-list" style="max-height: 450px; overflow-y: auto; padding: 10px; background: #f0f2f5; border-radius: 12px;">
                ${reviewHTML}
            </div>

            <p style="margin-top: 20px; font-size: 0.85rem; color: #888;">
                Scroll to review your performance
            </p>
        </div>
    `;

    document.getElementById('progress-bar').style.width = '100%';
}

initGrid();
showQuestion(currentQuestionIndex);