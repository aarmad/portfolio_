// Navigation
document.addEventListener('DOMContentLoaded', function () {
    // Header scroll effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // --- Anime.js Animations ---

    // 1. Hero Animation (only if exists)
    if (document.querySelector('.hero-title')) {
        anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        })
            .add({
                targets: '.hero-badge',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: 300
            })
            .add({
                targets: '.title-line',
                opacity: [0, 1],
                translateX: [-50, 0],
                delay: anime.stagger(150),
                offset: '-=800'
            })
            .add({
                targets: '.hero-description',
                opacity: [0, 1],
                translateY: [20, 0],
                offset: '-=600'
            })
            .add({
                targets: '.hero-actions .btn',
                opacity: [0, 1],
                scale: [0.9, 1],
                delay: anime.stagger(100),
                offset: '-=600'
            })
            .add({
                targets: '.floating-card',
                opacity: [0, 1],
                translateY: [40, 0],
                delay: anime.stagger(200),
                offset: '-=1000'
            });
    }

    // 2. Project filtering with Anime.js
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                // Animate out
                anime({
                    targets: '.project-item',
                    opacity: 0,
                    scale: 0.9,
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: function () {
                        projectItems.forEach(item => {
                            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });

                        // Animate in
                        anime({
                            targets: '.project-item[style*="display: block"]',
                            opacity: [0, 1],
                            scale: [0.95, 1],
                            translateY: [20, 0],
                            duration: 600,
                            delay: anime.stagger(100),
                            easing: 'easeOutElastic(1, .8)'
                        });
                    }
                });
            });
        });
    }

    // 3. Modern Intersection Observer with Anime.js
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');

                const type = entry.target.dataset.animation || 'fade-up';

                let animationProps = {
                    targets: entry.target,
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutExpo'
                };

                if (type === 'fade-up') animationProps.translateY = [30, 0];
                if (type === 'fade-left') animationProps.translateX = [-30, 0];
                if (type === 'fade-right') animationProps.translateX = [30, 0];

                anime(animationProps);

                // Animate SVG inside the card if it's a project/service card
                const svgPath = entry.target.querySelector('.project-icon svg path, .project-icon svg circle, .project-icon svg rect, .service-icon svg path');
                if (svgPath) {
                    anime({
                        targets: svgPath,
                        strokeDashoffset: [anime.setDashoffset, 0],
                        easing: 'easeInOutSine',
                        duration: 1500,
                        delay: 400
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const elementsToReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .project-card, .service-card, .timeline-item');
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';

        if (el.classList.contains('reveal-left')) el.dataset.animation = 'fade-left';
        else if (el.classList.contains('reveal-right')) el.dataset.animation = 'fade-right';
        else el.dataset.animation = 'fade-up';

        revealObserver.observe(el);
    });

    // 4. Interactive Hover Animations for SVGs (Smooth Flow)
    document.querySelectorAll('.project-card, .service-card').forEach(card => {
        const icon = card.querySelector('svg');
        if (!icon) return;

        card.addEventListener('mouseenter', () => {
            // Smooth pop and tilt
            anime({
                targets: icon,
                scale: 1.12,
                rotate: '6deg',
                duration: 500,
                easing: 'easeOutQuart'
            });

            // Redraw paths with staggering for fluidity
            const paths = icon.querySelectorAll('path, circle, rect, polyline');
            if (paths.length) {
                anime({
                    targets: paths,
                    strokeDashoffset: [anime.setDashoffset, 0],
                    easing: 'easeInOutSine',
                    duration: 700,
                    delay: anime.stagger(40)
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: icon,
                scale: 1,
                rotate: '0deg',
                duration: 400,
                easing: 'easeOutSine'
            });
        });
    });

    // Persistent ultra-smooth floating for icons
    anime({
        targets: '.project-icon svg, .service-icon svg',
        translateY: [-5, 5],
        duration: 3500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(400)
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', function () {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputs = contactForm.querySelectorAll('input, textarea');
            let allFilled = true;
            inputs.forEach(input => { if (!input.value) allFilled = false; });

            if (allFilled) {
                contactForm.style.display = 'none';
                formSuccess.classList.add('visible');
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.classList.remove('visible');
                }, 5000);
            }
        });
    }
});

// Animation pour la section WhatsApp
document.addEventListener('DOMContentLoaded', function () {
    // Animation du bouton WhatsApp au survol
    const whatsappBtn = document.querySelector('.whatsapp-btn');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
        });

        whatsappBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    }
});