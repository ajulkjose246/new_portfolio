document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelector('.hero-content').style.transform = 
            `translate(${moveX}px, ${moveY}px)`;
    });

    // Add glitch effect to buttons
    const buttons = document.querySelectorAll('.cyber-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Add cursor glow effect
    const cursorGlow = document.querySelector('.cursor-glow');
    const gridBackground = document.querySelector('.grid-background');
    
    document.addEventListener('mousemove', (e) => {
        // Update cursor glow position with precise coordinates
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.pageX}px`;
            cursorGlow.style.top = `${e.pageY}px`;
        });
        
        // Calculate mouse position relative to center for other effects
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        // Move hero content (existing code)
        document.querySelector('.hero-content').style.transform = 
            `translate(${moveX}px, ${moveY}px)`;
            
        // Move grid background
        gridBackground.style.transform = 
            `perspective(1000px) 
             rotateX(${moveY}deg) 
             rotateY(${-moveX}deg)`;
    });

    // Optional: Add parallax effect to cursor glow
    document.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        cursorGlow.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.5}px)`;
    });

    // Add click effect
    const effectsContainer = document.querySelector('.click-effects-container');
    
    document.addEventListener('click', (e) => {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'click-effect';
        
        // Position the ripple
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        
        // Add to container
        effectsContainer.appendChild(ripple);
        
        // Remove after animation
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });

        // Optional: Add a quick flash effect to the cursor glow
        const cursorGlow = document.querySelector('.cursor-glow');
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => {
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    });

    // Custom Context Menu
    const contextMenu = document.querySelector('.custom-context-menu');
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Position the menu
        const x = e.clientX;
        const y = e.clientY;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        
        // Adjust position if menu would go outside window
        const xPos = x + menuWidth > winWidth ? winWidth - menuWidth - 5 : x;
        const yPos = y + menuHeight > winHeight ? winHeight - menuHeight - 5 : y;
        
        contextMenu.style.left = `${xPos}px`;
        contextMenu.style.top = `${yPos}px`;
        contextMenu.style.display = 'block';

        // Add glitch effect on open
        contextMenu.style.transform = 'translate(2px, -2px)';
        setTimeout(() => {
            contextMenu.style.transform = 'none';
        }, 50);
    });
    
    // Hide context menu when clicking elsewhere
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });
    
    // Handle context menu actions
    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            switch(action) {
                case 'copy':
                    navigator.clipboard.writeText(window.location.href);
                    break;
                case 'share':
                    // Add your share functionality
                    break;
                case 'view':
                    // Add your view source functionality
                    break;
                case 'contact':
                    window.location.href = '#contact';
                    break;
            }
        });
    });

    // Add hover effect for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('mouseover', () => {
            card.style.transform = `scale(1.02) translateY(-5px)`;
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Add this to your DOMContentLoaded event listener
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    // Update the cursor movement code to be smoother
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    function updateCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        // Smooth following effect for the outer circle
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        // Faster following for the inner dot
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        requestAnimationFrame(updateCursor);
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    updateCursor();

    // Add hover effect for clickable elements
    document.querySelectorAll('a, button, .card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderWidth = '3px';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderWidth = '2px';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Profile Card Popup functionality
    const profileCard = document.querySelector('.profile-card');
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    document.body.appendChild(popupOverlay);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <button class="popup-close">&times;</button>
        <div class="popup-content">
            <div class="profile-header">
                <img src="./assets/img/user.jpg" alt="Profile Picture" class="profile-image">
                <h2>Ajul K Jose</h2>
                <h3>Web Developer | Designer | Flutter Developer</h3>
            </div>
            <div class="popup-body">
                <p>🚀 Greetings! I am a versatile digital artisan with a passion for shaping the virtual landscape. As a Web Developer, I orchestrate elegant symphonies of code, transforming concepts into interactive realities.</p>
                
                <p>Embracing the dual role of a Web Designer, I meticulously blend aesthetics with functionality, ensuring that each creation is a visual masterpiece. Fluttering into the mobile cosmos as a Flutter Developer, I craft apps that defy gravity, guided by the language of Dart.</p>
                
                <p>Beyond the binary realm, you'll find me exploring analog wonders, sipping on creativity, and penning down thoughts that refuse to be confined. With HTML, CSS, JavaScript, and Flutter as my tools of choice, I embark on a continuous learning journey, always ready for the next big challenge.</p>
                
                <p>Let's connect and explore the boundless possibilities of the digital realm together!</p>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    // Open popup
    profileCard.addEventListener('click', () => {
        popupOverlay.classList.add('active');
        popup.classList.add('active');
        
        // Add glitch effect on open
        popup.style.transform = 'translate(-50%, -50%) scale(0.95) translate(2px, -2px)';
        setTimeout(() => {
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);
    });

    // Close popup
    const closePopup = () => {
        popupOverlay.classList.remove('active');
        popup.classList.remove('active');
    };

    popup.querySelector('.popup-close').addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);

    // Prevent popup from closing when clicking inside it
    popup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Add hover effect for popup close button
    const closeButton = popup.querySelector('.popup-close');
    closeButton.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
    });

    // Animate statistics numbers
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Intersection Observer for stat cards
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-number');
                const endValue = parseInt(numberElement.dataset.target);
                animateValue(numberElement, 0, endValue, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    // GitHub username - replace with your username
    const githubUsername = 'ajulkjose246';

    // Fetch GitHub stats
    async function fetchGitHubStats() {
        try {
            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
            const userData = await userResponse.json();

            // Fetch repositories
            const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
            const reposData = await reposResponse.json();

            // Calculate total stars
            const totalStars = reposData.reduce((total, repo) => total + repo.stargazers_count, 0);

            // Update stats
            const statsToUpdate = {
                'Total Projects': reposData.length,
                'GitHub Stars': totalStars,
                'GitHub Followers': userData.followers
            };

            // Update each stat card with animation
            Object.entries(statsToUpdate).forEach(([label, value]) => {
                const statCard = Array.from(document.querySelectorAll('.stat-label')).find(el => el.textContent === label);
                if (statCard) {
                    const numberElement = statCard.previousElementSibling;
                    numberElement.dataset.target = value;
                    animateValue(numberElement, 0, value, 2000);
                }
            });

        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
        }
    }

    // Call the function to fetch GitHub stats
    fetchGitHubStats();

    // Add event listener to the "Projects" button
    document.querySelector('.projects-card').addEventListener('click', async () => {
        console.log('Projects button clicked');

        // Create popup elements
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <button class="popup-close">&times;</button>
            <div class="popup-content">
                <h2>My Projects</h2>
                <div class="projects-list"></div>
            </div>
        `;

        // Add popup elements to the body
        document.body.appendChild(popupOverlay);
        document.body.appendChild(popup);

        // Show popup with animation
        setTimeout(() => {
            popupOverlay.classList.add('active');
            popup.classList.add('active');
        }, 10);

        // Close popup function
        const closePopup = () => {
            popupOverlay.classList.remove('active');
            popup.classList.remove('active');
            setTimeout(() => {
                popupOverlay.remove();
                popup.remove();
            }, 300);
        };

        // Add close event listeners
        popup.querySelector('.popup-close').addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', closePopup);

        // Prevent popup from closing when clicking inside it
        popup.addEventListener('click', (e) => e.stopPropagation());

        try {
            const projectsList = popup.querySelector('.projects-list');
            projectsList.innerHTML = '<p>Loading projects...</p>';

            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
            console.log('Fetching projects from GitHub...');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const repos = await response.json();
            console.log('Projects fetched:', repos);

            projectsList.innerHTML = repos.map(repo => `
                <div class="project-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <span class="link-icon">📂</span> View on GitHub
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="project-link">
                                <span class="link-icon">🌐</span> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching projects:', error);
            popup.querySelector('.projects-list').innerHTML = 
                '<p>Failed to load projects. Please try again later.</p>';
        }
    });

    // Add event listener to the "Skills" card
    document.querySelector('.skills-card').addEventListener('click', () => {
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <button class="popup-close">&times;</button>
            <div class="popup-content">
                <h2>My Skills</h2>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h3>Professional Skills</h3>
                        <div class="skill-items">
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="Web Development">
                                <div class="skill-info">
                                    <span>Web Development</span>
                                    <div class="skill-bar" data-level="90"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="UI Design">
                                <div class="skill-info">
                                    <span>User Interface Design</span>
                                    <div class="skill-bar" data-level="85"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" alt="Flutter">
                                <div class="skill-info">
                                    <span>Flutter Development</span>
                                    <div class="skill-bar" data-level="80"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="skill-category">
                        <h3>Languages</h3>
                        <div class="skill-items">
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML">
                                <div class="skill-info">
                                    <span>HTML</span>
                                    <div class="skill-bar" data-level="95"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS">
                                <div class="skill-info">
                                    <span>CSS</span>
                                    <div class="skill-bar" data-level="90"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript">
                                <div class="skill-info">
                                    <span>JavaScript</span>
                                    <div class="skill-bar" data-level="85"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python">
                                <div class="skill-info">
                                    <span>Python</span>
                                    <div class="skill-bar" data-level="80"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP">
                                <div class="skill-info">
                                    <span>PHP</span>
                                    <div class="skill-bar" data-level="85"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="SQL">
                                <div class="skill-info">
                                    <span>SQL</span>
                                    <div class="skill-bar" data-level="80"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C">
                                <div class="skill-info">
                                    <span>C</span>
                                    <div class="skill-bar" data-level="75"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++">
                                <div class="skill-info">
                                    <span>C++</span>
                                    <div class="skill-bar" data-level="70"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" alt="BASH">
                                <div class="skill-info">
                                    <span>BASH</span>
                                    <div class="skill-bar" data-level="75"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" alt="Dart">
                                <div class="skill-info">
                                    <span>Dart</span>
                                    <div class="skill-bar" data-level="80"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="skill-category">
                        <h3>Frameworks</h3>
                        <div class="skill-items">
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" alt="Laravel">
                                <div class="skill-info">
                                    <span>Laravel</span>
                                    <div class="skill-bar" data-level="85"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap">
                                <div class="skill-info">
                                    <span>Bootstrap</span>
                                    <div class="skill-bar" data-level="90"></div>
                                </div>
                            </div>
                            <div class="skill-item">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="Django">
                                <div class="skill-info">
                                    <span>Django</span>
                                    <div class="skill-bar" data-level="75"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add popup elements to the body
        document.body.appendChild(popupOverlay);
        document.body.appendChild(popup);

        // Show popup with animation
        setTimeout(() => {
            popupOverlay.classList.add('active');
            popup.classList.add('active');
            
            // Animate skill bars
            popup.querySelectorAll('.skill-bar').forEach(bar => {
                const level = bar.dataset.level;
                setTimeout(() => {
                    bar.style.width = `${level}%`;
                }, 100);
            });
        }, 10);

        // Close popup function
        const closePopup = () => {
            popupOverlay.classList.remove('active');
            popup.classList.remove('active');
            setTimeout(() => {
                popupOverlay.remove();
                popup.remove();
            }, 300);
        };

        // Add close event listeners
        popup.querySelector('.popup-close').addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => e.stopPropagation());
    });

    document.querySelector('.contact-card').addEventListener('click', () => {
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
        <button class="popup-close">&times;</button>
        <div class="popup-content">
            <h2>Contact Me</h2>
            <div class="contact-grid">
                <a href="mailto:mail.ajulkjose@gmail.com" class="contact-item">
                    <div class="contact-icon">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Email">
                    </div>
                    <div class="contact-info">
                        <h3>Email</h3>
                        <p>mail.ajulkjose@gmail.com</p>
                    </div>
                </a>

                <a href="https://github.com/ajulkjose246" target="_blank" class="contact-item">
                    <div class="contact-icon">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub">
                    </div>
                    <div class="contact-info">
                        <h3>GitHub</h3>
                        <p>@ajulkjose246</p>
                    </div>
                </a>

                <a href="https://www.linkedin.com/in/ajul-k-jose/" target="_blank" class="contact-item">
                    <div class="contact-icon">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn">
                    </div>
                    <div class="contact-info">
                        <h3>LinkedIn</h3>
                        <p>Ajul K Jose</p>
                    </div>
                </a>

                <a href="https://x.com/ajulkjose" target="_blank" class="contact-item">
                    <div class="contact-icon">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" alt="Twitter">
                    </div>
                    <div class="contact-info">
                        <h3>Twitter</h3>
                        <p>@ajulkjose</p>
                    </div>
                </a>

                <a href="https://www.instagram.com/_ajulkjose_/" target="_blank" class="contact-item">
                    <div class="contact-icon">
                        <img src="assets/icons/instagram.svg" alt="Instagram" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDBmM2ZmIiBkPSJNMTIgMEM4LjczIDAgOC4zMy4wMSA3LjA1LjA3IDUuNzguMTMgNC45LjMzIDQuMTUuNjNjLS43OC4zLTEuNDQuNy0yLjEgMS4zNy0uNjcuNjUtMS4wNyAxLjMyLTEuMzcgMi4xLS4zLjc1LS41IDEuNjMtLjU2IDIuOUMuMDEgOC4zMyAwIDguNzMgMCAxMnMuMDEgMy42Ny4wNyA0Ljk1Yy4wNiAxLjI3LjI2IDIuMTUuNTYgMi45LjMuNzguNyAxLjQ0IDEuMzcgMi4xLjY2LjY3IDEuMzIgMS4wNyAyLjEgMS4zNy43NS4zIDEuNjMuNSAyLjkuNTYgMS4yOC4wNiAxLjY4LjA3IDQuOTUuMDdzMy42Ny0uMDEgNC45NS0uMDdjMS4yNy0uMDYgMi4xNS0uMjYgMi45LS41Ni43OC0uMyAxLjQ0LS43IDIuMS0xLjM3LjY3LS42NiAxLjA3LTEuMzIgMS4zNy0yLjEuMy0uNzUuNS0xLjYzLjU2LTIuOS4wNi0xLjI4LjA3LTEuNjguMDctNC45NXMtLjAxLTMuNjctLjA3LTQuOTVjLS4wNi0xLjI3LS4yNi0yLjE1LS41Ni0yLjktLjMtLjc4LS43LTEuNDQtMS4zNy0yLjEtLjY2LS42Ny0xLjMyLTEuMDctMi4xLTEuMzctLjc1LS4zLTEuNjMtLjUtMi45LS41NkMxNS42Ny4wMSAxNS4yNyAwIDEyIDB6bTAgMi4xNmMzLjIgMCAzLjU4LjAxIDQuODUuMDcgMS4xNy4wNSAxLjgxLjI1IDIuMjMuNDIuNTYuMjIuOTYuNDggMS4zOC45LjQyLjQyLjY4LjgyLjkgMS4zOC4xNy40Mi4zNyAxLjA2LjQyIDIuMjMuMDYgMS4yNy4wNyAxLjY1LjA3IDQuODVzLS4wMSAzLjU4LS4wNyA0Ljg1Yy0uMDUgMS4xNy0uMjUgMS44MS0uNDIgMi4yMy0uMjIuNTYtLjQ4Ljk2LS45IDEuMzgtLjQyLjQyLS44Mi42OC0xLjM4LjktLjQyLjE3LTEuMDYuMzctMi4yMy40Mi0xLjI3LjA2LTEuNjUuMDctNC44NS4wN3MtMy41OC0uMDEtNC44NS0uMDdjLTEuMTctLjA1LTEuODEtLjI1LTIuMjMtLjQyLS41Ni0uMjItLjk2LS40OC0xLjM4LS45LS40Mi0uNDItLjY4LS44Mi0uOS0xLjM4LS4xNy0uNDItLjM3LTEuMDYtLjQyLTIuMjMtLjA2LTEuMjctLjA3LTEuNjUtLjA3LTQuODVzLjAxLTMuNTguMDctNC44NWMuMDUtMS4xNy4yNS0xLjgxLjQyLTIuMjMuMjItLjU2LjQ4LS45Ni45LTEuMzguNDItLjQyLjgyLS42OCAxLjM4LS45LjQyLS4xNyAxLjA2LS4zNyAyLjIzLS40MiAxLjI3LS4wNiAxLjY1LS4wNyA0Ljg1LS4wN3oiLz48cGF0aCBmaWxsPSIjMDBmM2ZmIiBkPSJNMTIgNS44M2MtMy40IDAtNi4xNyAyLjc3LTYuMTcgNi4xN3MyLjc3IDYuMTcgNi4xNyA2LjE3IDYuMTctMi43NyA2LjE3LTYuMTctMi43Ny02LjE3LTYuMTctNi4xN3ptMCAxMC4xN2MtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+'" />
                    </div>
                    <div class="contact-info">
                        <h3>Instagram</h3>
                        <p>@_ajulkjose_</p>
                    </div>
                </a>

                <a href="tel:+918078234246" class="contact-item">
                    <div class="contact-icon">
                        <img src="assets/icons/phone.svg" alt="Phone" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDBmM2ZmIiBkPSJNMjAuMDEgMTUuMzhjLS4zOS0uMzktLjg5LS41NC0xLjM4LS40NC0uNDguMS0uOTcuMjgtMS40NS40NC0uNDMuMTQtLjg1LjMxLTEuMjUuNS0uMzUuMTYtLjY4LjM3LS45OS42MS0uMi4xNi0uNC4zMy0uNTcuNTMtLjI4LjMxLS41My42NC0uNzMgMS4wMS0uMjEuMzktLjM2LjgyLS40MiAxLjI2LS4wNi40NS0uMDYuOTEtLjAyIDEuMzYuMDQuNDUuMTIuOS4yNiAxLjMzLjE0LjQzLjMzLjg0LjU3IDEuMjIuMjQuMzguNTIuNzMuODUgMS4wMy4zMy4zMS43LjU2IDEuMTEuNzUuNDEuMi44NS4zMyAxLjI5LjQxLjQ1LjA4LjkuMTEgMS4zNS4wOS40NS0uMDIuOS0uMDkgMS4zMy0uMjIuNDMtLjEzLjg1LS4zMSAxLjI0LS41NC4zOS0uMjMuNzUtLjUgMS4wOC0uODIuMzMtLjMxLjYyLS42Ni44Ni0xLjA0LjI0LS4zOC40My0uNzkuNTYtMS4yMi4xMy0uNDMuMi0uODcuMjItMS4zMS4wMi0uNDQtLjAyLS44OS0uMTEtMS4zMi0uMDktLjQzLS4yNC0uODUtLjQ0LTEuMjQtLjItLjM5LS40NC0uNzYtLjczLTEuMDktLjI5LS4zMy0uNjItLjYyLS45OS0uODYtLjM3LS4yNC0uNzctLjQ0LTEuMTktLjU4LS40Mi0uMTQtLjg2LS4yNC0xLjMtLjI4LS40NC0uMDQtLjg5LS4wNC0xLjMzLjAxLS40NC4wNS0uODguMTUtMS4zLjMxLS40Mi4xNi0uODIuMzctMS4xOS42Mi0uMzcuMjUtLjcxLjU1LTEuMDEuODktLjMuMzQtLjU2LjcyLS43NyAxLjEzLS4yMS40MS0uMzcuODUtLjQ3IDEuMy0uMS40NS0uMTUuOTEtLjE0IDEuMzcuMDEuNDYuMDguOTEuMjEgMS4zNS4xMy40NC4zMi44Ni41NiAxLjI1LjI0LjM5LjUzLjc1Ljg3IDEuMDYuMzQuMzIuNzEuNTkgMS4xMi44MS40MS4yMi44NC4zOSAxLjI5LjQ5LjQ1LjExLjkxLjE2IDEuMzcuMTYuNDYgMCAuOTEtLjA1IDEuMzYtLjE1LjQ0LS4xLjg4LS4yNiAxLjI5LS40Ny40MS0uMjEuNzktLjQ3IDEuMTItLjc4LjM0LS4zMS42My0uNjcuODYtMS4wNi4yMy0uMzkuNDEtLjgxLjUzLTEuMjUuMTItLjQ0LjE5LS44OS4yLTEuMzUuMDEtLjQ2LS4wNC0uOTEtLjE0LTEuMzUtLjEtLjQ0LS4yNi0uODctLjQ3LTEuMjctLjIxLS40LS40Ny0uNzctLjc4LTEuMXoiLz48L3N2Zz4='" />
                    </div>
                    <div class="contact-info">
                        <h3>Phone</h3>
                        <p>+91 8078234246</p>
                    </div>
                </a>
            </div>
        </div>
    `;

        // Add popup elements to the body
        document.body.appendChild(popupOverlay);
        document.body.appendChild(popup);

        // Show popup with animation
        setTimeout(() => {
            popupOverlay.classList.add('active');
            popup.classList.add('active');
        }, 10);

        // Close popup function
        const closePopup = () => {
            popupOverlay.classList.remove('active');
            popup.classList.remove('active');
            setTimeout(() => {
                popupOverlay.remove();
                popup.remove();
            }, 300);
        };

        // Add close event listeners
        popup.querySelector('.popup-close').addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => e.stopPropagation());
    });
});