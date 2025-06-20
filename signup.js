document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    const signupForm = getElement('signup-form');
    const signupName = getElement('signup-name');
    const signupEmail = getElement('signup-email');
    const signupPassword = getElement('signup-password');

    // --- Google OAuth Function ---
    const signupWithGoogle = () => {
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
    const handleSignup = async (e) => {
        e.preventDefault();
        
        const name = signupName.value;
        const email = signupEmail.value;
        const password = signupPassword.value;
        
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
                showMessage('Account created successfully! Redirecting to sign in...', 'success');
                // Redirect to signin page after successful signup
                setTimeout(() => {
                    window.location.href = '/signin.html';
                }, 2000);
            } else {
                showMessage(data.msg || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage('Signup failed. Please try again.', 'error');
        }
    };

    // --- Form Setup ---
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
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

    // Make Google signup function globally available
    window.signupWithGoogle = signupWithGoogle;
}); 