document.addEventListener("DOMContentLoaded", function () {
  // Get all tab buttons and content sections
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  // Add click event to each tab button
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove 'active' class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add 'active' class to the clicked tab
      this.classList.add("active");

      // Hide all content sections
      contents.forEach((content) => (content.style.display = "none"));

      // Show the corresponding content section
      const contentId = this.id.replace("-tab", "");
      const targetContent = document.getElementById(contentId);
      if (targetContent) {
        targetContent.style.display = "block";
      }
    });
  });

  // Use Font Button
  document.getElementById("use-font").addEventListener("click", function () {
    parent.postMessage(
      { pluginMessage: { type: "use-font", fontFamily: "Epilogue" } },
      "*"
    );
  });

  // Save Font Button
  document.getElementById("save-font").addEventListener("click", function () {
    parent.postMessage({ pluginMessage: { type: "save-font" } }, "*");
  });
});
