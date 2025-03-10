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
        
        // Handle scrolling for About and Projects sections
        if ((currentSection === 1 || currentSection === 2) && direction > 0) {
            let currentContent;
            let sectionElement;
            
            if (currentSection === 1) {
                currentContent = document.querySelector('#about .about-content.scrollable-content');
                sectionElement = document.querySelector('#about');
            } else {
                currentContent = document.querySelector('#projects .section-content.scrollable-content');
                sectionElement = document.querySelector('#projects');
            }
            
            // Add null check here
            if (!currentContent || !sectionElement) {
                console.warn('Content elements not found');
                return;
            }
            
            // Different behavior for mobile and desktop
            if (window.innerWidth <= 991) {
                const totalHeight = sectionElement.scrollHeight;
                const viewportHeight = window.innerHeight;
                const scrollPosition = sectionElement.scrollTop;
                
                // Don't proceed to next section if not scrolled to bottom
                if (scrollPosition + viewportHeight < totalHeight - 10) {
                    // Add scroll reminder
                    sectionElement.classList.add('scroll-reminder');
                    setTimeout(() => {
                        sectionElement.classList.remove('scroll-reminder');
                    }, 1000);
                    return;
                }
            } else {
                // Desktop behavior
                const isAtBottom = Math.abs(
                    currentContent.scrollHeight - currentContent.scrollTop - currentContent.clientHeight
                ) <= 5;
                
                if (!isAtBottom) {
                    currentContent.classList.add('scroll-reminder');
                    setTimeout(() => {
                        currentContent.classList.remove('scroll-reminder');
                    }, 1000);
                    return;
                }
            }
        }

        isAnimating = true;
        
        if (nextSection >= 0 && nextSection < sections.length) {
            sections[currentSection].style.opacity = '0';
            sections[currentSection].style.visibility = 'hidden';
            sections[currentSection].classList.remove('active');
            
            // Reset scroll position
            const currentContent = sections[currentSection].querySelector('.scrollable-content');
            if (currentContent) {
                currentContent.scrollTop = 0;
            }
            
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

    // Update wheel event handler
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (currentSection === 1 || currentSection === 2) {
            let currentContent;
            
            if (currentSection === 1) {
                currentContent = document.querySelector('#about .about-content.scrollable-content');
            } else {
                currentContent = document.querySelector('#projects .section-content.scrollable-content');
            }
            
            if (!currentContent) {
                console.warn('Scrollable content not found');
                return;
            }
            
            if (e.deltaY > 0) { // Scrolling down
                const isAtBottom = Math.abs(
                    currentContent.scrollHeight - currentContent.scrollTop - currentContent.clientHeight
                ) <= 5;
                
                if (!isAtBottom) {
                    currentContent.scrollTop += 50;
                    return;
                } else {
                    handleNavigation(1);
                }
            } else { // Scrolling up
                if (currentContent.scrollTop > 0) {
                    currentContent.scrollTop -= 50;
                    return;
                } else {
                    handleNavigation(-1);
                }
            }
        } else {
            const direction = e.deltaY > 0 ? 1 : -1;
            handleNavigation(direction);
        }
    }, { passive: false });

    // Update touch event handlers
    let touchStartY = 0;
    let touchEndY = 0;
    let isTouching = false;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        isTouching = true;
    });

    window.addEventListener('touchmove', function(e) {
        if (!isTouching) return;
        
        if (currentSection === 1 || currentSection === 2) {
            const sectionElement = currentSection === 1 ? 
                document.querySelector('#about') : 
                document.querySelector('#projects');
                
            if (!sectionElement) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY;
            
            if (window.innerWidth <= 991) {
                if (deltaY > 0) { // Scrolling up
                    if (sectionElement.scrollTop + sectionElement.clientHeight < sectionElement.scrollHeight) {
                        e.stopPropagation();
                    }
                } else if (deltaY < 0) { // Scrolling down
                    if (sectionElement.scrollTop > 0) {
                        e.stopPropagation();
                    }
                }
            }
        }
    }, { passive: true });

    window.addEventListener('touchend', function(e) {
        if (!isTouching) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (currentSection === 1 || currentSection === 2) {
                const sectionElement = currentSection === 1 ? 
                    document.querySelector('#about') : 
                    document.querySelector('#projects');
                    
                if (!sectionElement) return;
                
                if (window.innerWidth <= 991) {
                    const isAtBottom = Math.abs(
                        sectionElement.scrollHeight - sectionElement.scrollTop - sectionElement.clientHeight
                    ) <= 5;
                    
                    if (deltaY > 0 && !isAtBottom) return; // Don't navigate if not at bottom
                    if (deltaY < 0 && sectionElement.scrollTop > 0) return; // Don't navigate if not at top
                }
            }
            
            handleNavigation(deltaY > 0 ? 1 : -1);
        }
        
        isTouching = false;
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
    const navLinks = document.querySelectorAll('.nav-link, .vw-btn');
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
        if (currentSection === 1 || currentSection === 2) {
            const currentContent = document.querySelector(
                `${currentSection === 1 ? '#about' : '#projects'} .section-content`
            );
            if (currentContent.scrollTop > 0 && 
                currentContent.scrollTop + currentContent.clientHeight < currentContent.scrollHeight) {
                e.stopPropagation();
            }
        }
    }, { passive: true });

    // Add this to your initialization code
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize mobile scroll handling
        if (window.innerWidth <= 991) {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.addEventListener('scroll', () => {
                    const totalHeight = aboutSection.scrollHeight;
                    const viewportHeight = window.innerHeight;
                    const scrollPosition = aboutSection.scrollTop;
                    
                    if (scrollPosition + viewportHeight >= totalHeight - 10) {
                        aboutSection.classList.add('scrolled-complete');
                    } else {
                        aboutSection.classList.remove('scrolled-complete');
                    }
                });
            }
        }
    });
});

