document.addEventListener('DOMContentLoaded', function() {
    function setHomeIcon() {
        const pageTitle = document.querySelector('.page-title');
        const currentPath = window.location.pathname;
        const titleText = pageTitle ? pageTitle.textContent.trim() : '';
        
        // Only set home icon if we're actually on the home page
        if (pageTitle && (
            currentPath === '/app' || 
            currentPath === '/app/' ||
            titleText === 'Home' ||
            currentPath.includes('/app/home')
        )) {
            // Apply home icon
            pageTitle.style.paddingLeft = '40px';
            pageTitle.style.position = 'relative';
            
            let iconElement = pageTitle.querySelector('.page-icon');
            if (!iconElement) {
                iconElement = document.createElement('span');
                iconElement.className = 'page-icon';
                iconElement.style.cssText = 'position:absolute;left:0;font-size:28px;top:50%;transform:translateY(-50%)';
                pageTitle.insertBefore(iconElement, pageTitle.firstChild);
            }
            iconElement.textContent = '🏠';
        }
    }
    
    setHomeIcon();
    
    // Run again when page changes
    setTimeout(setHomeIcon, 1000);
});
