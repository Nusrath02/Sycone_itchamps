// Add click event to settings button
document.addEventListener('DOMContentLoaded', function() {
  // Find all setting buttons
  const settingButtons = document.querySelectorAll('.setting-btn .drag-handle');
  
  settingButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Find the dropdown in the same parent
      const dropdown = this.closest('.setting-btn').querySelector('.dropdown-list');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-list').forEach(dd => {
        if (dd !== dropdown) {
          dd.classList.remove('show');
        }
      });
      
      // Toggle this dropdown
      dropdown.classList.toggle('show');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-list').forEach(dd => {
      dd.classList.remove('show');
    });
  });
});

function toggleSettingsDropdown(buttonElement) {
  const dropdown = buttonElement.closest('.setting-btn').querySelector('.dropdown-list');
  dropdown.classList.toggle('show');
}




// sycone_footer.js - Improved version
function createSyconEFooter() {
    // Remove existing footer first
    $('.sycone-custom-footer').remove();
    
    const footerHTML = `
        <div class="sycone-custom-footer">
            <div class="sycone-footer-content">
                <div class="sycone-copyright">
                    <span>© 2026 SYConE CPMC Pvt Ltd. All Rights Reserved | Design: ITChamps</span>
                </div>
                <img src="/assets/business_theme_v14/images/SYConE Final Logo1.png" 
                     alt="SYConE Logo" 
                     class="sycone-footer-logo"
                     onerror="this.style.display='none'">
            </div>
        </div>
    `;
    
    // Append to body
    $('body').append(footerHTML);
    console.log("✅ SYConE footer created");
}

// Initialize footer when DOM is ready
$(document).ready(function() {
    createSyconEFooter();
});

// Re-create on Frappe page changes
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        createSyconEFooter();
    });
    
    // Handle SPA navigation
    frappe.router.on('change', function() {
        setTimeout(createSyconEFooter, 100);
    });
}
