(function () {

    let applied = false; // GLOBAL guard (important)

    function applyVerticalOrgChart() {
        const defaultContainer = document.querySelector(".get-org-chart");
        if (!defaultContainer) return;

        if (applied) return;
        applied = true;

        console.log("✅ Applying Vertical Org Chart");

        defaultContainer.innerHTML = "";

        const container = document.createElement("div");
        container.className = "vertical-org-container";
        defaultContainer.appendChild(container);

        loadOrgData($(container));
    }

    function waitForOrgChartAndApply() {
        const observer = new MutationObserver(() => {
            const orgChart = document.querySelector(".get-org-chart");
            if (orgChart) {
                observer.disconnect();
                setTimeout(applyVerticalOrgChart, 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    frappe.router.on("change", () => {
        if (frappe.get_route_str() !== "organizational-chart") return;

        console.log("📍 Organizational Chart route detected");

        applied = false; // reset on every visit
        waitForOrgChartAndApply();
    });

})();
