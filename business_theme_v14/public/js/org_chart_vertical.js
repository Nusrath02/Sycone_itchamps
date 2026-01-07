frappe.pages["vertical-org-chart"] =
    frappe.pages["vertical-org-chart"] || {};

frappe.pages["vertical-org-chart"].on_page_load = function (wrapper) {

    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Custom Vertical Org Chart",
        single_column: true
    });

    const container = $('<div class="custom-org-wrapper"></div>');
    $(page.body).append(container);

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Employee",
            fields: [
                "name",
                "employee_name",
                "designation",
                "reports_to"
            ],
            limit_page_length: 1000
        },
        callback(r) {
            if (!r.message) return;

            const tree = buildHierarchy(r.message);
            renderTree(tree, container);
        }
    });

};


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


function renderTree(nodes, parent) {
    const ul = $('<ul class="org-vertical"></ul>');

    nodes.forEach(node => {
        const li = $('<li></li>');

        li.append(`
            <div class="org-node">
                <div class="emp-name">${node.employee_name}</div>
                <div class="emp-desig">${node.designation || ""}</div>
            </div>
        `);

        if (node.children.length) {
            renderTree(node.children, li);
        }

        ul.append(li);
    });

    parent.append(ul);
}
