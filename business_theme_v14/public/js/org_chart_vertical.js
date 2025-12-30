frappe.pages["vertical-org-chart"].on_page_load = function (wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Vertical Organization Chart",
        single_column: true
    });

    const container = $('<div class="vertical-org-container"></div>');
    $(page.body).append(container);

    loadOrgData(container);
};

function loadOrgData(container) {
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Employee",
            fields: [
                "name",
                "employee_name",
                "designation",
                "reports_to",
                "image"
            ],
            limit_page_length: 1000
        },
        callback(r) {
            if (!r.message) return;

            const employees = r.message;
            const tree = buildHierarchy(employees);
            renderTree(tree, container);
        }
    });
}

function buildHierarchy(list) {
    const map = {};
    const roots = [];

    list.forEach(emp => {
        map[emp.name] = { ...emp, children: [] };
    });

    list.forEach(emp => {
        if (emp.reports_to && map[emp.reports_to]) {
            map[emp.reports_to].children.push(map[emp.name]);
        } else {
            roots.push(map[emp.name]);
        }
    });

    return roots;
}

function renderTree(nodes, container) {
    const ul = $('<ul class="org-tree"></ul>');

    nodes.forEach(node => {
        const li = $('<li></li>');

        const card = $(`
            <div class="org-card">
                <div class="name">${node.employee_name || node.name}</div>
                <div class="designation">${node.designation || ""}</div>
            </div>
        `);

        li.append(card);

        if (node.children.length) {
            renderTree(node.children, li);
        }

        ul.append(li);
    });

    container.append(ul);
}
