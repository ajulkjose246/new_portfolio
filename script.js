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
        // Update cursor glow position
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        
        // Calculate mouse position relative to center
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
});
