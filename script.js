// DOM Elements
const mobileMenu = document.getElementById('mobileMenu');
const loadingScreen = document.getElementById('loadingScreen');
const notification = document.getElementById('notification');
const backToTop = document.getElementById('backToTop');
const counters = document.querySelectorAll('.counter');
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const modals = document.querySelectorAll('.modal');
const navbar = document.querySelector('.navbar');

// Fix for loading screen timeout
let hideLoadingTimeout;
let loadStarted = false;

// Function to hide loading screen
function hideLoadingScreen() {
    if (loadStarted) return; // Prevent multiple calls
    loadStarted = true;
    
    loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        notification.classList.remove('hidden');
        notification.classList.add('flex', 'animate-slide-in-right');
        
        // Clear any remaining timeout
        if (hideLoadingTimeout) clearTimeout(hideLoadingTimeout);
    }, 300);
}

// Fallback: Hide loading screen after max 4 seconds
hideLoadingTimeout = setTimeout(hideLoadingScreen, 4000);

// Method 1: DOMContentLoaded - faster (fires when DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Set a shorter timeout for DOM ready (1.5 seconds)
    setTimeout(hideLoadingScreen, 1500);
});

// Method 2: window.load - waits for all resources (images, etc.)
window.addEventListener('load', () => {
    console.log('All resources loaded');
    
    // Clear the fallback timeout
    if (hideLoadingTimeout) clearTimeout(hideLoadingTimeout);
    
    // Hide loading immediately
    hideLoadingScreen();
});

// Fallback safety: Force hide after 5 seconds
setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        console.log('Force hiding loading screen after 5 seconds');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            notification.classList.remove('hidden');
            notification.classList.add('flex', 'animate-slide-in-right');
        }, 300);
    }
}, 5000);

// Toggle Mobile Menu
function toggleMenu() {
    if (!mobileMenu) return;
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('active', 'animate-slide-in-right');
    } else {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu) return;
    
    const menuIcon = document.querySelector('.menu-icon');
    if (!e.target.closest('.menu-icon') && !e.target.closest('.mobile-menu') && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to Top Button
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.remove('hidden');
            backToTop.classList.add('flex');
        } else {
            backToTop.classList.add('hidden');
            backToTop.classList.remove('flex');
        }
    }
    
    // Animate counters when in view
    if (counters.length > 0) {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                animateCounter(counter);
                counter.classList.add('animated');
            }
        });
    }
});

// Back to Top
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    }
}

// Add click events to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
            scrollToSection(sectionId);
        }
    });
});

// Animated Counter
function animateCounter(counter) {
    if (!counter) return;
    
    const target = +counter.getAttribute('data-target') || 0;
    const increment = target / 50; // Faster animation
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
            counter.classList.add('animate-fade-in-up');
        } else {
            counter.textContent = Math.floor(current).toLocaleString();
        }
    }, 30);
}

// Check if element is in viewport
function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Countdown Timer
function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now
    
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// Initialize countdown timer
if (document.getElementById('days')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Testimonial Slider
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    if (!testimonials.length || !dots.length) return;
    
    testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active');
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateX(100%)';
        
        if (dots[index]) {
            dots[index].classList.remove('active');
        }
    });
    
    currentSlide = n;
    
    if (currentSlide >= testimonials.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = testimonials.length - 1;
    
    if (testimonials[currentSlide]) {
        testimonials[currentSlide].classList.add('active');
        testimonials[currentSlide].style.opacity = '1';
        testimonials[currentSlide].style.transform = 'translateX(0)';
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function goToSlide(n) {
    showSlide(n);
    
    // Reset auto-slide timer
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    startAutoSlide();
}

// Initialize testimonial dots
if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Start auto-sliding if testimonials exist
if (testimonials.length > 0) {
    startAutoSlide();
}

// Modal Functions
function showMembershipModal() {
    const modal = document.getElementById('membershipModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
        }
    }
}

function showNutritionModal() {
    // Create a simple modal for nutrition plan
    const nutritionModal = document.createElement('div');
    nutritionModal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-modal-in';
    nutritionModal.innerHTML = `
        <div class="bg-[#111] rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <span class="close absolute top-6 right-6 text-3xl text-gray-400 cursor-pointer hover:text-[#ff6830] transition-colors duration-300" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2 class="text-2xl font-bold mb-4 text-center text-[#ff6830]">Nutrition Plan</h2>
            <p class="text-gray-300 mb-6">Our certified nutritionists will create a personalized meal plan tailored to your goals.</p>
            <button class="w-full bg-gradient-to-r from-[#ff6830] to-[#ff8c5a] text-white font-bold py-4 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300" onclick="this.parentElement.parentElement.remove(); alert('We will contact you within 24 hours with your personalized nutrition plan!')">
                GET PERSONALIZED PLAN
            </button>
        </div>
    `;
    document.body.appendChild(nutritionModal);
}

function showTrainerModal() {
    // Create a simple modal for trainers
    const trainerModal = document.createElement('div');
    trainerModal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-modal-in';
    trainerModal.innerHTML = `
        <div class="bg-[#111] rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <span class="close absolute top-6 right-6 text-3xl text-gray-400 cursor-pointer hover:text-[#ff6830] transition-colors duration-300" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2 class="text-2xl font-bold mb-4 text-center text-[#ff6830]">Our Expert Trainers</h2>
            <p class="text-gray-300 mb-6">Meet our team of certified personal trainers with expertise in various fitness disciplines.</p>
            <button class="w-full bg-gradient-to-r from-[#ff6830] to-[#ff8c5a] text-white font-bold py-4 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300" onclick="this.parentElement.parentElement.remove(); scrollToSection('classes')">
                VIEW TRAINING PROGRAMS
            </button>
        </div>
    `;
    document.body.appendChild(trainerModal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
});

// Close modals with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('flex')) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
        
        // Also close dynamically created modals
        document.querySelectorAll('.fixed.inset-0.bg-black\\/90').forEach(dynamicModal => {
            dynamicModal.remove();
        });
    }
});

