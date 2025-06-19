// Global variables
let currentCarouselIndex = 0;
let currentModalIndex = 0;
let galleryImages = [];

// Gallery images data
const galleryData = [
    { src: '6ddcdd9a-e08b-46f3-86fa-72c4e0d2d072.jfif', caption: '🥰' },
    { src: '68c5e8a6-64a3-47ec-9bfa-18b6adcfe9d2 (1).jfif', caption: '❤️' },
    { src: '59b9007d-5666-4046-8193-54261d1c2ced.jfif', caption: '❤️' },
    { src: 'Lind68c5e8a6-64a3-47ec-9bfa-18b6adcfe9d2 (1).jfif', caption: '❤️' },

];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupEnvelopeAnimation();
    setupCarousel();
    setupGallery();
    setupModal();
    setupPopup();
    setupRevealButtons();
    addEventListeners();
    
    // Show popup after 3 seconds
    setTimeout(showPopup, 3000);
}

// Envelope Animation Setup
function setupEnvelopeAnimation() {
    const openButton = document.getElementById('openEnvelope');
    const envelope = document.getElementById('envelope');
    const envelopeFlap = document.getElementById('envelope-flap');
    const letter = document.getElementById('letter');
    
    if (openButton) {
        openButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (!openButton.disabled) {
                openEnvelope(envelopeFlap, letter, openButton);
            }
        });
        
        // Add touch event for mobile
        openButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (!openButton.disabled) {
                openEnvelope(envelopeFlap, letter, openButton);
            }
        });
    }
}

// Open envelope animation
function openEnvelope(flap, letter, button) {
    // Disable button immediately to prevent multiple clicks
    button.disabled = true;
    button.style.pointerEvents = 'none';
    
    // Add opening class to flap
    flap.classList.add('open');
    
    // Show letter after flap animation
    setTimeout(() => {
        letter.classList.add('show');
    }, 500);
    
    // Play birthday music
    setTimeout(() => {
        playBirthdayTune();
    }, 500);
    
    // Update button appearance
    button.style.opacity = '0.7';
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-envelope-open"></i> Letter Opened! 💖';
        button.style.background = 'linear-gradient(45deg, #27ae60,rgb(16, 225, 121))';
        button.style.opacity = '1';
        button.style.transform = 'scale(1)';
        button.style.animation = 'none';
        button.style.cursor = 'default';
    }, 1000);
    
    // Add celebration effect
    createCelebrationEffect();
}

// Create celebration effect
function createCelebrationEffect() {
    const container = document.querySelector('.envelope-container');
    
    // Create confetti effect
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createConfetti(container);
        }, i * 100);
    }
}

// Create individual confetti piece
function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${getRandomColor()};
        left: ${Math.random() * 100}%;
        top: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        animation: confettiFall 3s linear forwards;
    `;
    
    container.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Get random color for confetti
function getRandomColor() {
    const colors = ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#e67e22'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add confetti animation to CSS dynamically
if (!document.querySelector('#confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
        @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Carousel Setup
function setupCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const items = track.children;
    
    prevBtn.addEventListener('click', () => navigateCarousel(-1));
    nextBtn.addEventListener('click', () => navigateCarousel(1));
    
    // Auto-advance carousel
    setInterval(() => {
        navigateCarousel(1);
    }, 5000);
}

// Navigate carousel
function navigateCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const items = track.children;
    const totalItems = items.length;
    
    currentCarouselIndex += direction;
    
    if (currentCarouselIndex >= totalItems) {
        currentCarouselIndex = 0;
    } else if (currentCarouselIndex < 0) {
        currentCarouselIndex = totalItems - 1;
    }
    
    const translateX = -currentCarouselIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
}

// Gallery Setup
function setupGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    galleryData.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        galleryGrid.appendChild(galleryItem);
    });
    
    galleryImages = galleryData;
}

// Create gallery item
function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-index', index);
    
    galleryItem.innerHTML = `
        <img src="${item.src}" alt="${item.caption}" loading="lazy">
        <div class="gallery-overlay">
            <div class="gallery-caption">${item.caption}</div>
        </div>
    `;
    
    galleryItem.addEventListener('click', () => openModal(index));
    
    return galleryItem;
}

// Modal Setup
function setupModal() {
    const modal = document.getElementById('imageModal');
    const closeModal = document.getElementById('closeModal');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    closeModal.addEventListener('click', closeImageModal);
    modalPrev.addEventListener('click', () => navigateModal(-1));
    modalNext.addEventListener('click', () => navigateModal(1));
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    closeImageModal();
                    break;
                case 'ArrowLeft':
                    navigateModal(-1);
                    break;
                case 'ArrowRight':
                    navigateModal(1);
                    break;
            }
        }
    });
}

// Open modal
function openModal(index) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    currentModalIndex = index;
    const currentImage = galleryImages[index];
    
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.caption;
    modalCaption.textContent = currentImage.caption;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add loading effect
    modalImage.style.opacity = '0';
    modalImage.onload = () => {
        modalImage.style.transition = 'opacity 0.3s ease';
        modalImage.style.opacity = '1';
    };
}

// Navigate modal
function navigateModal(direction) {
    currentModalIndex += direction;
    
    if (currentModalIndex >= galleryImages.length) {
        currentModalIndex = 0;
    } else if (currentModalIndex < 0) {
        currentModalIndex = galleryImages.length - 1;
    }
    
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const currentImage = galleryImages[currentModalIndex];
    
    // Fade out
    modalImage.style.opacity = '0';
    
    setTimeout(() => {
        modalImage.src = currentImage.src;
        modalImage.alt = currentImage.caption;
        modalCaption.textContent = currentImage.caption;
        
        modalImage.onload = () => {
            modalImage.style.opacity = '1';
        };
    }, 150);
}

// Close modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Popup Setup
function setupPopup() {
    const closePopup = document.getElementById('closePopup');
    closePopup.addEventListener('click', hidePopup);
    
    // Close popup on outside click
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });
}

// Show popup
function showPopup() {
    const popup = document.getElementById('popupOverlay');
    popup.classList.add('show');
    
    // Auto-hide popup after 10 seconds
    setTimeout(hidePopup, 10000);
}

// Hide popup
function hidePopup() {
    const popup = document.getElementById('popupOverlay');
    popup.classList.remove('show');
}

// Add event listeners
function addEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Candle click interaction
    const flame = document.getElementById('flame');
    if (flame) {
        flame.addEventListener('click', function() {
            this.style.animationPlayState = this.style.animationPlayState === 'paused' ? 'running' : 'paused';
        });
    }
    
    // Add hover effects to gallery items
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.gallery-item')) {
            e.target.closest('.gallery-item').style.transform = 'translateY(-5px) scale(1.02)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.gallery-item')) {
            e.target.closest('.gallery-item').style.transform = '';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-title, .gallery-item, .cake-container');
    animatedElements.forEach(el => observer.observe(el));
});

// Add fade-in animation
if (!document.querySelector('#fade-animation-style')) {
    const style = document.createElement('style');
    style.id = 'fade-animation-style';
    style.textContent = `
        @keyframes fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Setup reveal buttons
