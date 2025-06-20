document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!formStatus) return;

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value,
            };

            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#555';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.msg || 'An unknown error occurred.');
                }

                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = 'green';
                contactForm.reset();

            } catch (error) {
                formStatus.textContent = `Error: ${error.message}`;
                formStatus.style.color = 'red';
            }
        });
    }
}); 