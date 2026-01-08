// WORKING VERSION - Employee Sidebar Menu
// This properly attaches click handlers after adding the HTML

frappe.provide('frappe.desk');

$(document).ready(function () {
    console.log('Employee menu script starting...');
    
    // Wait for sidebar to load
    setTimeout(function() {
        try {
            // Find the Public section
            const $publicSection = $("div.standard-sidebar-section.nested-container[data-title='Public']");
            
            if ($publicSection.length > 0) {
                console.log('Sidebar Public section found');
                
                // Check if Employee menu already exists
                if ($publicSection.find('[item-name="Employee"]').length === 0) {
                    console.log('Adding Employee menu...');
                    
                    // Add the menu item WITHOUT onclick (we'll add it after)
                    $publicSection.append(`
                        <div class="sidebar-item-container is-draggable" item-parent="" item-name="Employee" item-public="1" item-is-hidden="0">
                            <div class="desk-sidebar-item standard-sidebar-item">
                                <a href="#" 
                                   class="item-anchor employee-custom-link" 
                                   title="Employee">
                                    <span class="sidebar-item-icon" item-icon="users">
                                        <svg class="icon icon-md" aria-hidden="true">
                                            <use href="#icon-users"></use>
                                        </svg>
                                    </span>
                                    <span class="sidebar-item-label">Employee</span>
                                </a>
                                <div class="sidebar-item-control">
                                    <button class="btn btn-secondary btn-xs drag-handle" title="Drag">
                                        <svg class="es-icon es-line icon-xs" aria-hidden="true">
                                            <use href="#es-line-drag"></use>
                                        </svg>
                                    </button>
                                    <div class="btn btn-xs setting-btn dropdown-btn" title="Setting">
                                        <svg class="es-icon es-line icon-xs" aria-hidden="true">
                                            <use href="#es-line-dot-horizontal"></use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                    
                    console.log('Employee menu HTML added');
                    
                    // NOW attach the click handler using event delegation
                    // This is the KEY - we attach it AFTER the HTML is added
                    $(document).off('click', '.employee-custom-link').on('click', '.employee-custom-link', function(e) {
                        console.log('Employee link clicked!');
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Navigate to Employee list with Active filter
                        frappe.set_route('List', 'Employee', {status: 'Active'});
                        
                        return false;
                    });
                    
                    console.log('Click handler attached successfully!');
                    
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
