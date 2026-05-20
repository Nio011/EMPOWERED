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

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btn = document.querySelector('.btn-submit');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                dropZone.querySelector('p').innerHTML = `<strong>Selected:</strong> ${fileName}`;
            }
        });
    }
});

// 3. The Submit Button Function
function handleSubmission() {
    const fileInput = document.getElementById('file-input');
    const btn = document.querySelector('.btn-submit');

    if (fileInput.files.length === 0) {
        alert("Error: Please select a file first.");
        return;
    }

    btn.innerText = "Uploading...";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = "Turned In!";
        btn.style.background = "#2ecc71";
        alert("File submitted successfully!");
    }, 1500);
}