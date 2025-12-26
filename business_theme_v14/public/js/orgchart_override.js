(function () {

  let orgChartRendered = false;

  function render_vertical_org_chart() {
    // Only on Organizational Chart page
    if (frappe.get_route_str() !== "organizational-chart") return;

    const container = document.querySelector(".get-org-chart");
    if (!container) return;

    // Stop if already rendered vertically
    if (orgChartRendered) return;

    if (typeof getOrgChart === "undefined") return;

    orgChartRendered = true;

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

        // Clear any chart created by Frappe
        container.innerHTML = "";

        // FORCE vertical org chart
        new getOrgChart(container, {
          dataSource: data,
          primaryFields: ["name", "title"],
          photoFields: ["img"],

          // 🔒 ALWAYS vertical
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

  // 🔁 Retry until Frappe finishes loading its chart
  function wait_and_override() {
    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;

      render_vertical_org_chart();

      // stop after success or max retries
      if (orgChartRendered || attempts > 15) {
        clearInterval(interval);
      }
    }, 300);
  }

  // SPA navigation
  frappe.router.on("change", () => {
    orgChartRendered = false;
    wait_and_override();
  });

  // Hard refresh
  document.addEventListener("DOMContentLoaded", () => {
    orgChartRendered = false;
    wait_and_override();
  });

})();
