frappe.pages['organizational-chart'] = frappe.pages['organizational-chart'] || {};

frappe.pages['organizational-chart'].on_page_show = function (wrapper) {
    // Delay to let ERPNext finish its own rendering
    setTimeout(() => {
        apply_custom_org_chart(wrapper);
    }, 300);
};

function apply_custom_org_chart(wrapper) {
    const container = wrapper.querySelector(".get-org-chart");
    if (!container) return;

    // Prevent infinite re-render
    if (container.dataset.customized === "1") return;
    container.dataset.customized = "1";

    if (typeof getOrgChart === "undefined") {
        console.error("getOrgChart not loaded");
        return;
    }

    // Fetch Employee hierarchy
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Employee",
            fields: [
                "name",
                "employee_name",
                "reports_to",
                "designation",
                "image"
            ],
            limit_page_length: 1000
        },
        callback(r) {
            if (!r.message) return;

            const data = r.message.map(emp => ({
                id: emp.name,
                parentId: emp.reports_to || null,
                name: emp.employee_name || emp.name,
                title: emp.designation || "",
                img: emp.image || ""
            }));

            // Remove default ERPNext chart
            container.innerHTML = "";

            // Render CUSTOM chart (VERTICAL)
            new getOrgChart(container, {
                dataSource: data,
                primaryFields: ["name", "title"],
                photoFields: ["img"],

                orientation: getOrgChart.RO_TOP, // vertical
                enableZoom: true,
                enablePan: true,
                expandToLevel: 3,

                levelSeparation: 80,
                siblingSeparation: 40,
                subtreeSeparation: 60,

                boxSize: {
                    width: 240,
                    height: 110
                }
            });
        }
    });
}
