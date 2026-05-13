document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // stop page reload

        // optional: you can check role here if needed
        const activeRole = document.querySelector('.role-btn.active')?.dataset.role;
        console.log("Logging in as:", activeRole);

        // redirect to index page
        window.location.href = "dashboard.html";
    });
});
