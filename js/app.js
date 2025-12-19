document.addEventListener('DOMContentLoaded', function () {
    const welcomeScreen = document.getElementById('welcome-screen');
    const signInForm = document.querySelector('.sign-in-form');
    const signUpForm = document.querySelector('.sign-up-form');
    const btnTrack = document.getElementById('btn-track');
    const btnStore = document.getElementById('btn-store');
    const showSignUpBtn = document.getElementById('show-signup-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    const backToWelcomeBtn2 = document.getElementById('back-to-welcome-2');

    const API_URL = 'http://localhost:5000/api/auth';
    
    let loginDestination = 'dashboard'; // Default

    // Toggle Functions
    function showLogin(destination) {
        loginDestination = destination;
        welcomeScreen.style.display = 'none';
        signInForm.style.display = 'flex';
        // Optimize title based on destination?
        const title = signInForm.querySelector('.title');
        if(title) title.textContent = destination === 'shop' ? 'Sign In to Store' : 'Sign In to Track';
    }

    if(btnTrack) {
        btnTrack.addEventListener('click', () => showLogin('dashboard'));
    }

    if(btnStore) {
        btnStore.addEventListener('click', () => showLogin('shop'));
    }

    if(showSignUpBtn) {
        showSignUpBtn.addEventListener('click', function (e) {
            e.preventDefault(); // It's an a tag now
            welcomeScreen.style.display = 'none';
            signUpForm.style.display = 'flex';
        });
    }

    if(backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', function () {
            signInForm.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        });
    }

    if(backToWelcomeBtn2) {
        backToWelcomeBtn2.addEventListener('click', function () {
            signUpForm.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        });
    }

    // Handle Sign In
    if(signInForm) {
        signInForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(data)); // Store full user object for dashboard

                    // Redirection Logic
                    if (loginDestination === 'shop') {
                        window.location.href = 'shop.html';
                    } else {
                        // Dashboard Logic
                        if (data.role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error. Is the server running?');
            }
        });
    }

    // Handle Sign Up
    if(signUpForm) {
        signUpForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = this.querySelector('input[name="username"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const password = this.querySelector('input[name="password"]').value;
            // Robustly checking for phone input presence
            const phoneInput = this.querySelector('input[name="phone"]');
            const phone = phoneInput ? phoneInput.value : "";

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, phone })
                });

                const data = await res.json();

                if (res.ok) {
                    // Auto-login after registration
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(data));

                    alert('Registration successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error. Is the server running?');
            }
        });
    }
});
