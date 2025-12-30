(function () {

    function applyVerticalLayout() {
        const hierarchy = document.querySelector(".hierarchy");
        if (!hierarchy) return;

        console.log("✅ Enforcing vertical org chart");

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

    function waitForChartAndApply() {
        let tries = 0;
        const interval = setInterval(() => {
            if (document.querySelector(".hierarchy")) {
                applyVerticalLayout();
                clearInterval(interval);
            }
            if (++tries > 30) clearInterval(interval);
        }, 300);
    }

    // 🔥 THIS IS THE IMPORTANT PART
    frappe.pages["organizational-chart"] =
        frappe.pages["organizational-chart"] || {};

    frappe.pages["organizational-chart"].on_page_show = function () {
        console.log("📄 Org chart page shown");
        waitForChartAndApply();
    };

})();
