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

    // Remove loading screen
    removeLoadingScreen();

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
        
        // Calculate opacity based on scroll position
        const distanceFromTop = rect.top;
        const sectionHeight = rect.height;
        
        let opacity = 1;
        
        if (distanceFromTop < -sectionHeight) {
            opacity = 0;
        } else if (distanceFromTop > viewportHeight) {
            opacity = 0;
        } else {
            opacity = 1 - Math.abs(distanceFromTop / viewportHeight);
        }
        
        // Apply only opacity, no transform
        section.style.opacity = opacity;
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Modify your event listener to ensure loading screen is removed
window.addEventListener('load', () => {
    init();
    removeLoadingScreen(); // Add extra call here for safety
});

// Add a timeout as a fallback
setTimeout(removeLoadingScreen, 3000); // Fallback after 3 seconds

// Remove or combine duplicate style declarations
// Keep only one style declaration and combine all the styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    /* Navigation dots styles */
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

    /* Loading screen styles */
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }

    .loader {
        text-align: center;
    }

    .loader-text {
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .progress-bar {
        width: 200px;
        height: 2px;
        background: rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
    }

    .progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 50%;
        background: var(--primary);
        animation: progress 1s infinite linear;
    }

    @keyframes progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
    }

    /* Section styles */
    section {
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.8s ease, visibility 0.8s;
    }

    section.active {
        visibility: visible;
        opacity: 1;
        z-index: 1;
    }

    #about {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    #about .section-content {
        min-height: 100%;
        padding-bottom: 2rem;
    }

    .scroll-reminder::after {
        content: '↓';
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 24px;
        color: var(--primary);
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-10px); }
    }

    #about .section-content {
        height: 100vh;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding-top: 80px;
        padding-bottom: 40px;
    }

    .scroll-reminder::after {
        content: '↓ Scroll to continue';
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: var(--dark);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        animation: bounce 1s infinite;
        z-index: 1000;
    }
