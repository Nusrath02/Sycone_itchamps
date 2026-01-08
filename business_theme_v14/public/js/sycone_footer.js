document.addEventListener("click", function (e) {
    const btn = e.target.closest(".setting-btn");
    if (!btn) return;

    const dropdown = btn
        .closest(".sidebar-item-control")
        ?.querySelector(".dropdown-list");

    if (!dropdown) return;

    const rect = btn.getBoundingClientRect();

    dropdown.style.top = rect.bottom + 6 + "px";
    dropdown.style.left =
        rect.right - dropdown.offsetWidth + "px";
});



















// sycone_footer.js
// Simpler, more reliable approach

function createSyconEFooter() {
    // Remove existing footer
    if ($('.sycone-custom-footer').length) {
        $('.sycone-custom-footer').remove();
    }
    
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
    
    $('body').append(footerHTML);
    console.log("SYConE footer created"); // Debug log
}

// Multiple initialization attempts
$(document).ready(function() {
    setTimeout(createSyconEFooter, 100);
});

// Frappe ready
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        createSyconEFooter();
    });
}

// Window load fallback
window.addEventListener('load', function() {
    setTimeout(createSyconEFooter, 300);
});

// Route change (for SPA navigation)
frappe.router.on('change', function() {
    setTimeout(createSyconEFooter, 100);
});
