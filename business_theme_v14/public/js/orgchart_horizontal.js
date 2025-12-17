frappe.after_ajax(() => {
    // Run ONLY on organizational chart page
    if (frappe.get_route_str() !== "organizational-chart") return;

    // Wait until ERPNext finishes rendering
    setTimeout(() => {
        const page = document.querySelector("#page-organizational-chart");
        if (!page) return;

        const body = page.querySelector(".page-body");
        if (!body) return;

        // Remove default ERPNext chart
        body.innerHTML = `
            <div id="horizontal-orgchart"
                 style="
                    width: 100%;
                    height: 80vh;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding: 20px;
                    background: #fff;
                 ">
            </div>
        `;

        // Fetch employee hierarchy
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Employee",
                fields: ["name", "employee_name", "reports_to"],
                limit_page_length: 1000
            },
            callback: function (r) {
                if (!r.message) return;

                const employees = r.message;

                // Build hierarchy map
                const map = {};
                employees.forEach(e => {
                    map[e.name] = { ...e, children: [] };
                });

                let rootNodes = [];

                employees.forEach(e => {
                    if (e.reports_to && map[e.reports_to]) {
                        map[e.reports_to].children.push(map[e.name]);
                    } else {
                        rootNodes.push(map[e.name]);
                    }
                });

                // Render tree
                const container = document.getElementById("horizontal-orgchart");
                rootNodes.forEach(root => {
                    container.appendChild(renderNode(root));
                });
            }
        });

    }, 800);
});

// Recursive renderer
function renderNode(node) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.position = "relative";

    // Employee card
    const card = document.createElement("div");
    card.innerText = node.employee_name || node.name;
    card.style.minWidth = "180px";
    card.style.padding = "12px 16px";
    card.style.border = "1px solid #dcdcdc";
    card.style.borderRadius = "6px";
    card.style.background = "#ffffff";
    card.style.fontWeight = "500";
    card.style.textAlign = "center";
    card.style.margin = "10px";
    card.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";

    wrapper.appendChild(card);

    // Children container
    if (node.children && node.children.length) {
        const childrenWrap = document.createElement("div");
        childrenWrap.style.display = "flex";
        childrenWrap.style.flexDirection = "column";
        childrenWrap.style.marginLeft = "50px";
        childrenWrap.style.position = "relative";

        // Vertical connector line
        const verticalLine = document.createElement("div");
        verticalLine.style.position = "absolute";
        verticalLine.style.left = "-25px";
        verticalLine.style.top = "0";
        verticalLine.style.bottom = "0";
        verticalLine.style.width = "1px";
        verticalLine.style.background = "#cbd5e1";

        childrenWrap.appendChild(verticalLine);

        node.children.forEach(child => {
            const childRow = document.createElement("div");
            childRow.style.display = "flex";
            childRow.style.alignItems = "center";

            // Horizontal connector + arrow
            const connector = document.createElement("div");
            connector.style.width = "25px";
            connector.style.height = "1px";
            connector.style.background = "#cbd5e1";
            connector.style.marginRight = "6px";
            connector.style.position = "relative";

            const arrow = document.createElement("span");
            arrow.innerText = "▶";
            arrow.style.fontSize = "10px";
            arrow.style.color = "#94a3b8";
            arrow.style.marginRight = "6px";

            childRow.appendChild(connector);
            childRow.appendChild(arrow);
            childRow.appendChild(renderNode(child));

            childrenWrap.appendChild(childRow);
        });

        wrapper.appendChild(childrenWrap);
    }

    return wrapper;
}
