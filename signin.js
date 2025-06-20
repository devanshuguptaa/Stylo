document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    const signinForm = getElement('signin-form');
    const signinEmail = getElement('signin-email');
    const signinPassword = getElement('signin-password');

    // --- Google OAuth Function ---
    const loginWithGoogle = () => {
        window.location.href = '/auth/google';
    };

    // --- Message Display Function ---
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

    // --- Form Submission Handler ---
    const handleSignin = async (e) => {
        e.preventDefault();
        
        const email = signinEmail.value;
        const password = signinPassword.value;
        
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

    // --- Form Setup ---
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }

    // --- Responsive Navigation ---
    const hamburger = querySelector('.hamburger');
    const navLinks = querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Make Google login function globally available
    window.loginWithGoogle = loginWithGoogle;
}); 