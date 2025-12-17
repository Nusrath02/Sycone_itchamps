frappe.after_ajax(() => {
  if (frappe.get_route_str() !== "organizational-chart") return;

  setTimeout(() => {
    const container = document.querySelector(".get-org-chart");
    if (!container || container.dataset.customized) return;

    container.dataset.customized = "1";

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
        const data = r.message.map(e => ({
          id: e.name,
          parentId: e.reports_to,
          name: e.employee_name,
          title: e.designation,
          img: e.image
        }));

        // Destroy old chart (important)
        container.innerHTML = "";

        new getOrgChart(container, {
          primaryFields: ["name", "title"],
          photoFields: ["img"],
          dataSource: data,

          orientation: getOrgChart.RO_TOP,   // vertical (top → bottom)
          enableZoom: true,
          enablePan: true,
          expandToLevel: 3,
          levelSeparation: 80,
          siblingSeparation: 40,
          subtreeSeparation: 60,

          boxSize: { width: 240, height: 110 }
        });
      }
    });
  }, 600);
});


// Recursive renderer
function renderNode(node) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.position = "relative";

    // Employee card
    const card = document.createElement("div");
    card.innerText = node.employee_name || node.name;
    card.style.minWidth = "180px";
    card.style.padding = "12px 16px";
    card.style.border = "1px solid #dcdcdc";
    card.style.borderRadius = "6px";
    card.style.background = "#ffffff";
    card.style.fontWeight = "500";
    card.style.textAlign = "center";
    card.style.margin = "10px";
    card.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";

    wrapper.appendChild(card);

    // Children container
    if (node.children && node.children.length) {
        const childrenWrap = document.createElement("div");
        childrenWrap.style.display = "flex";
        childrenWrap.style.flexDirection = "column";
        childrenWrap.style.marginLeft = "50px";
        childrenWrap.style.position = "relative";

        // Vertical connector line
        const verticalLine = document.createElement("div");
        verticalLine.style.position = "absolute";
        verticalLine.style.left = "-25px";
        verticalLine.style.top = "0";
        verticalLine.style.bottom = "0";
        verticalLine.style.width = "1px";
        verticalLine.style.background = "#cbd5e1";

        childrenWrap.appendChild(verticalLine);

        node.children.forEach(child => {
            const childRow = document.createElement("div");
            childRow.style.display = "flex";
            childRow.style.alignItems = "center";

            // Horizontal connector + arrow
            const connector = document.createElement("div");
            connector.style.width = "25px";
            connector.style.height = "1px";
            connector.style.background = "#cbd5e1";
            connector.style.marginRight = "6px";
            connector.style.position = "relative";

            const arrow = document.createElement("span");
            arrow.innerText = "▶";
            arrow.style.fontSize = "10px";
            arrow.style.color = "#94a3b8";
            arrow.style.marginRight = "6px";

            childRow.appendChild(connector);
            childRow.appendChild(arrow);
            childRow.appendChild(renderNode(child));

            childrenWrap.appendChild(childRow);
        });

        wrapper.appendChild(childrenWrap);
    }

    return wrapper;
}
