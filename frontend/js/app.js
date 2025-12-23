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
        if (title) title.textContent = destination === 'shop' ? 'Sign In to Store' : 'Sign In to Track';
    }

    if (btnTrack) {
        btnTrack.addEventListener('click', () => showLogin('dashboard'));
    }

    if (btnStore) {
        btnStore.addEventListener('click', () => showLogin('shop'));
    }

    if (showSignUpBtn) {
        showSignUpBtn.addEventListener('click', function (e) {
            e.preventDefault(); // It's an a tag now
            welcomeScreen.style.display = 'none';
            signUpForm.style.display = 'flex';
        });
    }

    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', function () {
            signInForm.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        });
    }

    if (backToWelcomeBtn2) {
        backToWelcomeBtn2.addEventListener('click', function () {
            signUpForm.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        });
    }

    // Handle Sign In
    if (signInForm) {
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

    // --- Premium Validation Logic ---
    const validators = {
        username: (val) => val.length >= 3 ? "" : "Username must be at least 3 characters",
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Please enter a valid email address",
        phone: (val) => val.length >= 10 ? "" : "Enter a valid phone number (min 10 digits)",
        password: (val) => val.length >= 6 ? "" : "Password must be at least 6 characters"
    };

    function validateField(input) {
        const name = input.name;
        const val = input.value;
        const errorSpan = document.getElementById(`${name}-error`);
        const field = input.parentElement;

        if (!validators[name]) return true;

        const errorMsg = validators[name](val);

        if (errorMsg) {
            errorSpan.textContent = errorMsg;
            errorSpan.classList.add('show');
            field.classList.add('invalid');
            field.classList.remove('valid');
            return false;
        } else {
            errorSpan.textContent = "";
            errorSpan.classList.remove('show');
            field.classList.remove('invalid');
            field.classList.add('valid');
            return true;
        }
    }

    function checkPasswordStrength(password) {
        const meter = document.querySelector('.strength-meter');
        const bar = document.querySelector('.strength-bar');

        if (!password) {
            meter.style.display = 'none';
            return;
        }

        meter.style.display = 'block';
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        bar.className = 'strength-bar'; // reset
        if (strength === 1) bar.classList.add('strength-weak');
        if (strength === 2) bar.classList.add('strength-medium');
        if (strength >= 3) bar.classList.add('strength-strong');
    }

    // Add Real-time listeners
    if (signUpForm) {
        const inputs = signUpForm.querySelectorAll('input:not([type="submit"]):not([type="button"])');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
                if (input.name === 'password') checkPasswordStrength(input.value);
            });
            input.addEventListener('blur', () => validateField(input));
        });
    }

    // Modified Sign Up Submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const inputs = Array.from(this.querySelectorAll('input[name]'));
            const isFormValid = inputs.every(input => validateField(input));

            if (!isFormValid) return;

            const submitBtn = document.getElementById('signup-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const loader = submitBtn.querySelector('.loader');

            // Start Loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loader.style.display = 'block';

            const formData = {};
            inputs.forEach(input => formData[input.name] = input.value);

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();

                if (res.ok) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(data));

                    // Show success state on button
                    submitBtn.style.background = 'var(--success-color)';
                    loader.style.display = 'none';
                    btnText.textContent = 'Success!';
                    btnText.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(data.message || 'Registration failed');
                    // Reset button
                    submitBtn.disabled = false;
                    btnText.style.display = 'block';
                    loader.style.display = 'none';
                }
            } catch (err) {
                console.error(err);
                alert('Connection error. Is the server running?');
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                loader.style.display = 'none';
            }
        });
    }
});