// Add this function to initialize section handling
function initializeSections() {
    // Create an Intersection Observer for skill cards
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progressBar = skillCard.querySelector('.skill-progress');
                const percentage = skillCard.dataset.skill;
                
                // Animate the progress bar
                progressBar.style.width = `${percentage}%`;
                
                // Animate the percentage number
                const percentageSpan = skillCard.querySelector('.skill-percentage');
                let currentValue = 0;
                const duration = 1500; // Animation duration in milliseconds
                const increment = percentage / (duration / 16); // Update every 16ms (60fps)
                
                const updateCounter = () => {
                    if (currentValue < percentage) {
                        currentValue += increment;
                        if (currentValue > percentage) currentValue = percentage;
                        percentageSpan.textContent = `${Math.round(currentValue)}%`;
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                updateCounter();
                
                // Unobserve after animation
                skillObserver.unobserve(skillCard);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe all skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });

    // Create an observer for the about text
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the about text
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutObserver.observe(aboutText);
    }

    // Add scroll handling for projects section
    const projectsSection = document.querySelector('#projects .section-content');
    if (projectsSection) {
        projectsSection.addEventListener('scroll', () => {
            const isAtBottom = Math.abs(
                projectsSection.scrollHeight - projectsSection.scrollTop - projectsSection.clientHeight
            ) < 1;
            
            if (isAtBottom) {
                projectsSection.classList.add('scrolled-complete');
            } else {
                projectsSection.classList.remove('scrolled-complete');
            }
        });
    }
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeSections();
    // ... rest of your initialization code ...
});

