(function () {

  function apply_org_chart_override() {
    if (frappe.get_route_str() !== "organizational-chart") return;

    const container = document.querySelector(".get-org-chart");
    if (!container) return;

    if (container.dataset.customized === "1") return;
    container.dataset.customized = "1";

    if (typeof getOrgChart === "undefined") return;

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

        const data = r.message.map(e => ({
          id: e.name,
          parentId: e.reports_to || null,
          name: e.employee_name || e.name,
          title: e.designation || "",
          img: e.image || ""
        }));

        container.innerHTML = "";

        new getOrgChart(container, {
          dataSource: data,
          primaryFields: ["name", "title"],
          photoFields: ["img"],

          // choose ONE
          orientation: getOrgChart.RO_TOP,   // vertical
          // orientation: getOrgChart.RO_LEFT, // horizontal

          enableZoom: true,
          enablePan: true,
          expandToLevel: 3,

          boxSize: { width: 240, height: 110 }
        });
      }
    });
  }

  // 🔁 Trigger on navigation
  frappe.router.on("change", () => {
    setTimeout(apply_org_chart_override, 400);
  });

  // 🔁 Trigger on hard refresh
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(apply_org_chart_override, 800);
  });
})();
