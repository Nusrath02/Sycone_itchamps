/* ==================== SCROLL-RESPONSIVE LOGO JAVASCRIPT ==================== */
/* Add this script to your HTML or include it in your theme's JS file */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const scrollThreshold = 50; // Pixels scrolled before effect triggers
    const scrollThresholdSmall = 150; // Pixels for "small" effect (optional)
    
    // Get navbar element
    const navbar = document.querySelector('.navbar, .navbar-expand, header.navbar');
    
    if (!navbar) {
        console.warn('Navbar not found - scroll logo effect disabled');
        return;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Remove existing scroll classes
        navbar.classList.remove('scrolled', 'scrolled-small', 'scrolled-alt');
        
        if (scrollTop > scrollThresholdSmall) {
            // Most scrolled state (smallest logo)
            navbar.classList.add('scrolled-small');
        } else if (scrollTop > scrollThreshold) {
            // Medium scroll state
            navbar.classList.add('scrolled');
        }
        // else: normal state (no classes added)
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial check in case page loads already scrolled
    updateNavbar();
});

/* ==================== ALTERNATIVE IMPLEMENTATIONS ==================== */

/* Option 1: Simple version - just one scroll state */
function simpleScrollLogo() {
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    });
}

/* Option 2: Smooth percentage-based scaling */
function smoothScrollLogo() {
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.querySelector('.navbar');
        const logo = document.querySelector('.navbar-brand');
        const maxScroll = 200; // Maximum scroll distance for effect
        
        window.addEventListener('scroll', function() {
            const scrollTop = Math.min(window.scrollY, maxScroll);
            const scrollPercent = scrollTop / maxScroll;
            
            // Calculate logo size (160px to 100px)
            const minWidth = 100;
            const maxWidth = 160;
            const minHeight = 25;
            const maxHeight = 40;
            
            const currentWidth = maxWidth - (scrollPercent * (maxWidth - minWidth));
            const currentHeight = maxHeight - (scrollPercent * (maxHeight - minHeight));
            
            logo.style.width = currentWidth + 'px';
            logo.style.height = currentHeight + 'px';
            
            // Adjust navbar padding
            const minPadding = 0.2;
            const maxPadding = 0.5;
            const currentPadding = maxPadding - (scrollPercent * (maxPadding - minPadding));
            navbar.style.padding = currentPadding + 'rem 1rem';
        });
    });
}

/* Option 3: With intersection observer for better performance */
function observerScrollLogo() {
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.querySelector('.navbar');
        
        // Create a trigger element at the top of the page
        const trigger = document.createElement('div');
        trigger.style.height = '50px';
        trigger.style.position = 'absolute';
        trigger.style.top = '0';
        trigger.style.width = '100%';
        trigger.style.pointerEvents = 'none';
        document.body.insertBefore(trigger, document.body.firstChild);
        
        // Intersection Observer
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    navbar.classList.remove('scrolled');
                } else {
                    navbar.classList.add('scrolled');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px 0px 0px 0px'
        });
        
        observer.observe(trigger);
    });
}

/* ==================== FRAPPE/ERPNEXT INTEGRATION ==================== */
/* Special integration for ERPNext/Frappe framework */
function frappeFriendlyScrollLogo() {
    // Wait for Frappe to load
    function initScrollLogo() {
        const navbar = document.querySelector('.navbar, header.navbar, .sticky-top');
        
        if (!navbar) {
            // Try again after a delay if navbar not found
            setTimeout(initScrollLogo, 500);
            return;
        }
        
        let scrollTimer = null;
        
        window.addEventListener('scroll', function() {
            // Clear existing timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            
            // Debounce scroll events
            scrollTimer = setTimeout(function() {
                const scrolled = window.scrollY > 50;
                
                if (scrolled) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }, 10);
        }, { passive: true });
        
        // Initial state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }
    
    // Try to initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollLogo);
    } else {
        initScrollLogo();
    }
    
    // Also try when Frappe is ready (if available)
    if (typeof frappe !== 'undefined') {
        frappe.ready(function() {
            setTimeout(initScrollLogo, 100);
        });
    }
}
