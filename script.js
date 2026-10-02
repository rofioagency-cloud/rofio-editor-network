// ==========================================
// CONFIGURATION
// ==========================================
// Google Form Action URL for Rofio Editor Network
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf5ocBlPWvjo2bdReHzzVZ9nuRcodO9OslKSHFq5GDHBsV07A/formResponse';

document.addEventListener('DOMContentLoaded', () => {
    // Segmented Control Logic
    const segments = document.querySelectorAll('.segment');
    const segmentInputs = document.querySelectorAll('.segment input');
    
    segmentInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            // Remove active class from all segments
            segments.forEach(seg => seg.classList.remove('active'));
            // Add active class to the checked one
            if(e.target.checked) {
                e.target.closest('.segment').classList.add('active');
            }
        });
    });

    // Form Submission Logic
    const form = document.getElementById('rofio-form');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const loader = submitBtn.querySelector('.loader');
    const successState = document.getElementById('success-state');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();



            // Basic validation for mobile number (already partially handled by HTML pattern)
            const mobileInput = document.getElementById('mobile');
            if (!mobileInput.value.match(/^\+?[0-9\s]{10,15}$/)) {
                alert('Please enter a valid mobile number.');
                mobileInput.focus();
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loader.style.display = 'block';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Prepare form data
            const formData = new FormData(form);

            try {
                // Submit to Google Forms using no-cors
                await fetch(GOOGLE_FORM_ACTION_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                // Since mode is no-cors, we won't get a readable response. 
                // We assume success if the fetch didn't throw a network error.
                
                // Hide form and show success state
                form.style.display = 'none';
                successState.style.display = 'block';

                // Optional: scroll to success state
                successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Clear the form for next time (optional but good practice)
                form.reset();
                
                // Reset active segments
                segments.forEach(seg => seg.classList.remove('active'));
                if (segments[0]) segments[0].classList.add('active');
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was a problem submitting your details. Please check your connection and try again.');
                
                // Revert button state
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                loader.style.display = 'none';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        });
    }
});
