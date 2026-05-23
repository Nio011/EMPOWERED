document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const playlistItems = document.querySelectorAll('.playlist-item');
    const markDoneBtns = document.querySelectorAll('.mark-done-btn');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');

    // Map YouTube IDs to their respective HTML container elements
    const videoContainers = {
        'LBf2-yOfuyM': document.getElementById('videoContainer1'),
        'DZcQ06E6Q0Y': document.getElementById('videoContainer2'),
        'TQzWii-B25E': document.getElementById('videoContainer3')
    };

    // Map YouTube IDs to your new transcript filenames
    const transcriptFiles = {
        'LBf2-yOfuyM': 'vid1tran.txt',
        'DZcQ06E6Q0Y': 'vid2tran.txt',
        'TQzWii-B25E': 'vid3tran.txt'
    };

    // State tracker for completed videos
    const totalVideos = playlistItems.length;
    let completedVideos = new Set();

    // --- TRANSCRIPT FETCHING LOGIC ---
    async function loadTranscript(videoId) {
        const transcriptBox = document.getElementById(`transcript-${videoId}`);
        const fileName = transcriptFiles[videoId];

        if (transcriptBox && transcriptBox.getAttribute('data-loaded') === 'false') {
            try {
                const response = await fetch(`transcripts/${fileName}`);

                if (!response.ok) {
                    throw new Error(`Transcript file ${fileName} not found.`);
                }

                const text = await response.text();
                const formattedText = text.split('\n\n').map(p => `<p>${p}</p>`).join('');

                transcriptBox.innerHTML = formattedText;
                transcriptBox.setAttribute('data-loaded', 'true');
            } catch (error) {
                console.error('Error loading transcript:', error);
                transcriptBox.innerHTML = `
                    <p class="text-danger small mt-2">
                        Transcript currently unavailable. <br>
                        <em>Note: To fetch files locally, you must view this site through a local server (like VS Code Live Server), not directly from a file:// URL.</em>
                    </p>`;
            }
        }
    }

    // --- ACCESSIBILITY MENU LOGIC ---
    const accButton = document.querySelector('.accessibility-button');
    const accPanel = document.getElementById('accessibility-panel');
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const textSizeButtons = document.querySelectorAll('.text-size-button');

    const applyAccessibility = () => {
        if (typeof AccessibilitySettings !== 'undefined') {
            AccessibilitySettings.apply();
            AccessibilitySettings.updateBodyClasses();
        }
    };

    applyAccessibility();

    if (accButton && accPanel) {
        accButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = accPanel.classList.toggle('open');
            accButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    document.addEventListener('click', (event) => {
        if (accPanel && accButton && !event.target.closest('.accessibility-menu')) {
            accPanel.classList.remove('open');
            accButton.setAttribute('aria-expanded', 'false');
        }
    });

    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', () => {
            if (typeof AccessibilitySettings !== 'undefined') {
                AccessibilitySettings.updateBodyClasses();
                AccessibilitySettings.save();
            }
        });
    }

    textSizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            textSizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (typeof AccessibilitySettings !== 'undefined') {
                AccessibilitySettings.updateBodyClasses();
                AccessibilitySettings.save();
            }
        });
    });

    loadTranscript('LBf2-yOfuyM');

    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            playlistItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');

            Object.values(videoContainers).forEach(container => {
                if (container) container.classList.add('d-none');
            });

            const targetVideoId = this.getAttribute('data-video-id');
            if (videoContainers[targetVideoId]) {
                videoContainers[targetVideoId].classList.remove('d-none');
                loadTranscript(targetVideoId);
            }
        });
    });

    markDoneBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-target');
            const playlistItem = document.querySelector(`.playlist-item[data-video-id="${videoId}"]`);
            const iconElement = playlistItem.querySelector('.icon');

            if (completedVideos.has(videoId)) {
                completedVideos.delete(videoId);
                this.innerHTML = 'Mark as Done';
                this.classList.remove('btn-success');
                this.classList.add('btn-outline-success');

                if (playlistItem) {
                    playlistItem.classList.remove('completed');
                    iconElement.innerHTML = '▶';
                }
            } else {
                completedVideos.add(videoId);
                this.innerHTML = '✓ Completed';
                this.classList.remove('btn-outline-success');
                this.classList.add('btn-success');

                if (playlistItem) {
                    playlistItem.classList.add('completed');
                    iconElement.innerHTML = '✓';
                }
            }

            updateProgress();
        });
    });

    function updateProgress() {
        const count = completedVideos.size;
        const percentage = Math.round((count / totalVideos) * 100);

        if (progressText && progressBar) {
            progressText.textContent = `${count} of ${totalVideos} completed`;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
        }
    }

    updateProgress();
});