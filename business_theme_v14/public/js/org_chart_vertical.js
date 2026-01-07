frappe.pages["vertical-org-chart"].on_page_load = function (wrapper) {

    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Vertical Org Chart",
        single_column: true
    });

    const container = $('<div id="custom-org"></div>');
    $(page.body).append(container);

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Employee",
            fields: ["name", "employee_name", "designation", "reports_to"],
            limit_page_length: 1000
        },
        callback(r) {
            const tree = buildHierarchy(r.message);
            renderVertical(tree, container);
        }
    });

};

function buildHierarchy(list) {
    const map = {};
    const roots = [];

    list.forEach(e => map[e.name] = { ...e, children: [] });

    list.forEach(e => {
        if (e.reports_to && map[e.reports_to]) {
            map[e.reports_to].children.push(map[e.name]);
        } else {
            roots.push(map[e.name]);
        }
    });

    return roots;
}

function renderVertical(nodes, parent) {
    const ul = $('<ul class="org-vertical"></ul>');

    nodes.forEach(n => {
        const li = $('<li></li>');
        li.append(`<div class="node">${n.employee_name}<br>${n.designation}</div>`);

        if (n.children.length) {
            renderVertical(n.children, li);
        }

        ul.append(li);
    });

    parent.append(ul);
}
