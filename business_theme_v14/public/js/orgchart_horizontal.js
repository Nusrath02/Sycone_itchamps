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

    const card = document.createElement("div");
    card.innerText = node.employee_name || node.name;
    card.style.minWidth = "180px";
    card.style.padding = "12px 16px";
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "6px";
    card.style.background = "#f9fafb";
    card.style.fontWeight = "500";
    card.style.textAlign = "center";
    card.style.margin = "10px";

    wrapper.appendChild(card);

    if (node.children && node.children.length) {
        const childrenWrap = document.createElement("div");
        childrenWrap.style.display = "flex";
        childrenWrap.style.flexDirection = "column";
        childrenWrap.style.marginLeft = "30px";

        node.children.forEach(child => {
            childrenWrap.appendChild(renderNode(child));
        });

        wrapper.appendChild(childrenWrap);
    }

    return wrapper;
}