function setupRevealButtons() {
    const showCarouselBtn = document.getElementById('showCarouselBtn');
    const showGalleryBtn = document.getElementById('showGalleryBtn');
    const carouselContainer = document.getElementById('carouselContainer');
    const galleryContent = document.getElementById('galleryContent');
    
    showCarouselBtn.addEventListener('click', function() {
        carouselContainer.style.display = 'block';
        carouselContainer.style.animation = 'slideDown 0.6s ease-out';
        this.innerHTML = '<i class="fas fa-check"></i> Beautiful Moments Revealed!';
        this.classList.add('clicked');
        this.disabled = true;
        
        // Play beautiful moments music
        setTimeout(() => {
            const music = document.getElementById('beautifulMomentsMusic');
            if (music) {
                music.volume = 0.6;
                music.play().catch(e => {
                    console.log('MP3 file not found, playing generated music instead');
                    // Fallback to generated music if MP3 not available
                    playBeautifulMomentsMusic();
                });
            } else {
                // Fallback to generated music
                playBeautifulMomentsMusic();
            }
        }, 300);
    });
    
    showGalleryBtn.addEventListener('click', function() {
        galleryContent.style.display = 'block';
        galleryContent.style.animation = 'slideDown 0.6s ease-out';
        this.innerHTML = '<i class="fas fa-check"></i> Your Beautiful Memories Revealed!';
        this.classList.add('clicked');
        this.disabled = true;
    });
}

// Add slide down animation
if (!document.querySelector('#slide-animation-style')) {
    const style = document.createElement('style');
    style.id = 'slide-animation-style';
    style.textContent = `
        @keyframes slideDown {
            from { 
                opacity: 0; 
                transform: translateY(-30px); 
                max-height: 0;
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
                max-height: 1000px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        e.target.alt = 'Image not available';
    }
}, true);

// Window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Recalculate carousel position on resize
    const track = document.getElementById('carouselTrack');
    if (track) {
        const translateX = -currentCarouselIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;
    }
});

// Birthday tune function using Web Audio API
function playBirthdayTune() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Happy Birthday melody notes (simplified)
        const notes = [
            { freq: 261.63, duration: 0.5 }, // C
            { freq: 261.63, duration: 0.5 }, // C
            { freq: 293.66, duration: 1.0 }, // D
            { freq: 261.63, duration: 1.0 }, // C
            { freq: 349.23, duration: 1.0 }, // F
            { freq: 329.63, duration: 2.0 }, // E
        ];
        
        let currentTime = audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    } catch (error) {
        console.log('Web Audio API not supported or blocked');
    }
}

// Beautiful moments music function
function playBeautifulMomentsMusic() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Beautiful melodic sequence
        const notes = [
            { freq: 329.63, duration: 0.8 }, // E
            { freq: 369.99, duration: 0.8 }, // F#
            { freq: 415.30, duration: 0.8 }, // G#
            { freq: 466.16, duration: 0.8 }, // A#
           
        ];
        
        let currentTime = audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.25, currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    } catch (error) {
        console.log('Web Audio API not supported or blocked');
    }
}

// Console message for birthday person
console.log(`
🎉🎂 HAPPY BIRTHDAY! 🎂🎉

This special webpage was created with love just for you!
Hope you enjoy all the beautiful memories and animations.

Features included:
- Animated envelope with love letter
- Beautiful image carousel
- Interactive birthday cake with candle
- Memory gallery with full-screen viewing
- Surprise popup messages

Made with ❤️ using HTML, CSS, and JavaScript
`);