`;
document.head.appendChild(styleSheet);

// Update the loading screen removal function
function removeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        const statusMessage = loadingScreen.querySelector('.status-message');
        const percentage = loadingScreen.querySelector('.percentage');
        let progress = 0;
        
        // Array of loading messages
        const messages = [
            'Initializing system...',
            'Loading components...',
            'Configuring modules...',
            'Starting background processes...',
            'Preparing user interface...',
            'Almost ready...',
            'System ready!'
        ];
        
        let messageIndex = 0;
        
        // Update progress and messages
        const updateLoader = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 1;
            if (progress > 100) progress = 100;
            
            percentage.textContent = progress;
            
            if (progress >= (messageIndex + 1) * (100 / messages.length)) {
                if (messageIndex < messages.length - 1) {
                    statusMessage.style.animation = 'glitch 0.3s ease';
                    setTimeout(() => {
                        statusMessage.style.animation = '';
                        statusMessage.textContent = messages[++messageIndex];
                    }, 300);
                }
            }
            
            if (progress === 100) {
                clearInterval(updateLoader);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
        }, 150);
    }
}

// Clean up
window.addEventListener('unload', () => {
    cancelAnimationFrame(animationFrameId);
    scene.dispose();
    renderer.dispose();
});

// Add to existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor - only for desktop
    if (window.innerWidth > 768 && window.matchMedia('(hover: hover)').matches) {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (cursor && follower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            });
        }
    }

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
        
        const nextSection = currentSection + direction;
        
        if (currentSection === 1 && direction > 0) {
            const aboutContent = document.querySelector('#about .section-content');
            const isAtBottom = Math.abs(
                aboutContent.scrollHeight - aboutContent.scrollTop - aboutContent.clientHeight
            ) <= 5;
            
            if (!isAtBottom) {
                aboutContent.classList.add('scroll-reminder');
                setTimeout(() => {
                    aboutContent.classList.remove('scroll-reminder');
                }, 1000);
                return;
            }
        }

        isAnimating = true;
        
        if (nextSection >= 0 && nextSection < sections.length) {
            // Use opacity for transitions instead of transforms
            sections[currentSection].style.opacity = '0';
            sections[currentSection].style.visibility = 'hidden';
            sections[currentSection].classList.remove('active');
            sections[currentSection].scrollTop = 0;
            
            setTimeout(() => {
                sections[nextSection].style.opacity = '1';
                sections[nextSection].style.visibility = 'visible';
                sections[nextSection].classList.add('active');
                currentSection = nextSection;
                updateNavDots();
                updateNavbarActiveState(sections[currentSection].id);
                
                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }, 300);
        } else {
            isAnimating = false;
        }
    }

    // Handle mouse wheel
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (currentSection === 1) { // About section
            const aboutSection = document.querySelector('#about');
            const aboutContent = aboutSection.querySelector('.section-content');
            
            if (e.deltaY > 0) { // Scrolling down
                if (aboutContent.scrollTop + aboutContent.clientHeight < aboutContent.scrollHeight) {
                    aboutContent.scrollTop += 50;
                    return;
                } else {
                    handleNavigation(1); // Go to next section when at bottom
                }
            } else { // Scrolling up
                if (aboutContent.scrollTop > 0) {
                    aboutContent.scrollTop -= 50;
                    return;
                } else {
                    handleNavigation(-1); // Go to previous section when at top
                }
            }
        } else {
        const direction = e.deltaY > 0 ? 1 : -1;
        handleNavigation(direction);
        }
    }, { passive: false });

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

    // Add function to update navbar active state
    function updateNavbarActiveState(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === sectionId);
        });
    }

    // Add scroll restoration for sections
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('scroll', (e) => {
            e.stopPropagation();
        });
    });

    // Add this to your existing JavaScript
    function handleAboutSection() {
        const aboutSection = document.querySelector('#about');
        const aboutContent = aboutSection.querySelector('.section-content');
        let canMoveNext = false;

        // Function to check if user has scrolled to bottom
        function isScrolledToBottom(element) {
            return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
        }

        // Add scroll event listener to about section
        aboutContent.addEventListener('scroll', () => {
            if (isScrolledToBottom(aboutContent)) {
                canMoveNext = true;
                aboutContent.classList.add('scrolled-complete');
            }
        });
    }

    // Initialize the about section handling
    document.addEventListener('DOMContentLoaded', () => {
        handleAboutSection();
    });

    // Add touch handling with horizontal scroll prevention
    window.addEventListener('touchmove', function(e) {
        if (currentSection === 1) {
            const aboutContent = document.querySelector('#about .section-content');
            if (aboutContent.scrollTop > 0 && 
                aboutContent.scrollTop + aboutContent.clientHeight < aboutContent.scrollHeight) {
                e.stopPropagation();
            }
        }
    }, { passive: true });
});

// Add this function to initialize section handling
function initializeSections() {
    const sections = document.querySelectorAll('section');
    let currentSection = 0;
    let isAnimating = false;
    let lastScrollTime = 0;
    
    // Set initial active section
    sections[0].classList.add('active');
    
    // Handle scroll within About section
    const aboutSection = document.querySelector('#about');
    aboutSection.addEventListener('scroll', function(e) {
        e.stopPropagation();
    });
    
    // Handle mouse wheel with improved scroll detection
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastScrollTime < 50) return; // Debounce scroll events
        lastScrollTime = now;
        
        if (currentSection === 1) { // About section
            const aboutContainer = document.querySelector('#about');
            const delta = e.deltaY;
            
            if (delta > 0) { // Scrolling down
                if (aboutContainer.scrollTop + aboutContainer.clientHeight < aboutContainer.scrollHeight) {
                    aboutContainer.scrollTop += 50; // Smooth scroll within about section
                    return;
                }
            } else { // Scrolling up
                if (aboutContainer.scrollTop > 0) {
                    aboutContainer.scrollTop -= 50;
                    return;
                }
            }
        }
        
        const direction = e.deltaY > 0 ? 1 : -1;
        handleNavigation(direction);
    }, { passive: false });
    
    // Handle touch events with improved detection
    let touchStartY = 0;
    let touchStartTime = 0;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    });
    
    window.addEventListener('touchmove', function(e) {
        if (currentSection === 1) {
            e.stopPropagation();
        }
    });
    
    window.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        
        // Only handle quick swipes
        if (touchDuration < 300) {
            const direction = touchStartY > touchEndY ? 1 : -1;
            if (Math.abs(touchStartY - touchEndY) > 50) {
                handleNavigation(direction);
            }
        }
    });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSections();
    // ... rest of your initialization code ...
});