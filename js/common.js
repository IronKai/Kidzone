// Common JavaScript functions for all pages

// Add floating animations to elements
document.addEventListener('DOMContentLoaded', function() {
    // Add random floating stars
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'floating-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 5 + 's';
            star.textContent = '✨';
            starsContainer.appendChild(star);
        }
    }
    
    // Add click sound to all buttons
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Prevent right-click (child safety)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
});

// Add CSS for floating stars
const style = document.createElement('style');
style.textContent = `
    .floating-star {
        position: absolute;
        font-size: 20px;
        animation: floatUp 10s linear infinite;
        pointer-events: none;
    }
    
    @keyframes floatUp {
        from {
            top: 100%;
            opacity: 1;
        }
        to {
            top: -10%;
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
