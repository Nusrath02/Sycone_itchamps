// ================================================
// VERTICAL ORGANIZATIONAL CHART - FRAPPE OVERRIDE
// ================================================

(function() {
    'use strict';
    
    // Main function to render vertical org chart
    function renderVerticalOrgChart() {
        // Only run on organizational chart page
        if (frappe.get_route_str() !== 'organizational-chart') {
            return;
        }
        
        const container = document.querySelector('.get-org-chart');
        
        // Exit if container doesn't exist
        if (!container) {
            return;
        }
        
        // Prevent multiple initializations
        if (container.dataset.verticalChartApplied === 'true') {
            return;
        }
        
        // Check if getOrgChart library is loaded
        if (typeof getOrgChart === 'undefined') {
            console.warn('getOrgChart library not loaded yet');
            return;
        }
        
        // Mark as customized
        container.dataset.verticalChartApplied = 'true';
        
        // Fetch employee data and render chart
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Employee',
                fields: [
                    'name',
                    'employee_name',
                    'reports_to',
                    'designation',
                    'image',
                    'department'
                ],
                filters: {
                    'status': 'Active'
                },
                limit_page_length: 0  // Get all records
            },
            callback: function(response) {
                if (!response.message || response.message.length === 0) {
                    frappe.msgprint('No employee data found');
                    return;
                }
                
                // Transform data for org chart
                const chartData = response.message.map(function(employee) {
                    return {
                        id: employee.name,
                        parentId: employee.reports_to || null,
                        name: employee.employee_name || employee.name,
                        title: employee.designation || '',
                        img: employee.image || '',
                        department: employee.department || ''
                    };
                });
                
                // Clear existing content
                container.innerHTML = '';
                
                // Initialize vertical org chart
                try {
                    new getOrgChart(container, {
                        dataSource: chartData,
                        primaryFields: ['name', 'title'],
                        photoFields: ['img'],
                        
                        // *** VERTICAL ORIENTATION ***
                        orientation: getOrgChart.RO_TOP,
                        
                        // Additional settings
                        enableZoom: true,
                        enablePan: true,
                        enableGridView: true,
                        enableSearch: true,
                        enableExportToPDF: true,
                        enableExportToPNG: true,
                        enableFullScreen: true,
                        
                        // Expand settings
                        expandToLevel: 3,
                        
                        // Box styling
                        boxSize: {
                            width: 240,
                            height: 120
                        },
                        
                        // Layout settings
                        levelSeparation: 80,
                        siblingSeparation: 40,
                        subtreeSeparation: 80,
                        
                        // Colors and styling
                        primaryColor: '#2490EF',
                        template: 'ana',
                        
                        // Interaction
                        enableDragDrop: false,
                        enableTouch: true,
                        
                        // Events
                        nodeClick: function(sender, args) {
                            const employeeId = args.node.id;
                            frappe.set_route('Form', 'Employee', employeeId);
                        }
                    });
                    
                    console.log('✅ Vertical organizational chart rendered successfully');
                    
                } catch (error) {
                    console.error('Error rendering org chart:', error);
                    frappe.msgprint({
                        title: 'Chart Error',
                        message: 'Failed to render organizational chart: ' + error.message,
                        indicator: 'red'
                    });
                }
            },
            error: function(error) {
                console.error('Error fetching employee data:', error);
            }
        });
    }
    
    // ================================================
    // EVENT LISTENERS - TRIGGER CHART RENDERING
    // ================================================
    
    // 1. On route change (navigation)
    frappe.router.on('change', function() {
        setTimeout(function() {
            renderVerticalOrgChart();
        }, 500);
    });
    
    // 2. On page ready
    $(document).ready(function() {
        setTimeout(function() {
            renderVerticalOrgChart();
        }, 1000);
    });
    
    // 3. On window load
    $(window).on('load', function() {
        setTimeout(function() {
            renderVerticalOrgChart();
        }, 1200);
    });
    
    // 4. Watch for DOM changes (when org chart container is added)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && node.classList.contains('get-org-chart')) {
                        setTimeout(renderVerticalOrgChart, 300);
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 5. Initial call
    setTimeout(renderVerticalOrgChart, 800);
    
    console.log('🔧 Vertical Org Chart script loaded');
    
})();
