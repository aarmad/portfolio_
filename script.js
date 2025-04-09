document.addEventListener('DOMContentLoaded', () => {
    // Header et scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.style.background = window.scrollY > 50 
            ? "rgba(26, 26, 26, 0.95)" 
            : "rgba(26, 26, 26, 0.9)";
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            link.style.setProperty('--after-width', '100%');
        });
        
        link.addEventListener('mouseout', () => {
            link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--light');
            link.style.setProperty('--after-width', '0%');
        });
    });

    // Scroll interactions
    document.querySelectorAll('.scroll-indicator, .animated-arrow').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const target = trigger.classList.contains('scroll-indicator') 
                ? document.getElementById('mainContent') 
                : document.querySelector('.scroll-gallery');
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Galerie
    const galleryTemplate = document.getElementById('gallery-template');
    const galleryTrack = document.querySelector('.gallery-track');
    if(galleryTemplate && galleryTrack) {
        for(let i = 0; i < 3; i++) {
            galleryTrack.appendChild(galleryTemplate.content.cloneNode(true));
        }
        
        galleryTrack.addEventListener('mouseenter', () => {
            galleryTrack.style.animationPlayState = 'paused';
        });
        
        galleryTrack.addEventListener('mouseleave', () => {
            galleryTrack.style.animationPlayState = 'running';
        });
    }

    // Témoignages
    const speechBubble = document.getElementById('clientSpeech');
    if(speechBubble) {
        const testimonials = [
            "Réactivité exceptionnelle !",
            "Notre CA a augmenté de 150%",
            "Service client irréprochable"
        ];
        
        speechBubble.addEventListener('click', () => {
            speechBubble.textContent = testimonials[Math.floor(Math.random() * testimonials.length)];
            speechBubble.classList.add('active');
            setTimeout(() => speechBubble.classList.remove('active'), 2000);
        });
    }

    // Formulaire
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.querySelector('.success-message');
            if(successMessage) {
                successMessage.classList.add('visible');
                setTimeout(() => {
                    successMessage.classList.remove('visible');
                    contactForm.reset();
                }, 3000);
            }
        });
    }

    // Accessibilité
    ['.scroll-indicator', '.animated-arrow'].forEach(selector => {
        const el = document.querySelector(selector);
        if(el) {
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', 'Navigation vers le contenu');
            el.tabIndex = 0;
        }
    });

    // Ajouter dans le DOMContentLoaded
    document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        
        // Fermer tous les items
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Ouvrir l'item cliqué si besoin
        if(!isActive) {
            item.classList.add('active');
        }
    });

    // Animation au survol
    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        header.parentElement.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        header.parentElement.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// Accessibilité
document.querySelectorAll('.accordion-header').forEach(header => {
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');
    
    header.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') header.click();
    });
});

document.querySelectorAll('.accordion-item').forEach(item => {
    item.addEventListener('transitionend', () => {
        const header = item.querySelector('.accordion-header');
        header.setAttribute('aria-expanded', item.classList.contains('active'));
    });
});
});

// Animation au focus
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// Parallax effect
document.querySelector('.animated-form').addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
});

document.querySelector('.animated-form').addEventListener('mouseleave', (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg)';
});

// Ajouter dans le script existant
// Back to top
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});