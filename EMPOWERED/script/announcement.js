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