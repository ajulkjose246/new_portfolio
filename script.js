// Three.js setup
let scene, camera, renderer;
let animationFrameId;
let scrollY = 0;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    const velocityArray = new Float32Array(starCount);

    for(let i = 0; i < starCount * 3; i += 3) {
        // Create stars in a spiral pattern
        const radius = Math.random() * 50;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 50;
        
        posArray[i] = Math.cos(angle) * radius;     // X
        posArray[i + 1] = height;                   // Y
        posArray[i + 2] = Math.sin(angle) * radius; // Z
        
        // Add varying velocities for dynamic movement
        velocityArray[i/3] = Math.random() * 0.02 + 0.01;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: '#ffffff',
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Animation
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        // Smooth scroll effect
        const positions = starGeometry.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
            // Rotate stars based on their distance from center
            const radius = Math.sqrt(
                positions[i] * positions[i] + 
                positions[i + 2] * positions[i + 2]
            );
            const angle = Math.atan2(positions[i + 2], positions[i]);
            const velocity = velocityArray[i/3];
            
            // Update positions with smooth rotation
            positions[i] = Math.cos(angle + velocity) * radius;
            positions[i + 2] = Math.sin(angle + velocity) * radius;
        }
        starGeometry.attributes.position.needsUpdate = true;

        // Smooth camera movement based on scroll
        const targetZ = 30 + (scrollY * 0.01);
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        
        renderer.render(scene, camera);
    }

    animate();

    // Smooth scroll handler
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                scrollY = lastScrollY;
                updateSections();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Remove loading screen with fade
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);

    // Navbar hide/show on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('nav');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    // Section visibility
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function updateSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how far the section is through the viewport
        const distanceFromTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate opacity and transform based on scroll position
        let opacity = 1;
        let transform = 0;
        
        if (distanceFromTop < -sectionHeight) {
            opacity = 0;
        } else if (distanceFromTop > viewportHeight) {
            opacity = 0;
        } else {
            opacity = 1 - Math.abs(distanceFromTop / viewportHeight);
            transform = distanceFromTop * 0.2;
        }
        
        // Apply smooth transitions
        section.style.opacity = opacity;
        section.style.transform = `translateY(${transform}px)`;
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js scene when the page loads
window.addEventListener('load', init);

// Clean up
window.addEventListener('unload', () => {
    cancelAnimationFrame(animationFrameId);
    scene.dispose();
    renderer.dispose();
});

// Add to existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // Text rotation animation
    class TxtRotate {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        }
        
        tick() {
            const i = this.loopNum % this.toRotate.length;
            const fullTxt = this.toRotate[i];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

            let delta = 200 - Math.random() * 100;

            if (this.isDeleting) { delta /= 2; }

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(() => {
                this.tick();
            }, delta);
        }
    }

    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    let currentSection = 0;
    const sections = document.querySelectorAll('section');
    let isAnimating = false;
    
    // Set initial active section
    sections[0].classList.add('active');

    // Handle mouse wheel and touch events
    function handleNavigation(direction) {
        if (isAnimating) return;
        
        isAnimating = true;
        const nextSection = currentSection + direction;
        
        if (nextSection >= 0 && nextSection < sections.length) {
            // Remove active class from current section
            sections[currentSection].classList.remove('active');
            
            // Add active class to next section
            sections[nextSection].classList.add('active');
            
            currentSection = nextSection;
            
            // Update navigation dots if they exist
            updateNavDots();
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 800); // Match this with your CSS transition time
    }

    // Handle mouse wheel
    window.addEventListener('wheel', function(e) {
        const direction = e.deltaY > 0 ? 1 : -1;
        handleNavigation(direction);
    });

    // Handle touch events
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        
        const direction = touchStartY > touchEndY ? 1 : -1;
        if (Math.abs(touchStartY - touchEndY) > 50) { // Minimum swipe distance
            handleNavigation(direction);
        }
    });

    // Add navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'navigation-dots';
    
    sections.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            
            const direction = index - currentSection;
            handleNavigation(direction);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    document.body.appendChild(dotsContainer);

    // Update navigation dots
    function updateNavDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            handleNavigation(1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            handleNavigation(-1);
        }
    });

    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = Array.from(sections).findIndex(section => 
                section.id === targetId
            );
            
            if (targetIndex !== -1) {
                const direction = targetIndex - currentSection;
                handleNavigation(direction);
            }
        });
    });
});

// Add these styles for navigation dots
const style = document.createElement('style');
style.textContent = `
    .navigation-dots {
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 1000;
    }

    .nav-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .nav-dot.active {
        background: var(--primary);
        transform: scale(1.3);
    }

    .nav-dot:hover {
        background: var(--primary);
    }
`;
document.head.appendChild(style);
