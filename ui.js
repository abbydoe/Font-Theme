document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
        });
        this.classList.add('active');

        // Update the displayed content based on the selected tab
        updateContent(this.id);
    });
});

function updateContent(selectedTab) {
    const content = document.querySelector('.content');
    if (selectedTab === 'find-font') {
        content.innerHTML = '<h1>Find Font</h1><p>Search fonts by name or style.</p>';
    } else if (selectedTab === 'font-family') {
        content.innerHTML = '<h1>Font Family</h1><div class="font-section">Font family details here.</div>';
    } else if (selectedTab === 'all-font-categories') {
        content.innerHTML = '<h1>All Font Categories</h1><p>List all font categories.</p>';
    }
}

// Example Figma API integration for font application
figma.ui.onmessage = msg => {
    if (msg.type === 'apply-font') {
        const nodes = figma.currentPage.selection;
        const fontName = msg.fontName;
        async function loadFontAndApply() {
            await figma.loadFontAsync({ family: fontName, style: "Regular" });
            nodes.forEach(node => {
                if ("fontName" in node) {
                    node.fontName = { family: fontName, style: "Regular" };
                }
            });
        }
        loadFontAndApply();
    }
};

document.querySelector('.use-font').addEventListener('click', () => {
    figma.ui.postMessage({ type: 'apply-font', fontName: 'Epilogue' });
});
