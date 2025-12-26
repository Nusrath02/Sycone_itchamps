(function () {

  function apply_org_chart_override() {
    // Run only on Organizational Chart page
    if (frappe.get_route_str() !== "organizational-chart") return;

    const container = document.querySelector(".get-org-chart");
    if (!container) return;

    // Prevent multiple re-renders
    if (container.dataset.customized === "1") return;
    container.dataset.customized = "1";

    // Ensure library is loaded
    if (typeof getOrgChart === "undefined") return;

    // Fetch employee data
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

        // Map data for getOrgChart
        const data = r.message.map(e => ({
          id: e.name,
          parentId: e.reports_to || null,
          name: e.employee_name || e.name,
          title: e.designation || "",
          img: e.image || ""
        }));

        // Clear existing chart
        container.innerHTML = "";

        // Render org chart (VERTICAL)
        new getOrgChart(container, {
          dataSource: data,
          primaryFields: ["name", "title"],
          photoFields: ["img"],

          // ✅ Vertical (Top → Bottom)
          orientation: getOrgChart.RO_TOP,

          enableZoom: true,
          enablePan: true,
          expandToLevel: 3,

          boxSize: {
            width: 240,
            height: 110
          }
        });
      }
    });
  }

  // 🔁 Trigger on route change (SPA navigation)
  frappe.router.on("change", () => {
    setTimeout(apply_org_chart_override, 400);
  });

  // 🔁 Trigger on hard refresh
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(apply_org_chart_override, 800);
  });

})();
