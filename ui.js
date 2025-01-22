document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll("[data-tab-target]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Clear all tabs' active states
      tabs.forEach((t) => t.classList.remove("active"));

      // Get the target content based on data attribute
      const target = document.querySelector(tab.dataset.tabTarget);

      // Set active state to the clicked tab and the target content
      tab.classList.add("active");
      if (target) {
        target.classList.add("active");
      }

      // Optionally, send a message back to Figma code.js if needed
      parent.postMessage(
        { pluginMessage: { type: "tab", tab: tab.dataset.tabTarget } },
        "*"
      );
    });
  });
});
