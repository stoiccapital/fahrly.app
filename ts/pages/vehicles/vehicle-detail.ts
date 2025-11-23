// Vehicle Detail Page

import { mockVehicles, mockDrivers } from "../../data/mock-data.js";
import {
  VehicleDetailState,
  createVehicleDetailState,
  loadVehicleOrRedirect,
} from "../../services/vehicle-detail.service.js";
import { renderPage } from "../../ui/vehicle-detail.render.js";
import { bindTelematicsEvents } from "../../ui/vehicle-detail.telematics.js";
import { initTabs } from "../../ui/vehicle-detail.tabs.js";

// State
const state: VehicleDetailState = createVehicleDetailState(mockVehicles, mockDrivers);

// Rerender function
function rerender(): void {
  renderPage(state);
  bindTelematicsEvents(state, rerender); // rebind after DOM update
}

// Initialize
function init(): void {
  // Back button
  document.getElementById("btn-back")?.addEventListener("click", () => {
    window.location.href = "vehicles.html";
  });

  // Load vehicle (with redirect behavior)
  const vehicle = loadVehicleOrRedirect(state);
  if (!vehicle) return; // Redirected, don't continue

  // Render page
  rerender();

  // Initialize tabs
  initTabs();
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
