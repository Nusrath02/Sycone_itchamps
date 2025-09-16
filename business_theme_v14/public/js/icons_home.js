// Robust Home Icon Script with Multiple Fallbacks

(function() {
    'use strict';
    
    // Configuration
    const config = {
        titleSelector: '.page-title',
        iconClass: 'page-icon',
        homeIcon: '🏠',
        homePaths: ['/app', '/app/', '/', '/home', '/app/home'],
        homeTitles: ['home', 'dashboard', 'main'],
        retryAttempts: 5,
        retryDelay: 500
    };
    
    // Utility function to check if we're on home page
    function isHomePage() {
        const currentPath = window.location.pathname.toLowerCase();
        const pageTitle = document.querySelector(config.titleSelector);
        const titleText = pageTitle ? pageTitle.textContent.trim().toLowerCase() : '';
        
        // Check paths
        const pathMatch = config.homePaths.some(path => 
            currentPath === path || currentPath.startsWith(path)
        );
        
        // Check title text
        const titleMatch = config.homeTitles.some(title => 
            titleText.includes(title)
        );
        
        return pathMatch || titleMatch;
    }
    
    // Main function to set home icon
    function setHomeIcon() {
        try {
            const pageTitle = document.querySelector(config.titleSelector);
            
            if (!pageTitle) {
                console.log('Page title element not found');
                return false;
            }
            
            if (!isHomePage()) {
                console.log('Not on home page');
                return false;
            }
            
            // Check if icon already exists
            let iconElement = pageTitle.querySelector(`.${config.iconClass}`);
            
            if (!iconElement) {
                // Create icon element
                iconElement = document.createElement('span');
                iconElement.className = config.iconClass;
                iconElement.setAttribute('aria-hidden', 'true');
                
                // Set styles
                Object.assign(iconElement.style, {
                    position: 'absolute',
                    left: '0',
                    fontSize: '28px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: '1',
                    pointerEvents: 'none'
                });
                
                // Insert icon
                pageTitle.insertBefore(iconElement, pageTitle.firstChild);
                console.log('Created new home icon');
            }
            
            // Set icon content
            iconElement.textContent = config.homeIcon;
            
            // Apply styles to page title
            Object.assign(pageTitle.style, {
                paddingLeft: '40px',
                position: 'relative'
            });
            
            console.log('Home icon applied successfully');
            return true;
            
        } catch (error) {
            console.error('Error setting home icon:', error);
            return false;
        }
    }
    
    // Retry mechanism
    function retrySetHomeIcon(attemptsLeft = config.retryAttempts) {
        if (attemptsLeft <= 0) {
            console.log('Max retry attempts reached');
            return;
        }
        
        if (!setHomeIcon()) {
            setTimeout(() => {
                retrySetHomeIcon(attemptsLeft - 1);
            }, config.retryDelay);
        }
    }
    
    // MutationObserver for dynamic content
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if page title was added
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches(config.titleSelector)) {
                                shouldRecheck = true;
                            } else if (node.querySelector && node.querySelector(config.titleSelector)) {
                                shouldRecheck = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRecheck) {
                setTimeout(setHomeIcon, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // URL change detection for SPAs
    function watchUrlChanges() {
        let currentUrl = location.href;
        
        const checkUrlChange = () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                console.log('URL changed, rechecking home icon');
                setTimeout(setHomeIcon, 200);
            }
        };
        
        // Listen for popstate (back/forward)
        window.addEventListener('popstate', checkUrlChange);
        
        // Intercept pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(checkUrlChange, 0);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(checkUrlChange, 0);
        };
    }
    
    // Initialize
    function init() {
        console.log('Initializing home icon script');
        
        // Try immediate execution
        setHomeIcon();
        
        // Set up retry mechanism
        retrySetHomeIcon();
        
        // Watch for dynamic changes
        if (typeof MutationObserver !== 'undefined') {
            observeChanges();
        }
        
        // Watch for URL changes
        watchUrlChanges();
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
