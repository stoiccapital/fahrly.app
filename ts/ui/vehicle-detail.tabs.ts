// Vehicle detail tabs navigation

// Initialize tabs
export function initTabs(): void {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");

      // Update buttons
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update panes
      tabPanes.forEach((p) => p.classList.remove("active"));
      const targetPane = document.getElementById(`tab-pane-${tabName}`);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
}

