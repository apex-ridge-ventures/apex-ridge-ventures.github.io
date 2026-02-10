// Dynamic Hero Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Slider Management
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const totalSlides = slides.length;
    let slideInterval;
    let charts = {};
    let isTransitioning = false;
    let autoSlideTimeout;

    // Initialize Slider
    function initSlider() {
        if (slides.length === 0) return; // Exit if no slides found
        showSlide(0);
        startAutoSlide();
        initializeCharts();
    }

    // Show specific slide
    function showSlide(index, isManual = false) {
        // Prevent multiple simultaneous transitions
        if (isTransitioning) return;

        isTransitioning = true;

        // Stop auto-slide if manual navigation
        if (isManual) {
            stopAutoSlide();
            clearTimeout(autoSlideTimeout);
        }

        // Reset any ongoing chart animations
        resetChartAnimations();

        // Add transitioning class to all slides
        slides.forEach(slide => {
            slide.classList.add('transitioning');
            slide.classList.remove('active', 'prev');
        });
        navDots.forEach(dot => dot.classList.remove('active'));

        // Set current slide active
        slides[index].classList.add('active');
        navDots[index].classList.add('active');

        // Add prev class to previous slide for animation
        const prevIndex = currentSlide;
        if (prevIndex !== index && slides[prevIndex]) {
            slides[prevIndex].classList.add('prev');
        }

        currentSlide = index;

        // Remove transitioning class and animate content after transition
        setTimeout(() => {
            slides.forEach(slide => slide.classList.remove('transitioning'));
            isTransitioning = false;
            animateSlideContent(index);

            // Restart auto-slide if it was manual navigation
            if (isManual) {
                autoSlideTimeout = setTimeout(() => {
                    startAutoSlide();
                }, 3000); // 3 second delay before auto-slide resumes
            }
        }, 650); // Slightly longer than transition duration
    }

    // Reset chart animations when changing slides
    function resetChartAnimations() {
        // Reset dynamic line chart
        const mainPath = document.getElementById('mainPath');
        const areaPath = document.getElementById('areaPath');
        const clipRect = document.getElementById('clipRect');
        const dots = document.querySelectorAll('.data-dot');
        const labels = document.querySelectorAll('.value-label');

        if (mainPath) {
            mainPath.style.transition = 'none';
            mainPath.style.strokeDashoffset = '1000';
            mainPath.style.opacity = '1';
        }

        if (areaPath) {
            areaPath.style.transition = 'none';
            areaPath.style.opacity = '0';
        }

        if (clipRect) {
            clipRect.style.transition = 'none';
            clipRect.style.width = '0';
        }

        dots.forEach(dot => {
            dot.style.transition = 'none';
            dot.style.opacity = '0';
            dot.style.transform = 'scale(1)';
            dot.style.filter = '';
            dot.classList.remove('dot-appear');
        });

        labels.forEach(label => {
            label.style.opacity = '0';
            label.classList.remove('label-appear');
        });

        // Reset custom bars
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('animate'));
    }

    // Animate slide content
    function animateSlideContent(index) {
        if (index === 0) {
            // Animate 3D cube on slide 1
            animateCubeOnSlide();
        } else if (index === 1) {
            // Animate dynamic line chart on slide 2
            animateDynamicLineChart();
        } else if (index === 2) {
            // Animate custom bars on slide 3
            const bars = slides[index].querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.add('animate'));
        }

        // Update other charts if they exist
        if (charts[`slide${index}`] && index !== 1) {
            charts[`slide${index}`].update('active');
        }
    }

    // Dynamic Line Chart Animation
    function animateDynamicLineChart() {
        const chartContainer = document.getElementById('dynamicGrowthChart');
        const mainPath = document.getElementById('mainPath');
        const areaPath = document.getElementById('areaPath');
        const clipRect = document.getElementById('clipRect');
        const dots = document.querySelectorAll('.data-dot');
        const labels = document.querySelectorAll('.value-label');

        // Ensure chart container is visible
        if (chartContainer) {
            chartContainer.classList.add('chart-animate-in');
        }

        // Reset animation state
        mainPath.style.opacity = '1';
        mainPath.style.strokeDashoffset = '1000';
        areaPath.style.opacity = '0';
        dots.forEach(dot => {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(1)'; // Keep at normal size
            dot.classList.remove('dot-appear');
            dot.style.transition = 'none';
            dot.style.filter = ''; // Reset filter
        });
        labels.forEach(label => {
            label.style.opacity = '0';
            label.classList.remove('label-appear');
        });
        clipRect.style.width = '0';

        // Start the line drawing animation
        setTimeout(() => {
            mainPath.style.strokeDashoffset = '0';
            mainPath.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            // Animate the clip rectangle for area fill - start later to follow the line
            setTimeout(() => {
                clipRect.style.transition = 'width 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                clipRect.style.width = '600';
            }, 300);

            // Show area fill after line is mostly drawn
            setTimeout(() => {
                areaPath.style.transition = 'opacity 1s ease-out';
                areaPath.style.opacity = '0.8';
            }, 1800); // Start area fill near end of line drawing
        }, 200);

        // Animate dots and labels sequentially - following the line drawing
        dots.forEach((dot, index) => {
            const delay = 600 + (index * 200); // Start after line begins, 200ms between each dot

            setTimeout(() => {
                dot.classList.add('dot-appear');

                // Show label slightly after dot
                setTimeout(() => {
                    labels[index].classList.add('label-appear');
                }, 100);

                // Special effect for final dot only (2028 projection)
                if (index === dots.length - 1) {
                    setTimeout(() => {
                        dot.style.filter = 'drop-shadow(0 0 20px rgba(34, 211, 238, 1))';
                        dot.style.transition = 'filter 0.5s ease-out';

                        setTimeout(() => {
                            dot.style.filter = 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.8))';
                        }, 500);
                    }, 200);
                }
            }, delay);
        });

        console.log('🎬 Dynamic line chart animation started - dots appear at destination');
    }

    // Next slide
    function nextSlide(isManual = false) {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next, isManual);
    }

    // Previous slide
    function prevSlide(isManual = false) {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev, isManual);
    }

    // Auto slide
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        slideInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide(false);
            }
        }, 8000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // Initialize Charts
    function initializeCharts() {
        // Tech Stack Chart (Slide 4)
        const techCtx = document.getElementById('techChart');
        if (techCtx && typeof Chart !== 'undefined') {
            charts.slide3 = new Chart(techCtx, {
                type: 'doughnut',
                data: {
                    labels: ['React/Next.js', 'Linux', 'Python', 'Rust', 'PostgreSQL', 'Docker'],
                    datasets: [{
                        data: [25, 20, 18, 15, 12, 10],
                        backgroundColor: [
                            '#22d3ee',
                            '#06b6d4',
                            '#0891b2',
                            '#0e7490',
                            '#155e75',
                            '#164e63'
                        ],
                        borderWidth: 0,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'rgba(255, 255, 255, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                padding: 20,
                                font: { size: 12 }
                            }
                        }
                    },
                    elements: {
                        arc: {
                            borderWidth: 0,
                            hoverBorderWidth: 2
                        }
                    },
                    interaction: {
                        intersect: false
                    }
                }
            });
        }
    }

    // 3D Cube Mouse Interaction
    function initCubeInteraction() {
        const cubeContainer = document.getElementById('cubeContainer');
        const cubeScene = cubeContainer?.querySelector('.cube-scene');

        if (!cubeContainer || !cubeScene) return;

        let isInteracting = false;

        // Track mouse movement for cube interaction
        cubeContainer.addEventListener('mouseenter', () => {
            isInteracting = true;
            cubeScene.style.animationPlayState = 'paused';
        });

        cubeContainer.addEventListener('mouseleave', () => {
            isInteracting = false;
            cubeScene.style.animationPlayState = 'running';
            // Smooth return to base rotation
            cubeScene.style.transition = 'transform 1s ease-out';
            setTimeout(() => {
                cubeScene.style.transition = 'transform 0.3s ease-out';
            }, 1000);
        });

        cubeContainer.addEventListener('mousemove', (e) => {
            if (!isInteracting) return;

            const rect = cubeContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // Apply rotation based on mouse position
            const rotationY = mouseX * 30; // Max 30 degrees
            const rotationX = -mouseY * 20; // Max 20 degrees (inverted)

            cubeScene.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        });

        console.log('🎲 3D Cube interaction initialized');
    }

    // Enhanced cube animation on slide activation
    function animateCubeOnSlide() {
        const cubeContainer = document.getElementById('cubeContainer');
        if (cubeContainer && currentSlide === 0) {
            // Add special entrance effect for cube
            setTimeout(() => {
                const vertices = cubeContainer.querySelectorAll('.vertex');
                vertices.forEach((vertex, index) => {
                    vertex.style.animationDelay = `${index * 0.1}s`;
                });
            }, 800);
        }
    }

    // Debounced navigation functions
    let navigationTimeout;
    function debouncedNavigation(callback) {
        if (navigationTimeout) return; // Prevent rapid clicks

        navigationTimeout = setTimeout(() => {
            navigationTimeout = null;
        }, 700); // Match transition duration

        callback();
    }

    // Event Listeners
    const nextBtn = document.querySelector('.slide-next');
    const prevBtn = document.querySelector('.slide-prev');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            debouncedNavigation(() => nextSlide(true));
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            debouncedNavigation(() => prevSlide(true));
        });
    }

    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                debouncedNavigation(() => showSlide(index, true));
            }
        });
    });

    // Improved hover behavior
    let isHovered = false;
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoSlide();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            if (!isTransitioning) {
                startAutoSlide();
            }
        });
    }

    // Smooth scroll for navigation buttons
    function initSmoothScrolling() {
        const buttons = document.querySelectorAll('.slide-btn[href^="#"]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(button.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }


    // Initialize everything
    initSlider();
    initCubeInteraction();
    initSmoothScrolling();

    console.log('🎬 Dynamic Hero Slider Loaded');
    console.log('📊 Featuring animated charts and SaaS industry insights');
    console.log('🎲 Interactive 3D cube ready');
});