// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// Global variables
let scene, camera, renderer, particles, mouse, mouseX = 0, mouseY = 0;
let heroParticles = [];
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initThreeJS();
    initAnimations();
    initNavigation();
    initScrollEffects();
    initParticles();
    initSkillBars();
    initContactForm();
    initCursorEffects();
});

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const loaderPercentage = document.querySelector('.loader-percentage');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    preloader.style.display = 'none';
                    startMainAnimations();
                }
            });
        }
        loaderPercentage.textContent = Math.floor(progress) + '%';
    }, 50);
}

// Three.js initialization
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system
    createParticleSystem();
    
    // Mouse movement
    mouse = new THREE.Vector2();
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Start render loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Create particle system
function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.55, 0.5 + Math.random() * 0.25);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        // Mouse interaction
        particles.rotation.x += mouseY * 0.0005;
        particles.rotation.y += mouseX * 0.0005;
    }
    
    // Render
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start main animations after preloader
function startMainAnimations() {
    // Hero title animation
    gsap.timeline()
        .fromTo('.title-line', 
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" }
        )
        .fromTo('.hero-subtitle', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        )
        .fromTo('.name-text', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
        )
        .fromTo('.name-underline', 
            { opacity: 0, width: 0 },
            { opacity: 1, width: '100px', duration: 0.8, ease: "power2.out" },
            "-=0.3"
        )
        .fromTo('.hero-scroll', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
        );
    
    // Navbar animation
    gsap.fromTo('.navbar', 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Logo click to scroll to top
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof gsap !== 'undefined' && gsap.to) {
                gsap.to(window, {
                    duration: 0.6,
                    scrollTo: 0,
                    ease: "power2.out"
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                // Use GSAP if available, fallback to native scroll
                if (typeof gsap !== 'undefined' && gsap.to) {
                    gsap.to(window, {
                        duration: 0.6,
                        scrollTo: offsetTop,
                        ease: "power2.out"
                    });
                } else {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll-triggered animations
function initScrollEffects() {
    // About section animations
    gsap.fromTo('.about-card', 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Profile image animation
    gsap.fromTo('.profile-image', 
        { opacity: 0, scale: 0.8, rotation: -10 },
        { 
            opacity: 1, 
            scale: 1, 
            rotation: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Floating elements animation
    gsap.fromTo('.element', 
        { opacity: 0, scale: 0 },
        { 
            opacity: 1, 
            scale: 1, 
            duration: 1,
            stagger: 0.3,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Portfolio items animation
    gsap.fromTo('.portfolio-item', 
        { opacity: 0, y: 100, rotationX: -15 },
        { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.portfolio-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Skills category animation
    gsap.fromTo('.skill-category', 
        { opacity: 0, x: -50 },
        { 
            opacity: 1, 
            x: 0, 
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.skills-categories',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Tools grid animation
    gsap.fromTo('.tool-item', 
        { opacity: 0, scale: 0.8, y: 30 },
        { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.tools-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Contact section animation
    gsap.fromTo('.contact-text', 
        { opacity: 0, x: -50 },
        { 
            opacity: 1, 
            x: 0, 
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    gsap.fromTo('.contact-form', 
        { opacity: 0, x: 50 },
        { 
            opacity: 1, 
            x: 0, 
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Work section items animation
    gsap.fromTo('.work-item', 
        { opacity: 0, y: 80, scale: 0.9 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.work-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Section titles animation
    gsap.fromTo('.section-title', 
        { opacity: 0, y: 30 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// Particle effects
function initParticles() {
    const heroParticlesContainer = document.querySelector('.hero-particles');
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(255, 107, 157, 0.8), rgba(224, 86, 253, 0.4));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: 1;
        `;
        
        heroParticlesContainer.appendChild(particle);
        
        // Animate particles
        gsap.to(particle, {
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: Math.random() * 0.5 + 0.2,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: Math.random() * 2
        });
    }
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(bar, {
                    '--width': level + '%',
                    duration: 1.5,
                    ease: "power3.out"
                });
                
                gsap.set(bar, {
                    '--width': level + '%'
                });
                
                bar.style.setProperty('--width', level + '%');
                bar.querySelector('::after') && (bar.querySelector('::after').style.width = level + '%');
                
                // Animate the skill bar fill
                const afterElement = window.getComputedStyle(bar, '::after');
                gsap.fromTo(bar, 
                    { 
                        '--bar-width': '0%' 
                    },
                    { 
                        '--bar-width': level + '%', 
                        duration: 1.5,
                        ease: "power3.out"
                    }
                );
            }
        });
    });
    
    // Add CSS variable for skill bar animation
    const style = document.createElement('style');
    style.textContent = `
        .skill-level {
            --bar-width: 0%;
        }
        .skill-level::after {
            width: var(--bar-width) !important;
        }
    `;
    document.head.appendChild(style);
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animate submit button
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
        
        // Simulate form submission
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(45deg, #ff6b9d, #e056fd)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(45deg, #ff6b9d, #e056fd)';
                form.reset();
            }, 2000);
        }, 1500);
    });
    
    // Add focus effects to form inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Cursor effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255, 107, 157, 0.8), rgba(224, 86, 253, 0.4));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .skill-category, .tool-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Additional animations and effects
function initAnimations() {
    // Parallax effect for floating shapes
    gsap.to('.floating-shapes::before', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Portfolio item hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -10,
                rotationX: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                rotationX: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Skill category hover effects
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            gsap.to(category, {
                y: -5,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        category.addEventListener('mouseleave', () => {
            gsap.to(category, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Tool item hover effects
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Social links hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -3,
                rotation: 360,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Text reveal animation
function initTextReveal() {
    const textElements = document.querySelectorAll('.hero-title, .section-title');
    
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(50px)';
            element.appendChild(span);
            
            gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.05,
                ease: "power3.out"
            });
        });
    });
}

// Scroll to top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #ff6b9d, #e056fd);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(100px)';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: 0,
            ease: "power2.inOut"
        });
    });
}

// Initialize scroll to top
addScrollToTop();

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('*', { duration: 0.01 });
    }
}

// Initialize performance optimizations
optimizePerformance();

// Debug mode (remove in production)
if (window.location.hostname === 'localhost') {
    console.log('🎨 Hiba Alsaydeah Portfolio - Debug Mode Active');
    
    // Add debug controls
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
    `;
    debugPanel.innerHTML = `
        <div>FPS: <span id="fps">0</span></div>
        <div>Scroll: <span id="scroll">0</span></div>
        <div>Mouse: <span id="mouse">0, 0</span></div>
    `;
    document.body.appendChild(debugPanel);
    
    // Update debug info
    let fps = 0;
    let lastTime = performance.now();
    
    function updateDebug() {
        const now = performance.now();
        fps = Math.round(1000 / (now - lastTime));
        lastTime = now;
        
        document.getElementById('fps').textContent = fps;
        document.getElementById('scroll').textContent = Math.round(window.scrollY);
        document.getElementById('mouse').textContent = `${mouseX}, ${mouseY}`;
        
        requestAnimationFrame(updateDebug);
    }
    
    updateDebug();
} 

// Carousel functionality
const carouselImages = [
    'assets/carosel/1.png',
    'assets/carosel/2.png',
    'assets/carosel/3.png',
    'assets/carosel/4.png'
];

let currentSlide = 0;

function openCarousel() {
    const modal = document.getElementById('carouselModal');
    const dotsContainer = document.getElementById('carouselDots');
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create dots for each image
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => currentSlideToIndex(index);
        dotsContainer.appendChild(dot);
    });
    
    // Show first image
    currentSlide = 0;
    showSlide(currentSlide);
    
    // Show modal
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add ESC key listener
    document.addEventListener('keydown', escapeHandler);
}

function closeCarousel() {
    const modal = document.getElementById('carouselModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Remove ESC key listener
    document.removeEventListener('keydown', escapeHandler);
}

function escapeHandler(event) {
    if (event.key === 'Escape') {
        closeCarousel();
    }
}

function showSlide(index) {
    const carouselImage = document.getElementById('carouselImage');
    const dots = document.querySelectorAll('.carousel-dot');
    
    // Update image
    carouselImage.src = carouselImages[index];
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
    showSlide(currentSlide);
}

function currentSlideToIndex(index) {
    showSlide(index);
}

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('carouselModal');
    if (modal.style.display === 'block') {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        }
    }
});

// Close modal when clicking outside
document.getElementById('carouselModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeCarousel();
    }
});