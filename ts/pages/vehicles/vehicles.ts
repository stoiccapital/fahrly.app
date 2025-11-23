// Vehicles List Page

import { Vehicle } from "../../models/vehicle.js";
import { mockVehicles, mockDrivers } from "../../data/mock-data.js";
import {
  VehiclesState,
  createVehiclesState,
  getFilteredVehicles,
  findVehicle,
  upsertVehicle,
} from "../../services/vehicles.service.js";
import { renderVehiclesTable } from "../../ui/vehicles.render.js";
import { openVehicleModal } from "../../ui/vehicles.modal.js";

// State
let state: VehiclesState = createVehiclesState(mockVehicles, mockDrivers);

// Open vehicle detail page
function openDetail(id: string): void {
  window.location.href = `vehicle-detail.html?id=${id}`;
}

// Open edit modal
function openEditModal(vehicleId: string | null): void {
  try {
    const vehicle = vehicleId ? findVehicle(state, vehicleId) ?? null : null;
    openVehicleModal(vehicle, (savedVehicle) => {
      upsertVehicle(state, savedVehicle);
      render();
    });
  } catch (error) {
    console.error("Error in openEditModal:", error);
    alert("Fehler beim Öffnen des Formulars. Bitte versuchen Sie es erneut.");
  }
}

// Render vehicles
function render(): void {
  const filtered = getFilteredVehicles(state);
  renderVehiclesTable(filtered, state.drivers, openDetail, openEditModal);
}

// Initialize
function init(): void {
  // Search input
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  searchInput?.addEventListener("input", (e) => {
    state.searchQuery = (e.target as HTMLInputElement).value;
    render();
  });

  // Status filters
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.currentFilter = pill.getAttribute("data-status") || "all";
      render();
    });
  });

  // Add vehicle button
  const addButton = document.getElementById("btn-add-vehicle");
  if (addButton) {
    addButton.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        openEditModal(null);
      } catch (error) {
        console.error("Error opening modal:", error);
        alert("Fehler beim Öffnen des Formulars: " + error);
      }
    });
  } else {
    console.error("Add vehicle button not found");
  }

  // Initial render
  render();
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
