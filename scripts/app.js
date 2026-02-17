/**
 * GCT Website - Main Application
 * Core initialization and utilities
 */

// DOM Ready helper
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Page Loader
 */
class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');

        if (this.loader) {
            this.init();
        }
    }

    init() {
        // If page is already loaded
        if (document.readyState === 'complete') {
            this.hide();
            return;
        }

        // Standard load event
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });

        // Fallback: Force hide after 3 seconds max
        setTimeout(() => {
            if (!this.loader.classList.contains('hidden')) {
                this.hide();
            }
        }, 3000);
    }

    hide() {
        this.loader.classList.add('hidden');

        // Remove from DOM after transition
        setTimeout(() => {
            this.loader.remove();
        }, 500);
    }
}

/**
 * Counter Animation
 */
class CounterAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.dataset.target) || 0;
        this.duration = options.duration || 2000;
        this.started = false;

        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.started) {
                    this.started = true;
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const start = 0;
        const end = this.target;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);

            this.element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.element.textContent = end.toLocaleString();

                // Add suffix if exists
                const suffix = this.element.dataset.suffix || '';
                if (suffix) {
                    this.element.textContent += suffix;
                }
            }
        };

        requestAnimationFrame(update);
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form validation and submission
 */
function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const inputs = this.querySelectorAll('[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Handle form submission
                const formData = new FormData(this);
                console.log('Form submitted:', Object.fromEntries(formData));

                // Show success message
                const successMsg = this.querySelector('.form-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                }

                // Reset form
                this.reset();
            }
        });
    });
}

/**
 * Initialize all page functionality
 */
ready(() => {
    // Page loader
    new PageLoader();

    // Initialize counters
    document.querySelectorAll('[data-counter]').forEach(el => {
        new CounterAnimation(el);
    });

    // Smooth scroll
    initSmoothScroll();

    // Forms
    initForms();

    // FAQ Accordion
    initFAQ();

    // Testimonials Carousel
    initTestimonialCarousel();

    // Log initialization
    console.log('GCT Website initialized successfully');
});

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                // Toggle current
                item.classList.toggle('open');
            });
        }
    });
}

/**
 * Testimonials Carousel
 */
function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Auto-rotate every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);
}

// Footer managed by navigation.js

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PageLoader, CounterAnimation, generateFooter };
}
