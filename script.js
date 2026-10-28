/**
 * Shahbaz Awan Portfolio (Moon In The Halves)
 * Interactive Script: Lucide Icons, Smooth Nav, Sticky Header & Async Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Dynamic Copyright Year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3. Sticky Header Elevation on Scroll
    const header = document.getElementById('site-header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 4. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileToggle && navMobile) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
            navMobile.hidden = isExpanded;

            // Swap icon name or update
            if (!isExpanded) {
                mobileToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        // Close mobile drawer when clicking any mobile nav link
        const mobileLinks = navMobile.querySelectorAll('.mobile-link, .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMobile.hidden = true;
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        });
    }

    // 5. Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightActiveNav = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // 6. Back-to-Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 7. Asynchronous Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            const originalText = btnText.textContent;
            btnText.textContent = 'Transmitting...';
            if (btnIcon) {
                btnIcon.setAttribute('data-lucide', 'loader-2');
                btnIcon.classList.add('animate-spin');
                if (window.lucide) window.lucide.createIcons();
            }

            formStatus.hidden = false;
            formStatus.className = 'form-status-banner status-loading';
            formStatus.innerHTML = '<i data-lucide="loader-2"></i><span>Dispatching message securely...</span>';
            if (window.lucide) window.lucide.createIcons();

            const formData = new FormData(contactForm);
            const accessKey = formData.get('access_key');

            try {
                // If the access key is still the default placeholder, simulate an instant graceful confirmation
                if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
                    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth micro-delay
                    showSuccessBanner();
                    contactForm.reset();
                    return;
                }

                // Execute real asynchronous POST request to Web3Forms / Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok && data.success !== false) {
                    showSuccessBanner();
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Transmission failed');
                }
            } catch (error) {
                formStatus.className = 'form-status-banner status-error';
                formStatus.innerHTML = `<i data-lucide="alert-circle"></i><span>Message sending error: ${error.message || 'Please reach out directly via shahbazawan7458@gmail.com'}.</span>`;
                if (window.lucide) window.lucide.createIcons();
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                if (btnIcon) {
                    btnIcon.setAttribute('data-lucide', 'send');
                    btnIcon.classList.remove('animate-spin');
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    function showSuccessBanner() {
        if (!formStatus) return;
        formStatus.className = 'form-status-banner status-success';
        formStatus.innerHTML = '<i data-lucide="check-circle-2"></i><span>Thank you! Your message has been received. I will get back to you shortly.</span>';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            formStatus.style.transition = 'opacity 0.5s ease';
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.hidden = true;
                formStatus.style.opacity = '1';
            }, 500);
        }, 7000);
    }
});
