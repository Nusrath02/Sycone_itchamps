(function () {
    const applyVerticalLayout = () => {
        // Ensure we are on org chart page
        if (frappe.get_route_str() !== "organizational-chart") return;

        const hierarchy = document.querySelector(".hierarchy");
        if (!hierarchy) return;

        // Prevent infinite re-apply
        if (hierarchy.dataset.verticalApplied === "1") return;
        hierarchy.dataset.verticalApplied = "1";

        console.log("✅ Applying vertical org chart");

        /* FORCE VERTICAL LAYOUT */
        document.querySelectorAll(".level").forEach(level => {
            level.style.flexDirection = "column";
            level.style.alignItems = "center";
            level.style.justifyContent = "flex-start";
        });

        document.querySelectorAll(".node-children").forEach(ul => {
            ul.style.flexDirection = "column";
            ul.style.alignItems = "center";
        });
    };

    // 🔁 Retry until DOM is ready (key fix)
    const waitForChart = () => {
        let attempts = 0;
        const interval = setInterval(() => {
            applyVerticalLayout();
            attempts++;

            if (document.querySelector(".hierarchy") || attempts > 20) {
                clearInterval(interval);
            }
        }, 300);
    };

    // 🚀 Runs on page navigation
    frappe.router.on("change", () => {
        waitForChart();
    });

    // 🚀 Runs on full reload
    document.addEventListener("DOMContentLoaded", () => {
        waitForChart();
    });

})();
