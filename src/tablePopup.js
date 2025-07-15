import gsap from 'gsap';

// Get DOM elements
const openPopupBtn = document.getElementById('openPopupBtn');
const closePopupBtn = document.getElementById('closePopupBtn');
const popup = document.getElementById('popup');
const popupImage = document.getElementById('popupImage');
const imageContainer = document.getElementById('imageContainer');

// Store the previously focused element
let previouslyFocusedElement = null;
let isAnimating = false;

// GSAP Timeline for animations
let openTimeline = gsap.timeline({ paused: true });
let closeTimeline = gsap.timeline({ paused: true });

// Initialize GSAP animations
function initAnimations() {
    // Set initial states
    gsap.set(popup, {
        visibility: 'hidden',
        opacity: 0
    });

    gsap.set(popupImage, {
        scale: 0.8,
        opacity: 0,
        rotation: -5
    });

    gsap.set(closePopupBtn, {
        scale: 0,
        opacity: 0,
        rotation: 180
    });

    // Open animation timeline
    openTimeline
        .set(popup, { visibility: 'visible' })
        .to(popup, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(popupImage, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.1")
        .to(closePopupBtn, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        }, "-=0.3");

    // Close animation timeline
    closeTimeline
        .to(closePopupBtn, {
            scale: 0,
            opacity: 0,
            rotation: -180,
            duration: 0.2,
            ease: "power2.in"
        })
        .to(popupImage, {
            scale: 0.8,
            opacity: 0,
            rotation: 5,
            duration: 0.4,
            ease: "back.in(1.7)"
        }, "-=0.1")
        .to(popup, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, "-=0.2")
        .set(popup, { visibility: 'hidden' });
}

// Function to open popup
function openPopup() {
    if (isAnimating) return;

    isAnimating = true;

    // Store the currently focused element
    previouslyFocusedElement = document.activeElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Play open animation
    openTimeline.restart();

    // Add event listeners after animation starts
    setTimeout(() => {
        closePopupBtn.focus();
        document.addEventListener('keydown', handleKeyDown);
        popup.addEventListener('click', handleBackdropClick);
        isAnimating = false;
    }, 100);
}

// Function to close popup
function closePopup() {
    if (isAnimating) return;

    isAnimating = true;

    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    popup.removeEventListener('click', handleBackdropClick);

    // Play close animation
    closeTimeline.restart();

    // Restore body scroll and focus after animation
    closeTimeline.call(() => {
        document.body.style.overflow = '';
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
        isAnimating = false;
    });
}

// Handle keyboard events
function handleKeyDown(event) {
    // Close popup on Escape key
    if (event.key === 'Escape') {
        closePopup();
    }

    // Trap focus within popup
    if (event.key === 'Tab') {
        const focusableElements = popup.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Handle backdrop click
function handleBackdropClick(event) {
    // Close popup if clicked outside the image
    if (event.target === popup) {
        closePopup();
    }
}

// Add hover animations for buttons
function initHoverAnimations() {
    // Open button hover effect
    openPopupBtn.addEventListener('mouseenter', () => {
        gsap.to(openPopupBtn, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    openPopupBtn.addEventListener('mouseleave', () => {
        gsap.to(openPopupBtn, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    // Close button hover effect
    closePopupBtn.addEventListener('mouseenter', () => {
        gsap.to(closePopupBtn, {
            scale: 1.1,
            rotation: 90,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    closePopupBtn.addEventListener('mouseleave', () => {
        gsap.to(closePopupBtn, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });
}

// Event listeners
openPopupBtn.addEventListener('click', openPopup);
closePopupBtn.addEventListener('click', closePopup);

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initHoverAnimations();
});
