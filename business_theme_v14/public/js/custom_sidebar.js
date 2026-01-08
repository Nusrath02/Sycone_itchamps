// FIXED VERSION - Finds the sidebar correctly
// Uses multiple strategies to locate the sidebar

frappe.provide('frappe.desk');

$(document).ready(function () {
    console.log('🚀 Employee menu script starting...');
    
    function addEmployeeMenu() {
        try {
            // Try multiple selectors to find the sidebar
            let $sidebar = null;
            
            // Strategy 1: Look for Public section
            $sidebar = $("div.standard-sidebar-section.nested-container[data-title='Public']");
            if ($sidebar.length > 0) {
                console.log('✅ Found sidebar using Strategy 1');
            }
            
            // Strategy 2: Look for any nested-container with PUBLIC
            if ($sidebar.length === 0) {
                $sidebar = $(".nested-container:has(.sidebar-label:contains('PUBLIC'))");
                if ($sidebar.length > 0) {
                    console.log('✅ Found sidebar using Strategy 2');
                }
            }
            
            // Strategy 3: Look for desk-sidebar
            if ($sidebar.length === 0) {
                $sidebar = $(".desk-sidebar .nested-container").first();
                if ($sidebar.length > 0) {
                    console.log('✅ Found sidebar using Strategy 3');
                }
            }
            
            // Strategy 4: Look for standard-sidebar-section
            if ($sidebar.length === 0) {
                $sidebar = $(".standard-sidebar-section").first();
                if ($sidebar.length > 0) {
                    console.log('✅ Found sidebar using Strategy 4');
                }
            }
            
            // Strategy 5: Just append to any sidebar container we can find
            if ($sidebar.length === 0) {
                $sidebar = $(".desk-sidebar");
                if ($sidebar.length > 0) {
                    console.log('✅ Found sidebar using Strategy 5 (desk-sidebar)');
                }
            }
            
            if ($sidebar.length > 0) {
                console.log('📍 Sidebar found! Checking for existing Employee menu...');
                
                // Check if Employee menu already exists
                if ($sidebar.find('[item-name="Employee"]').length === 0) {
                    console.log('➕ Adding Employee menu...');
                    
                    // Add the menu item
                    $sidebar.append(`
                        <div class="sidebar-item-container is-draggable" item-parent="" item-name="Employee" item-public="1" item-is-hidden="0">
                            <div class="desk-sidebar-item standard-sidebar-item">
                                <a href="#" class="item-anchor employee-custom-link" title="Employee">
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
                    
                    console.log('✅ Employee menu HTML added');
                    
                    // Attach click handler using event delegation on document
                    $(document).off('click', '.employee-custom-link').on('click', '.employee-custom-link', function(e) {
                        console.log('🖱️ Employee link clicked!');
                        e.preventDefault();
                        e.stopPropagation();
                        
                        try {
                            console.log('🔄 Navigating to Employee list...');
                            frappe.set_route('List', 'Employee', {status: 'Active'});
                            console.log('✅ Navigation command executed');
                        } catch (err) {
                            console.error('❌ Navigation failed:', err);
                            // Fallback to direct URL
                            window.location.href = '/app/employee/view/list?status=Active';
                        }
                        
                        return false;
                    });
                    
                    console.log('✅ Click handler attached!');
                    console.log('🎉 Employee menu setup complete!');
                    
                } else {
                    console.log('ℹ️ Employee menu already exists');
                }
            } else {
                console.error('❌ ERROR: Could not find sidebar with any strategy!');
                console.log('🔍 Debugging info:');
                console.log('  - .desk-sidebar count:', $('.desk-sidebar').length);
                console.log('  - .standard-sidebar-section count:', $('.standard-sidebar-section').length);
                console.log('  - .nested-container count:', $('.nested-container').length);
            }
            
        } catch (error) {
            console.error('❌ Error in addEmployeeMenu:', error);
        }
    }
    
    // Try multiple times with increasing delays
    console.log('⏳ Waiting for sidebar to load...');
    
    // Try after 1 second
    setTimeout(addEmployeeMenu, 1000);
    
    // Try after 3 seconds (in case slower)
    setTimeout(addEmployeeMenu, 3000);
    
    // Try after 5 seconds (final attempt)
    setTimeout(addEmployeeMenu, 5000);
});
