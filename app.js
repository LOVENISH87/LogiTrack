// Handle form submissions
document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.querySelector('.sign-in-form');
    const signUpForm = document.querySelector('.sign-up-form');

    // Handle Sign In
    signInForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[name="login"]').value;
        const password = this.querySelector('input[name="password"]').value;

        // Get stored users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('userEmail', user.email);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    });

    // Handle Sign Up
    signUpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = this.querySelector('input[name="username"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password = this.querySelector('input[name="password"]').value;

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        // Add new user
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please sign in.');

        // Clear form and show sign in form
        this.reset();
        document.querySelector('.sign-up-form').style.display = 'none';
        document.querySelector('.sign-in-form').style.display = 'block';
    });

    // Back to welcome buttons
    document.getElementById('back-to-welcome').addEventListener('click', function () {
        document.querySelector('.sign-in-form').style.display = 'none';
        document.querySelector('.welcome-text').style.display = 'block';
    });

    document.getElementById('back-to-welcome-2').addEventListener('click', function () {
        document.querySelector('.sign-up-form').style.display = 'none';
        document.querySelector('.welcome-text').style.display = 'block';
    });
}); 