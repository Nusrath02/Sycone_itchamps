// ULTRA SIMPLE VERSION - Employee Sidebar Menu
// This version uses the simplest possible approach

frappe.provide('frappe.desk');

$(document).ready(function () {
    console.log('Employee menu script starting...');
    
    // Wait a bit for sidebar to load
    setTimeout(function() {
        try {
            // Find the Public section
            const $publicSection = $("div.standard-sidebar-section.nested-container[data-title='Public']");
            
            if ($publicSection.length > 0) {
                console.log('Sidebar Public section found');
                
                // Check if Employee menu already exists
                if ($publicSection.find('[item-name="Employee"]').length === 0) {
                    console.log('Adding Employee menu...');
                    
                    // Add the menu item with inline onclick
                    $publicSection.append(`
                        <div class="sidebar-item-container is-draggable" item-parent="" item-name="Employee" item-public="1" item-is-hidden="0">
                            <div class="desk-sidebar-item standard-sidebar-item">
                                <a href="#" 
                                   class="item-anchor" 
                                   title="Employee"
                                   onclick="frappe.set_route('List', 'Employee', {status: 'Active'}); return false;">
                                    <span class="sidebar-item-icon" item-icon="users">
                                        <svg class="icon icon-md" aria-hidden="true">
                                            <use href="#icon-users"></use>
                                        </svg>
                                    </span>
                                    <span class="sidebar-item-label">Employee</span>
                                </a>
                            </div>
                        </div>
                    `);
                    
                    console.log('Employee menu added successfully!');
                } else {
                    console.log('Employee menu already exists');
                }
            } else {
                console.log('ERROR: Sidebar Public section not found!');
            }
        } catch (error) {
            console.error('Error adding Employee menu:', error);
        }
    }, 2000); // Wait 2 seconds for sidebar to load
});