// Add this to your existing JavaScript file
class Chatbot {
    constructor() {
        this.toggle = document.querySelector('.chatbot-toggle');
        this.box = document.querySelector('.chatbot-box');
        this.closeBtn = document.querySelector('.close-btn');
        this.input = document.querySelector('.chat-input');
        this.sendBtn = document.querySelector('.send-btn');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.suggestionChips = document.querySelectorAll('.chip');
        
        this.initializeEventListeners();
        this.botResponses = {
            greeting: [
                "Hello! 👋 I'm your portfolio assistant. How can I help you today?",
                "Hi there! 😊 Welcome to Ajul's portfolio. What would you like to know?"
            ],
            projects: [
                "I'd be happy to tell you about the projects! Would you like to know about specific technologies or see all projects?",
                "Great choice! Ajul has worked on various exciting projects. What type of projects interest you?"
            ],
            contact: [
                this.createContactResponse(),
                this.createContactResponse()
            ],
            social: [
                this.createSocialResponse(),
                this.createSocialResponse()
            ],
            default: [
                "I'm not sure I understand. Would you like to know about Ajul's projects, skills, or contact information?",
                "Let me know if you'd like to know about projects, skills, or how to get in touch with Ajul!"
            ]
        };
        
        // Add these new event listeners
        this.messagesContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
        
        this.messagesContainer.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
        
        // Prevent body scroll when touching chatbot
        this.box = document.querySelector('.chatbot-box');
        this.box.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    initializeEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
        
        this.suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => this.handleChipClick(chip.textContent));
        });
    }

    toggleChat() {
        this.box.classList.toggle('active');
        if (this.box.classList.contains('active')) {
            this.input.focus();
            if (this.messagesContainer.children.length === 0) {
                this.addMessage("Hi! 👋 I'm here to help you explore Ajul's portfolio. What would you like to know?", 'bot');
            }
        }
    }

    handleSend() {
        const message = this.input.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.generateResponse(message);
            this.input.value = '';
        }
    }

    handleChipClick(text) {
        const cleanText = text.toLowerCase();
        if (cleanText.includes('hello')) {
            this.addMessage(text, 'user');
            this.generateResponse('hello');
        } else if (cleanText.includes('projects')) {
            this.addMessage(text, 'user');
            this.generateResponse('projects');
        } else if (cleanText.includes('contact')) {
            this.addMessage(text, 'user');
            this.generateResponse('contact');
        }
    }

    createContactResponse() {
        return {
            text: "Here's how you can reach Ajul:",
            buttons: [
                {
                    text: "📧 Email: ajulkjose246@gmail.com",
                    url: "mailto:ajulkjose246@gmail.com",
                    icon: "fa-envelope"
                },
                {
                    text: "📱 Phone: +918078234246",
                    url: "tel:+918078234246",
                    icon: "fa-phone"
                }
            ]
        };
    }

    createSocialResponse() {
        return {
            text: "Connect with Ajul on social media:",
            buttons: [
                {
                    text: "GitHub",
                    url: "https://github.com/ajulkjose246",
                    icon: "fa-github"
                },
                {
                    text: "LinkedIn",
                    url: "https://www.linkedin.com/in/ajul-k-jose/",
                    icon: "fa-linkedin-in"
                },
                {
                    text: "Instagram",
                    url: "https://www.instagram.com/_ajulkjose_/",
                    icon: "fa-instagram"
                },
                {
                    text: "X (Twitter)",
                    url: "https://x.com/ajulkjose",
                    icon: "fa-x-twitter"
                }
            ]
        };
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        if (typeof content === 'string') {
            messageDiv.textContent = content;
        } else {
            // Create message with buttons
            const textDiv = document.createElement('div');
            textDiv.textContent = content.text;
            messageDiv.appendChild(textDiv);

            if (content.buttons) {
                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('message-buttons');
                
                content.buttons.forEach(button => {
                    const btnLink = document.createElement('a');
                    btnLink.href = button.url;
                    btnLink.target = "_blank";
                    btnLink.classList.add('message-button');
                    
                    const icon = document.createElement('i');
                    icon.classList.add('fas', button.icon);
                    btnLink.appendChild(icon);
                    
                    const text = document.createElement('span');
                    text.textContent = button.text;
                    btnLink.appendChild(text);
                    
                    buttonsDiv.appendChild(btnLink);
                });
                
                messageDiv.appendChild(buttonsDiv);
            }
        }

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateResponse(message) {
        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            let response;

            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = this.getRandomResponse('greeting');
            } else if (lowerMessage.includes('project')) {
                response = this.getRandomResponse('projects');
            } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
                response = this.getRandomResponse('contact');
            } else if (lowerMessage.includes('social') || lowerMessage.includes('github') || lowerMessage.includes('linkedin')) {
                response = this.getRandomResponse('social');
            } else {
                response = this.getRandomResponse('default');
            }

            this.addMessage(response, 'bot');
        }, 500);
    }

    getRandomResponse(type) {
        const responses = this.botResponses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Add this function to initialize scroll handlers
function initializeScrollHandlers() {
    const aboutContent = document.querySelector('#about .about-content.scrollable-content');
    const projectsContent = document.querySelector('#projects .section-content.scrollable-content');
    
    if (aboutContent) {
        aboutContent.addEventListener('scroll', () => {
            const isAtBottom = Math.abs(
                aboutContent.scrollHeight - aboutContent.scrollTop - aboutContent.clientHeight
            ) <= 5;
            
            if (isAtBottom) {
                aboutContent.classList.add('scrolled-complete');
            } else {
                aboutContent.classList.remove('scrolled-complete');
            }
        });
    }
    
    if (projectsContent) {
        projectsContent.addEventListener('scroll', () => {
            const isAtBottom = Math.abs(
                projectsContent.scrollHeight - projectsContent.scrollTop - projectsContent.clientHeight
            ) <= 5;
            
            if (isAtBottom) {
                projectsContent.classList.add('scrolled-complete');
            } else {
                projectsContent.classList.remove('scrolled-complete');
            }
        });
    }
}

// Initialize scroll handlers when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollHandlers();
    // ... rest of your initialization code ...
});