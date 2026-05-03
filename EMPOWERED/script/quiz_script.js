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
    },
    {
        question: "Which decimal is larger: 0.5 or 0.05?",
        answers: ["0.5", "0.05", "They are equal", "None of the above"],
        correct: 0
    },
    {
        question: "How many centimeters are in 1 meter?",
        answers: ["100", "10", "50", "1000"],
        correct: 0
    },
    {
        question: "An angle that is less than 90 degrees is called:",
        answers: ["Acute", "Right", "Obtuse", "Straight"],
        correct: 0
    },
    {
        question: "What comes next in this pattern: 2, 4, 8, 16, ...?",
        answers: ["32", "24", "20", "30"],
        correct: 0
    },
    {
        question: "A rectangle has a length of 6 cm and a width of 4 cm. What is its perimeter?",
        answers: ["20", "24", "10", "12"],
        correct: 0
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
            btn.classList.add('shake');
            setTimeout(() => {
                btn.classList.remove('shake');
                btn.classList.remove('active');
                btn.innerText = "🎤";
                isListening = false;
            }, 400);
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
    if (!isListening) {
        recognition.start();
        isListening = true;
        btn.classList.add('active');
        btn.innerText = "🛑";
    } else {
        recognition.stop();
    }
}

const quizContainer = document.getElementById('quiz-container');
const progressBar = document.getElementById('progress-bar');
const starAnchor = document.getElementById('star-anchor');

function showQuestion(index) {
    const q = myQuestions[index];
    const progressPercent = (index / myQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;

    const shapes = ["▲", "●", "■", "█"];
    const options = q.answers.map((ans, aIndex) => `
        <label class="answer-option">
            <input type="radio" name="quiz-choice" onclick="handleAnswer(${aIndex})">
            <span class="shape-label">${shapes[aIndex]}</span> ${ans}
        </label>
    `).join('');

    quizContainer.innerHTML = `
        <div class="question-block" id="current-block">
            <button id="mic-toggle" class="mic-btn" onclick="toggleVoice()">🎤</button>
            <p style="font-size: 0.85rem; color: #555; background: #fff3cd; padding: 5px; border-radius: 5px;">
                Tip: Say <strong>"Triangle, Circle, Square, or Rectangle"</strong>
            </p>
            <h2>${q.question}</h2>
            <div class="options-container">${options}</div>
        </div>
    `;
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

const originalHandleAnswer = window.handleAnswer;
window.handleAnswer = (selectedIndex) => {
    if (isListening) {
        recognition.stop();
        isListening = false;
    }
    
    const q = myQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
    const block = document.getElementById('current-block');
    
    const answerNodes = block.querySelectorAll('.answer-option');
    const selectedNode = answerNodes[selectedIndex];

    if (isCorrect) {
        points += 10;
        selectedNode.style.backgroundColor = "#d4edda";
        selectedNode.style.borderColor = "#28a745";
        
        triggerStarAnimation();
        burstStars();
    } else {
        selectedNode.style.backgroundColor = "#f8d7da";
        selectedNode.style.borderColor = "#dc3545";
        selectedNode.style.color = "#721c24";
        
        block.classList.add('shake');
    }

    userHistory.push({
        question: q.question,
        userAns: q.answers[selectedIndex],
        correctAns: q.answers[q.correct],
        isCorrect: isCorrect
    });

    setTimeout(() => {
        block.classList.add('fade-out');
        
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < myQuestions.length) {
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

    const reviewHTML = userHistory.map((item, i) => {
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
                    <div style="margin-top: 8px; padding: 8px; background: #e8f5e9; color: #2e7d32; border-radius: 4px; font-size: 0.9rem;">
                        <strong>Correct Answer:</strong> ${item.correctAns}
                    </div>
                ` : `
                    <div style="margin-top: 8px; padding: 8px; background: #e3f2fd; color: #1565c0; border-radius: 4px; font-size: 0.9rem;">
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

showQuestion(currentQuestionIndex);