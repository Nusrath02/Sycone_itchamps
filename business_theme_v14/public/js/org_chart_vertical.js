(function () {

    function applyVerticalOrgChart() {
        const defaultContainer = document.querySelector(".get-org-chart");
        if (!defaultContainer) return;

        // Prevent infinite re-apply
        if (defaultContainer.dataset.verticalApplied === "1") return;
        defaultContainer.dataset.verticalApplied = "1";

        console.log("✅ Applying Vertical Org Chart");

        defaultContainer.innerHTML = "";
        const container = document.createElement("div");
        container.className = "vertical-org-container";
        defaultContainer.appendChild(container);

        loadOrgData($(container));
    }

    // Watch for ERPNext re-render
    function observeOrgChart() {
        const pageBody = document.querySelector(".page-body");
        if (!pageBody) return;

        const observer = new MutationObserver(() => {
            applyVerticalOrgChart();
        });

        observer.observe(pageBody, {
            childList: true,
            subtree: true
        });
    }

    frappe.router.on("change", () => {
        if (frappe.get_route_str() !== "organizational-chart") return;

        console.log("📍 Organizational Chart route detected");

        setTimeout(() => {
            applyVerticalOrgChart();
            observeOrgChart();
        }, 600);
    });

})();
