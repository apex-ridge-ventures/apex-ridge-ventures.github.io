// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize EmailJS - configuration will be injected by Jekyll
    const emailJSConfig = window.emailJSConfig || {
        publicKey: 'w5i-1EV356Io8ngsa',
        serviceId: 'service_z3qwo9p',
        templateId: 'template_24x05hi'
    };
    emailjs.init(emailJSConfig.publicKey);


    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Check if this is a same-page anchor link (contains #)
            if (href.includes('#') && (href.startsWith('/') || href.includes(window.location.hostname))) {
                // Extract the anchor from the URL (everything after #)
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                // Only prevent default and smooth scroll if we're on the same page and the target exists
                if (targetElement && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                // If target doesn't exist on current page, let browser navigate normally
            }
            // If it's an external link, let the browser handle it normally
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });

    // Intersection Observer for animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add staggered animation for children if they exist
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .tech-item, .contact-item, .stat-item, .feature-card, .metric-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-child');
        observer.observe(el);
    });

    // Hero floating cards animation enhancement
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05) rotate(2deg)';
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Product cards hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.3), 0 0 30px rgba(255, 255, 255, 0.1)';

            // Animate the icon
            const icon = this.querySelector('.product-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';

            const icon = this.querySelector('.product-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Tech stack items animation
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(360deg)';
                icon.style.transition = 'all 0.5s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // EmailJS Form handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const subject = this.querySelector('input[name="title"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Get submit button
            const submitButton = this.querySelector('.btn-primary');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // EmailJS send
            emailjs.sendForm(emailJSConfig.serviceId, emailJSConfig.templateId, this)
                .then((result) => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                    this.reset();
                }, (error) => {
                    console.error('Email failed to send:', error);
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    showNotification('Failed to send message. Please try again later.', 'error');
                });
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);

        // Click to close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Parallax effect for background shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');

        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add gradient animation to hero text
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        let opacity = 0.8;
        let direction = 0.01;
        setInterval(() => {
            opacity += direction;
            if (opacity >= 1) {
                direction = -0.01;
            } else if (opacity <= 0.6) {
                direction = 0.01;
            }
            gradientText.style.background = `linear-gradient(45deg,
                rgba(34, 211, 238, ${opacity}),
                rgba(6, 182, 212, ${opacity + 0.1}),
                rgba(8, 145, 178, ${opacity}))`;
            gradientText.style.backgroundClip = 'text';
            gradientText.style.webkitBackgroundClip = 'text';
        }, 50);
    }

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksForHighlight.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    // Check if the link points to this section (extract anchor from URL)
                    if (href.includes('#') && href.split('#')[1] === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        .animate-child {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .animate-child.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            border-left: 4px solid #4CAF50;
        }

        .notification.error {
            border-left: 4px solid #F44336;
        }

        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        }

        .nav-link.active {
            color: #fff !important;
        }

        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    // Create floating particles system
    function createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: float-particle ${10 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }

        document.body.appendChild(particlesContainer);
        console.log('✨ Floating particles created');
    }

    // Initialize floating particles
    createFloatingParticles();

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';

        let index = 0;
        function typeText() {
            if (index < originalText.length) {
                if (originalText[index] === '<') {
                    // Skip HTML tags
                    const tagEnd = originalText.indexOf('>', index);
                    heroTitle.innerHTML += originalText.substring(index, tagEnd + 1);
                    index = tagEnd + 1;
                } else {
                    heroTitle.innerHTML += originalText[index];
                    index++;
                }
                setTimeout(typeText, 30);
            }
        }

        typeText();
    }

    // Add pulse animation to CTA buttons
    setInterval(() => {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(button => {
            button.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        });
    }, 5000);

    // Add pulse keyframe
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(pulseStyle);

    // Cookie Banner Functionality
    initializeCookieBanner();

    console.log('Apex Ridge Ventures website loaded successfully! 🚀');
});

// Cookie Banner Functions (defined outside DOMContentLoaded for global access)
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    if (!cookieBanner) return;

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');

    // Show banner only if no consent has been given
    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000); // Show after 2 seconds to be less intrusive
    }
}

function acceptCookies() {
    const cookieBanner = document.getElementById('cookieBanner');

    // Store consent in localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());

    // Hide banner with animation
    cookieBanner.classList.remove('show');
    cookieBanner.classList.add('hide');

    // Remove from DOM after animation
    setTimeout(() => {
        cookieBanner.remove();
    }, 600);

    console.log('Cookies accepted');
}

function dismissCookies() {
    const cookieBanner = document.getElementById('cookieBanner');

    // Store dismissal in localStorage (they haven't explicitly accepted, but we won't show again)
    localStorage.setItem('cookieConsent', 'dismissed');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());

    // Hide banner with animation
    cookieBanner.classList.remove('show');
    cookieBanner.classList.add('hide');

    // Remove from DOM after animation
    setTimeout(() => {
        cookieBanner.remove();
    }, 600);

    console.log('Cookie banner dismissed');
}