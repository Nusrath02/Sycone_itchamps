frappe.provide('frappe.ui');

frappe.ui.OrganizationalChartVertical = class OrganizationalChartVertical {
    constructor(options) {
        this.wrapper = options.wrapper;
        this.page = options.page;
        this.method = options.method;
        this.company = options.company;
        
        this.setup_page();
        this.load_chart();
    }

    setup_page() {
        this.$wrapper = $(this.wrapper);
        this.$wrapper.empty();
        
        this.$wrapper.append(`
            <div class="org-chart-container">
                <div class="org-chart-header">
                    <h3>Organizational Chart</h3>
                </div>
                <div class="org-chart-body">
                    <div class="org-chart-loader">
                        <div class="text-center">
                            <i class="fa fa-spinner fa-spin fa-2x"></i>
                            <p class="text-muted">Loading organizational chart...</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    load_chart() {
        frappe.call({
            method: this.method,
            args: {
                company: this.company
            },
            callback: (r) => {
                if (r.message) {
                    this.render_chart(r.message);
                }
            }
        });
    }

    render_chart(data) {
        const $body = this.$wrapper.find('.org-chart-body');
        $body.empty();
        
        if (!data || data.length === 0) {
            $body.append(`
                <div class="text-center text-muted p-5">
                    No organizational data found
                </div>
            `);
            return;
        }

        // Render vertical organizational chart
        const html = this.build_hierarchy(data);
        $body.append(html);
    }

    build_hierarchy(nodes) {
        let html = '<div class="org-chart-vertical">';
        
        nodes.forEach(node => {
            html += this.build_node(node);
        });
        
        html += '</div>';
        return html;
    }

    build_node(node) {
        return `
            <div class="org-node" data-employee="${node.id}">
                <div class="org-node-card">
                    <div class="org-node-header">
                        ${node.image ? `<img src="${node.image}" class="org-node-image">` : 
                          `<div class="org-node-avatar">${this.get_initials(node.name)}</div>`}
                    </div>
                    <div class="org-node-body">
                        <div class="org-node-name">${node.name}</div>
                        <div class="org-node-title">${node.designation || ''}</div>
                        ${node.connections ? `<div class="org-node-connections">${node.connections} connections</div>` : ''}
                    </div>
                </div>
                ${node.children && node.children.length > 0 ? this.build_children(node.children) : ''}
            </div>
        `;
    }

    build_children(children) {
        let html = '<div class="org-children">';
        children.forEach(child => {
            html += this.build_node(child);
        });
        html += '</div>';
        return html;
    }

    get_initials(name) {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
};
