(function () {

    function applyVerticalLayout() {
        if (frappe.get_route_str() !== "organizational-chart") return;

        const hierarchy = document.querySelector(".hierarchy");
        if (!hierarchy) return;

        console.log("✅ Forcing vertical org chart");

        document.querySelectorAll(".level").forEach(level => {
            level.style.display = "flex";
            level.style.flexDirection = "column";
            level.style.alignItems = "center";
            level.style.justifyContent = "flex-start";
        });

        document.querySelectorAll(".node-children").forEach(ul => {
            ul.style.display = "flex";
            ul.style.flexDirection = "column";
            ul.style.alignItems = "center";
        });
    }

    function waitForChart() {
        let tries = 0;
        const interval = setInterval(() => {
            const hierarchy = document.querySelector(".hierarchy");
            if (hierarchy) {
                applyVerticalLayout();
                clearInterval(interval);
            }
            if (++tries > 25) clearInterval(interval);
        }, 300);
    }

    // Route navigation
    frappe.router.on("change", waitForChart);

    // Full reload
    window.addEventListener("load", waitForChart);

})();
