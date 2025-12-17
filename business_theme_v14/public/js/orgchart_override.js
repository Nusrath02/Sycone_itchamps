frappe.after_ajax(() => {
  // Run ONLY on Organizational Chart page
  if (frappe.get_route_str() !== "organizational-chart") return;

  setTimeout(() => {
    const container = document.querySelector(".get-org-chart");

    // Safety checks
    if (!container) {
      console.warn("Org chart container not found");
      return;
    }

    // Prevent double rendering
    if (container.dataset.customized) return;
    container.dataset.customized = "1";

    // Ensure getOrgChart is loaded
    if (typeof getOrgChart === "undefined") {
      console.error("getOrgChart library not loaded");
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
        if (!r.message || !Array.isArray(r.message)) return;

        // Convert ERPNext data → getOrgChart format
        const data = r.message.map(emp => ({
          id: emp.name,
          parentId: emp.reports_to || null,
          name: emp.employee_name || emp.name,
          title: emp.designation || "",
          img: emp.image || ""
        }));

        // Clear default ERPNext chart
        container.innerHTML = "";

        // Initialize getOrgChart (VERTICAL)
        new getOrgChart(container, {
          dataSource: data,

          primaryFields: ["name", "title"],
          photoFields: ["img"],

          orientation: getOrgChart.RO_TOP,   // ✅ Vertical (Top → Bottom)

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

  }, 600); // wait for ERPNext page + SVG to be ready
});