// Class Booking
function bookClass(className) {
    const modal = document.getElementById('bookingModal');
    const classSelect = document.getElementById('classSelect');
    
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (classSelect) {
            classSelect.value = className;
        }
    }
}

// Plan Selection
function selectPlan(planType) {
    const modal = document.getElementById('membershipModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const select = modal.querySelector('select');
    if (select) {
        select.value = planType;
    }
    
    // Animate the selected plan card
    const planCards = document.querySelectorAll('.price-card, .price-card-popular');
    planCards.forEach(card => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = 'none';
    });
    
    const selectedCard = document.querySelector(`[onclick*="${planType}"]`)?.closest('.price-card, .price-card-popular');
    if (selectedCard) {
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.boxShadow = '0 20px 40px rgba(255, 104, 48, 0.4)';
        
        setTimeout(() => {
            selectedCard.style.transform = '';
            selectedCard.style.boxShadow = '';
        }, 2000);
    }
}

// Free Trial
function startFreeTrial() {
    // Create a nicer free trial modal
    const freeTrialModal = document.createElement('div');
    freeTrialModal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-modal-in';
    freeTrialModal.innerHTML = `
        <div class="bg-[#111] rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <span class="close absolute top-6 right-6 text-3xl text-gray-400 cursor-pointer hover:text-[#ff6830] transition-colors duration-300" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2 class="text-2xl font-bold mb-6 text-center gradient-text">Start Your Free Trial</h2>
            <form id="freeTrialForm" class="flex flex-col gap-5">
                <input type="text" placeholder="Full Name" required class="py-4 px-5 border border-[#ff6830]/30 bg-white/5 rounded-xl text-white focus:outline-none focus:border-[#ff6830]">
                <input type="email" placeholder="Email Address" required class="py-4 px-5 border border-[#ff6830]/30 bg-white/5 rounded-xl text-white focus:outline-none focus:border-[#ff6830]">
                <input type="tel" placeholder="Phone Number" class="py-4 px-5 border border-[#ff6830]/30 bg-white/5 rounded-xl text-white focus:outline-none focus:border-[#ff6830]">
                <button type="submit" class="modal-btn bg-gradient-to-r from-[#ff6830] to-[#ff8c5a] text-white font-bold py-4 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    START 7-DAY FREE TRIAL
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(freeTrialModal);
    
    // Add form submission handler
    freeTrialModal.querySelector('#freeTrialForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        if (name) {
            freeTrialModal.remove();
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl flex items-center gap-4 z-50 animate-slide-in-right shadow-lg max-w-md';
            successMsg.innerHTML = `
                <p class="flex-1">🎉 Welcome ${name}! Your 7-day free trial has been activated. Check your email for details.</p>
                <button class="text-2xl hover:scale-110 transition-transform" onclick="this.parentElement.remove()">&times;</button>
            `;
            document.body.appendChild(successMsg);
            
            // Auto-remove success message after 5 seconds
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.remove();
                }
            }, 5000);
        }
    });
}

// Newsletter Subscription
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput) return;
    
    const email = emailInput.value;
    
    if (email && validateEmail(email)) {
        emailInput.value = '';
        
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl flex items-center gap-4 z-50 animate-slide-in-right shadow-lg max-w-md';
        successNotification.innerHTML = `
            <p class="flex-1">✅ Thank you for subscribing! Check your email for confirmation.</p>
            <button class="text-2xl hover:scale-110 transition-transform" onclick="this.parentElement.remove()">&times;</button>
        `;
        document.body.appendChild(successNotification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successNotification.parentNode) {
                successNotification.remove();
            }
        }, 5000);
    } else {
        // Show error notification
        const errorNotification = document.createElement('div');
        errorNotification.className = 'fixed top-5 right-5 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl flex items-center gap-4 z-50 animate-slide-in-right shadow-lg max-w-md';
        errorNotification.innerHTML = `
            <p class="flex-1">⚠️ Please enter a valid email address.</p>
            <button class="text-2xl hover:scale-110 transition-transform" onclick="this.parentElement.remove()">&times;</button>
        `;
        document.body.appendChild(errorNotification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.remove();
            }
        }, 5000);
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form Submissions
const membershipForm = document.getElementById('membershipForm');
if (membershipForm) {
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl flex items-center gap-4 z-50 animate-slide-in-right shadow-lg max-w-md';
        successNotification.innerHTML = `
            <p class="flex-1">✅ Thank you! We will contact you shortly to complete your membership.</p>
            <button class="text-2xl hover:scale-110 transition-transform" onclick="this.parentElement.remove()">&times;</button>
        `;
        document.body.appendChild(successNotification);
        
        this.reset();
        closeModal('membershipModal');
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successNotification.parentNode) {
                successNotification.remove();
            }
        }, 5000);
    });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl flex items-center gap-4 z-50 animate-slide-in-right shadow-lg max-w-md';
        successNotification.innerHTML = `
            <p class="flex-1">✅ Class booked successfully! You will receive a confirmation email.</p>
            <button class="text-2xl hover:scale-110 transition-transform" onclick="this.parentElement.remove()">&times;</button>
        `;
        document.body.appendChild(successNotification);
        
        this.reset();
        closeModal('bookingModal');
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successNotification.parentNode) {
                successNotification.remove();
            }
        }, 5000);
    });
}

// Notification Close
const closeNotification = document.getElementById('closeNotification');
if (closeNotification) {
    closeNotification.addEventListener('click', () => {
        if (!notification) return;
        
        notification.classList.add('exit');
        setTimeout(() => {
            notification.classList.add('hidden');
            notification.classList.remove('flex');
        }, 500);
    });
}

// Auto-hide notification after 5 seconds
if (notification) {
    setTimeout(() => {
        if (notification.classList.contains('flex')) {
            notification.classList.add('exit');
            setTimeout(() => {
                notification.classList.add('hidden');
                notification.classList.remove('flex');
            }, 500);
        }
    }, 5000);
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.membership-banner');
    
    parallaxElements.forEach(element => {
        const speed = 0.3;
        element.style.backgroundPositionY = (scrolled * speed) + 'px';
    });
});

// Initialize animations when in viewport
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .class-card, .price-card').forEach(el => {
    if (el) {
        observer.observe(el);
    }
});

// Initialize elements on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Animate product cards with delay
    document.querySelectorAll('.product-card, .class-card').forEach((card, index) => {
        if (card) {
            card.classList.add('opacity-0', 'translate-y-8');
            
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-8');
                card.classList.add('transition-all', 'duration-500', 'ease-out');
            }, index * 100);
        }
    });
    
    // Initialize counters if they're already in view
    if (counters.length > 0) {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                animateCounter(counter);
                counter.classList.add('animated');
            }
        });
    }
    
    // Add hover effects to cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const cardHover = card.querySelector('.card-hover');
            if (cardHover) {
                cardHover.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const cardHover = card.querySelector('.card-hover');
            if (cardHover) {
                cardHover.style.transform = 'translateY(100%)';
            }
        });
    });
    
    // Add hover effects to class cards
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const overlay = card.querySelector('.class-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.class-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(30px)';
            }
        });
    });
});

// Add hover effects to buttons
document.querySelectorAll('button, .card-btn, .nav-link').forEach(element => {
    if (element) {
        element.addEventListener('mouseenter', () => {
            element.classList.add('scale-105');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('scale-105');
        });
    }
});

// Image error handling (prevent infinite loading)
document.querySelectorAll('img').forEach(img => {
    if (img) {
        img.addEventListener('error', function() {
            console.warn(`Image failed to load: ${this.src}`);
            // Add a placeholder class
            this.classList.add('bg-gray-800');
            
            // Create a fallback SVG if no src
            if (!this.src || this.src.includes('undefined')) {
                this.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="#111"/>
                        <text x="200" y="150" font-family="Arial" font-size="24" fill="#ff6830" text-anchor="middle" dy=".3em">GYM IMG</text>
                    </svg>
                `)}`;
            }
        });
    }
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        // Code that runs after scrolling stops
    }, 100);
});

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
    
    // Arrow keys for testimonial slider
    if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    }
});

// Add window resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Recalculate counters in viewport on resize
    if (counters.length > 0) {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                animateCounter(counter);
                counter.classList.add('animated');
            }
        });
    }
});

// Add page visibility API support
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    } else {
        // Page is visible, resume animations
        if (testimonials.length > 0 && !slideInterval) {
            startAutoSlide();
        }
    }
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Add beforeunload handler to clean up
window.addEventListener('beforeunload', () => {
    // Clear all intervals and timeouts
    if (slideInterval) clearInterval(slideInterval);
    if (hideLoadingTimeout) clearTimeout(hideLoadingTimeout);
    if (scrollTimeout) clearTimeout(scrollTimeout);
});

// Export functions for global access (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        scrollToSection,
        showMembershipModal,
        closeModal,
        bookClass,
        selectPlan,
        startFreeTrial,
        subscribeNewsletter,
        showSlide,
        goToSlide
    };
}