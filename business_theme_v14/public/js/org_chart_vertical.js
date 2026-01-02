function renderTree(nodes, container) {
    const ul = $('<ul class="org-tree"></ul>');

    nodes.forEach(node => {
        const li = $('<li></li>');

        const card = $(`
            <div class="org-card">
                <div class="name">${node.employee_name || node.name}</div>
                <div class="designation">${node.designation || ""}</div>
            </div>
        `);

        li.append(card);

        // ✅ THIS IS WHERE YOUR FIX GOES
        if (node.children && node.children.length) {
            const childUl = $('<ul></ul>');
            renderTree(node.children, childUl);
            li.append(childUl);
        }

        ul.append(li);
    });

    container.append(ul);
}
