(function () {

    function replaceOrgChart() {
        const orgChart = document.querySelector(".get-org-chart");

        if (!orgChart) {
            console.log("⏳ Waiting for org chart...");
            return false;
        }

        // Prevent double replace
        if (orgChart.dataset.vertical === "1") return true;

        console.log("✅ Replacing default org chart with vertical");

        orgChart.dataset.vertical = "1";
        orgChart.innerHTML = `
            <div class="vertical-org-container">
                <h3 style="margin-bottom:16px">Vertical Org Chart Loaded</h3>
            </div>
        `;

        loadOrgData($(orgChart.querySelector(".vertical-org-container")));
        return true;
    }

    function waitUntilRendered() {
        const interval = setInterval(() => {
            if (replaceOrgChart()) {
                clearInterval(interval);
            }
        }, 300);
    }

    frappe.router.on("change", () => {
        if (frappe.get_route_str() !== "organizational-chart") return;

        console.log("📍 Organizational Chart route detected");

        waitUntilRendered();
    });

})();
