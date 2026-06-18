// ── Contact Form Validation & Submission ─────────────────────

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contact-lead-form');
    if (!form) return;

    const successMsg = document.getElementById('form-success');
    const submitBtn = document.getElementById('contact-submit');

    function showError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.add('error');
        if (error) error.textContent = message;
    }

    function clearError(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.remove('error');
        if (error) error.textContent = '';
    }

    function normalizePhone(raw) {
        if (!raw) return '';
        // Keep leading + only; strip the rest to digits.
        const trimmed = String(raw).trim();
        const hasPlus = trimmed.startsWith('+');
        const digits = trimmed.replace(/\D/g, '');
        return hasPlus ? `+${digits}` : digits;
    }

    function isGhanaLocal10(msisdnDigits) {
        // Ghana local format: 10 digits, starts with 0
        // Examples: 024XXXXXXXX, 050XXXXXXXX
        return /^0\d{9}$/.test(msisdnDigits);
    }

    function isGhanaInternationalWithoutPlus233(phoneNormalized) {
        // Ghana international sometimes entered without '+' : 233XXXXXXXX (12 digits total)
        return /^233\d{9}$/.test(phoneNormalized);
    }

    function isGhanaInternational233(phoneNormalized) {
        // Ghana international format: +233XXXXXXXX (or without '+': 233XXXXXXXX)
        // 233 + 9 digits = 12 digits total.
        const digits = phoneNormalized.replace(/^\+/, '');
        return /^233\d{9}$/.test(digits);
    }

    function isInternationalGeneric(phoneNormalized) {
        // Allow common international numbers as a fallback.
        const digits = phoneNormalized.replace(/^\+/, '');
        // Require at least 10 digits overall (covers most E.164 numbers).
        return digits.length >= 10 && digits.length <= 15;
    }

    function isValidMobile(phoneRaw) {
        const phoneNormalized = normalizePhone(phoneRaw);
        const digitsOnly = phoneNormalized.replace(/^\+/, '');

        if (isGhanaLocal10(digitsOnly)) return true;
        if (isGhanaInternational233(phoneNormalized)) return true;
        // Also accept entered without '+' (just digits starting with 233)
        if (isGhanaInternationalWithoutPlus233(phoneNormalized)) return true;
        return isInternationalGeneric(phoneNormalized);
    }

    // Live validation on change
    document.getElementById('contact-name')?.addEventListener('input', function () {
        if (this.value.trim().length >= 2) clearError('contact-name', 'name-error');
    });
    document.getElementById('contact-mobile')?.addEventListener('input', function () {
        if (isValidMobile(this.value)) clearError('contact-mobile', 'mobile-error');
    });
    document.getElementById('contact-email')?.addEventListener('input', function () {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) clearError('contact-email', 'email-error');
    });
    document.getElementById('contact-service')?.addEventListener('change', function () {
        if (this.value) clearError('contact-service', 'service-error');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let valid = true;
        clearError('contact-name', 'name-error');
        clearError('contact-mobile', 'mobile-error');
        clearError('contact-email', 'email-error');
        clearError('contact-service', 'service-error');
        document.getElementById('stage-error').textContent = '';

        const name = document.getElementById('contact-name').value.trim();
        const mobile = document.getElementById('contact-mobile').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const service = document.getElementById('contact-service').value;
        const stage = form.querySelector('input[name="stage"]:checked')?.value;


        if (!name || name.length < 2) {
            showError('contact-name', 'name-error', 'Please enter your full name.');
            valid = false;
        }
        if (!isValidMobile(mobile)) {
            showError('contact-mobile', 'mobile-error', 'Please enter a valid mobile number.');
            valid = false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('contact-email', 'email-error', 'Please enter a valid email address.');
            valid = false;
        }
        if (!service) {
            showError('contact-service', 'service-error', 'Please select a service.');
            valid = false;
        }
        if (!stage) {
            document.getElementById('stage-error').textContent = 'Please select your current business stage.';
            valid = false;
        }


        if (!valid) return;

        // Simulate submission
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Sending…';

        await new Promise(r => setTimeout(r, 1600));

        form.reset();
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Send My Brief';

        if (successMsg) {
            successMsg.hidden = false;
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Stage option visual selection
    document.querySelectorAll('.stage-opt input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('stage-error').textContent = '';
        });
    });

    // ── FAQ Accordion ─────────────────────────────────────────
    document.querySelectorAll('.faq-trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            var expanded = trigger.getAttribute('aria-expanded') === 'true';
            var bodyId = trigger.getAttribute('aria-controls');
            var body = document.getElementById(bodyId);

            // Close all others
            document.querySelectorAll('.faq-trigger').forEach(function(t) {
                var bId = t.getAttribute('aria-controls');
                var b = document.getElementById(bId);
                t.setAttribute('aria-expanded', 'false');
                if (b) b.style.maxHeight = '0';
            });

            // Toggle current
            if (!expanded) {
                trigger.setAttribute('aria-expanded', 'true');
                if (body) body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
});
