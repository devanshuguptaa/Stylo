document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    const loginModal = getElement('login-modal');
    const signupModal = getElement('signup-modal');
    const authContainer = querySelector('.nav-auth');

    // --- Authentication Functions ---
    const showLoginModal = () => {
        if (loginModal) {
            loginModal.classList.add('show');
        }
    };

    const showSignupModal = () => {
        if (signupModal) {
            signupModal.classList.add('show');
        }
    };

    const hideLoginModal = () => {
        if (loginModal) {
            loginModal.classList.remove('show');
        }
    };

    const hideSignupModal = () => {
        if (signupModal) {
            signupModal.classList.remove('show');
        }
    };

    const loginWithGoogle = () => {
        window.location.href = '/auth/google';
    };

    const signupWithGoogle = () => {
        window.location.href = '/auth/google';
    };

    const showMessage = (message, type = 'info') => {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        if (type === 'success') {
            messageEl.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = '#ef4444';
        } else {
            messageEl.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    };

    // --- Modal Setup ---
    const setupAuthModals = () => {
        // Close buttons
        const loginClose = getElement('login-close');
        const signupClose = getElement('signup-close');
        
        if (loginClose) {
            loginClose.addEventListener('click', hideLoginModal);
        }
        
        if (signupClose) {
            signupClose.addEventListener('click', hideSignupModal);
        }
        
        // Click outside to close
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) hideLoginModal();
            });
        }
        
        if (signupModal) {
            signupModal.addEventListener('click', (e) => {
                if (e.target === signupModal) hideSignupModal();
            });
        }
        
        // Form submissions
        const loginForm = getElement('login-form');
        const signupForm = getElement('signup-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const email = getElement('login-email').value;
        const password = getElement('login-password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token in cookie
                document.cookie = `token=${data.token}; path=/; max-age=86400`;
                hideLoginModal();
                showMessage('Login successful! Redirecting...', 'success');
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            } else {
                showMessage(data.msg || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please try again.', 'error');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        const name = getElement('signup-name').value;
        const email = getElement('signup-email').value;
        const password = getElement('signup-password').value;
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                hideSignupModal();
                showMessage('Account created successfully! Please log in.', 'success');
            } else {
                showMessage(data.msg || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage('Signup failed. Please try again.', 'error');
        }
    };

    // --- Auth Button Setup ---
    const setupAuthEventListeners = () => {
        const loginBtn = getElement('login-btn');
        const signupBtn = getElement('signup-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginModal();
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSignupModal();
            });
        }
    };

    // --- Initialization ---
    const init = () => {
        setupAuthModals();
        setupAuthEventListeners();
    };

    init();

    // --- Responsive Navigation ---
    const hamburger = querySelector('.hamburger');
    const navLinks = querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Make functions globally available for onclick handlers
    window.showLoginModal = showLoginModal;
    window.showSignupModal = showSignupModal;
    window.loginWithGoogle = loginWithGoogle;
    window.signupWithGoogle = signupWithGoogle;
}); 