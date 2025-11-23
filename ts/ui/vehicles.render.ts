// Vehicles rendering functions

import { Vehicle, Driver } from "../models/vehicle.js";
import { getDriverName, getStatusLabel, getComplianceWarnings } from "../utils/vehicles.helpers.js";

// Render vehicle row
function renderVehicleRow(vehicle: Vehicle, drivers: Driver[]): string {
  const driverName = getDriverName(vehicle.assignedDriverId, drivers);
  const statusLabel = getStatusLabel(vehicle.status);
  const warnings = getComplianceWarnings(vehicle);
  const isConnected = vehicle.telematics?.isConnected === true;

  return `
    <tr data-vehicle-id="${vehicle.id}">
      <td>
        <div class="vehicle-cell">
          <div class="vehicle-name">
            ${vehicle.name}
            ${isConnected ? '<span class="badge badge-connected">Connected</span>' : ''}
          </div>
          <div class="vehicle-plate">${vehicle.licensePlate}</div>
        </div>
      </td>
      <td>${vehicle.category}</td>
      <td>${driverName}</td>
      <td><span class="pill pill-status-${vehicle.status}">${statusLabel}</span></td>
      <td>${vehicle.odometerKm.toLocaleString("de-DE")} km</td>
      <td>
        <div class="compliance-icons">
          <div class="compliance-icon ${warnings.insurance}" title="Versicherung">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="compliance-icon ${warnings.tuv}" title="TÜV">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
        </div>
      </td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-secondary" data-action="open" data-vehicle-id="${vehicle.id}">Öffnen</button>
        <button class="btn btn-sm btn-secondary" data-action="edit" data-vehicle-id="${vehicle.id}">Bearbeiten</button>
      </td>
    </tr>
  `;
}

// Render vehicle card (mobile)
function renderVehicleCard(vehicle: Vehicle, drivers: Driver[]): string {
  const driverName = getDriverName(vehicle.assignedDriverId, drivers);
  const statusLabel = getStatusLabel(vehicle.status);
  const warnings = getComplianceWarnings(vehicle);
  const isConnected = vehicle.telematics?.isConnected === true;

  return `
    <div class="vehicle-card" data-vehicle-id="${vehicle.id}">
      <div class="vehicle-card-header">
        <div class="vehicle-card-title">
          <div class="vehicle-name">
            ${vehicle.name}
            ${isConnected ? '<span class="badge badge-connected">Connected</span>' : ''}
          </div>
          <div class="vehicle-plate">${vehicle.licensePlate}</div>
        </div>
        <div class="vehicle-card-actions">
          <button class="btn btn-sm btn-secondary" data-action="open" data-vehicle-id="${vehicle.id}">Öffnen</button>
          <button class="btn btn-sm btn-secondary" data-action="edit" data-vehicle-id="${vehicle.id}">Bearbeiten</button>
        </div>
      </div>
      <div class="vehicle-card-body">
        <div class="vehicle-card-field">
          <div class="vehicle-card-label">Kategorie</div>
          <div class="vehicle-card-value">${vehicle.category}</div>
        </div>
        <div class="vehicle-card-field">
          <div class="vehicle-card-label">Fahrer</div>
          <div class="vehicle-card-value">${driverName}</div>
        </div>
        <div class="vehicle-card-field">
          <div class="vehicle-card-label">Status</div>
          <div class="vehicle-card-value"><span class="pill pill-status-${vehicle.status}">${statusLabel}</span></div>
        </div>
        <div class="vehicle-card-field">
          <div class="vehicle-card-label">KM</div>
          <div class="vehicle-card-value">${vehicle.odometerKm.toLocaleString("de-DE")} km</div>
        </div>
      </div>
    </div>
  `;
}

// Render vehicles table
export function renderVehiclesTable(
  filteredVehicles: Vehicle[],
  drivers: Driver[],
  onOpen: (id: string) => void,
  onEdit: (id: string) => void
): void {
  const tbody = document.getElementById("vehicles-tbody");
  const cardsContainer = document.getElementById("vehicles-cards");

  if (!tbody || !cardsContainer) return;

  if (filteredVehicles.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px; color: #6b7280;">
          Keine Fahrzeuge gefunden
        </td>
      </tr>
    `;
    cardsContainer.innerHTML = `
      <div style="text-align: center; padding: 48px; color: #6b7280;">
        Keine Fahrzeuge gefunden
      </div>
    `;
    return;
  }

  tbody.innerHTML = filteredVehicles.map((v) => renderVehicleRow(v, drivers)).join("");
  cardsContainer.innerHTML = filteredVehicles.map((v) => renderVehicleCard(v, drivers)).join("");

  // Attach event listeners
  document.querySelectorAll("[data-vehicle-id]").forEach((el) => {
    const vehicleId = el.getAttribute("data-vehicle-id");
    if (vehicleId) {
      el.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) return; // Don't navigate if clicking button
        onOpen(vehicleId);
      });
    }
  });

  document.querySelectorAll("[data-action='open']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const vehicleId = btn.getAttribute("data-vehicle-id");
      if (vehicleId) {
        onOpen(vehicleId);
      }
    });
  });

  document.querySelectorAll("[data-action='edit']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const vehicleId = btn.getAttribute("data-vehicle-id");
      if (vehicleId) {
        onEdit(vehicleId);
      }
    });
  });
}

