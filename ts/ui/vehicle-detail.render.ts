// Vehicle detail rendering functions

import { Vehicle, Driver } from "../models/vehicle.js";
import {
  getDriverName,
  getStatusLabel,
  formatDate,
  getComplianceWarnings,
} from "../utils/vehicle-detail.helpers.js";
import { VehicleDetailState } from "../services/vehicle-detail.service.js";

// Render overview card
function renderOverviewCard(vehicle: Vehicle, drivers: Driver[]): string {
  const warnings = getComplianceWarnings(vehicle);
  const driverName = getDriverName(drivers, vehicle.assignedDriverId);

  return `
    <div class="overview-grid">
      <div class="overview-field">
        <div class="overview-label">Name</div>
        <div class="overview-value">${vehicle.name}</div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Kennzeichen</div>
        <div class="overview-value">${vehicle.licensePlate}</div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Kategorie</div>
        <div class="overview-value">${vehicle.category}</div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Status</div>
        <div class="overview-value">
          <span class="pill pill-status-${vehicle.status}">${getStatusLabel(vehicle.status)}</span>
        </div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Zugewiesener Fahrer</div>
        <div class="overview-value">${driverName}</div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Kilometerstand</div>
        <div class="overview-value">${vehicle.odometerKm.toLocaleString("de-DE")} km</div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Nächste Wartung</div>
        <div class="overview-value">
          ${vehicle.nextMaintenanceDate ? formatDate(vehicle.nextMaintenanceDate) : "—"}
          ${vehicle.nextMaintenanceKm ? ` / ${vehicle.nextMaintenanceKm.toLocaleString("de-DE")} km` : ""}
        </div>
      </div>
      <div class="overview-field">
        <div class="overview-label">Versicherung</div>
        <div class="overview-value">
          ${vehicle.insuranceExpiry ? formatDate(vehicle.insuranceExpiry) : "—"}
          ${warnings.insurance !== "ok" ? `<span class="badge badge-${warnings.insurance === "danger" ? "danger" : "warning"}" style="margin-left: 8px;">!</span>` : ""}
        </div>
      </div>
      <div class="overview-field">
        <div class="overview-label">TÜV</div>
        <div class="overview-value">
          ${vehicle.tuvExpiry ? formatDate(vehicle.tuvExpiry) : "—"}
          ${warnings.tuv !== "ok" ? `<span class="badge badge-${warnings.tuv === "danger" ? "danger" : "warning"}" style="margin-left: 8px;">!</span>` : ""}
        </div>
      </div>
    </div>
  `;
}

// Render telematics block
function renderTelematicsBlock(vehicle: Vehicle): string {
  const telematics = vehicle.telematics;
  const isConnected = telematics?.isConnected === true;

  if (!isConnected) {
    return `
      <div class="telematics-card">
        <div class="telematics-connect-card">
          <div class="telematics-connect-title">Telematik verbinden</div>
          <div class="telematics-connect-description">
            Verbinden Sie Ihr Fahrzeug mit einem Telematik-System für automatische KM-Stand-Erfassung, Kraftstoffverbrauch und Gesundheitswarnungen.
          </div>
          <div class="telematics-value-props">
            <div class="telematics-value-prop">
              <svg class="telematics-value-prop-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <div style="font-weight: 600; color: #111827;">Automatische KM</div>
              <div class="telematics-value-prop-label">Keine manuelle Eingabe</div>
            </div>
            <div class="telematics-value-prop">
              <svg class="telematics-value-prop-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div style="font-weight: 600; color: #111827;">Kraftstoff-Tracking</div>
              <div class="telematics-value-prop-label">Echtzeit-Verbrauch</div>
            </div>
            <div class="telematics-value-prop">
              <svg class="telematics-value-prop-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div style="font-weight: 600; color: #111827;">Gesundheitswarnungen</div>
              <div class="telematics-value-prop-label">Proaktive Wartung</div>
            </div>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Provider</label>
            <select id="telematics-provider" style="width: 100%; max-width: 300px; margin: 0 auto; display: block; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
              <option value="Samsara">Samsara</option>
              <option value="Webfleet">Webfleet</option>
              <option value="Geotab">Geotab</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <button class="btn btn-primary" id="btn-connect-telematics" style="margin-top: 24px;">
            Verbinden
          </button>
        </div>
      </div>
    `;
  }

  const statusLabel = telematics?.statusLive === "driving" ? "Fährt" :
                      telematics?.statusLive === "idle" ? "Leerlauf" :
                      telematics?.statusLive === "offline" ? "Offline" : "—";

  const odometerDelta = telematics?.odometerKmLive && vehicle.odometerKm
    ? telematics.odometerKmLive - vehicle.odometerKm
    : null;

  const lastSync = telematics?.lastSyncAt
    ? new Date(telematics.lastSyncAt).toLocaleString("de-DE")
    : "—";

  return `
    <div class="telematics-card">
      <div class="telematics-card-header">
        <div class="telematics-card-title">Telematik verbunden</div>
      </div>
      <div class="telematics-connected-grid">
        <div class="telematics-connected-field">
          <div class="telematics-connected-label">Provider</div>
          <div class="telematics-connected-value">${telematics.provider}</div>
        </div>
        <div class="telematics-connected-field">
          <div class="telematics-connected-label">Letzte Synchronisation</div>
          <div class="telematics-connected-value">${lastSync}</div>
        </div>
        <div class="telematics-connected-field">
          <div class="telematics-connected-label">Live-Status</div>
          <div class="telematics-connected-value">
            <span class="pill pill-status-${telematics.statusLive || "offline"}">${statusLabel}</span>
          </div>
        </div>
        <div class="telematics-connected-field">
          <div class="telematics-connected-label">KM (Live)</div>
          <div class="telematics-connected-value">
            ${telematics.odometerKmLive ? telematics.odometerKmLive.toLocaleString("de-DE") + " km" : "—"}
            ${odometerDelta !== null ? ` <span style="color: ${odometerDelta >= 0 ? "#10b981" : "#ef4444"}; font-size: 12px;">(${odometerDelta >= 0 ? "+" : ""}${odometerDelta})</span>` : ""}
          </div>
        </div>
        <div class="telematics-connected-field">
          <div class="telematics-connected-label">${vehicle.fuelType === "Elektro" ? "Batterie" : "Kraftstoff"}</div>
          <div class="telematics-connected-value">
            ${vehicle.fuelType === "Elektro"
              ? (telematics.batteryPctLive !== null ? `${telematics.batteryPctLive}%` : "—")
              : (telematics.fuelLevelLive !== null ? `${telematics.fuelLevelLive}%` : "—")}
          </div>
        </div>
      </div>
      <div class="telematics-disconnect">
        <button class="btn btn-secondary btn-sm" id="btn-disconnect-telematics">Trennen</button>
      </div>
    </div>
  `;
}

// Render tab: Overview
function renderTabOverview(vehicle: Vehicle, drivers: Driver[]): string {
  const driverName = getDriverName(drivers, vehicle.assignedDriverId);
  const warnings = getComplianceWarnings(vehicle);

  return `
    <div class="tab-section">
      <div class="tab-section-title">Basis-Informationen</div>
      <div class="tab-grid">
        <div class="overview-field">
          <div class="overview-label">VIN</div>
          <div class="overview-value">${vehicle.vin || "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Baujahr</div>
          <div class="overview-value">${vehicle.modelYear || "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Farbe</div>
          <div class="overview-value">${vehicle.color || "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Kraftstoff</div>
          <div class="overview-value">${vehicle.fuelType}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Fahrer</div>
          <div class="overview-value">${driverName}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Besitzart</div>
          <div class="overview-value">${
            vehicle.ownerType === "company" ? "Firma" :
            vehicle.ownerType === "driver_owned" ? "Fahrer" :
            vehicle.ownerType === "lease" ? "Leasing" :
            vehicle.ownerType === "subscription" ? "Abonnement" : "—"
          }</div>
        </div>
      </div>
    </div>

    ${vehicle.leasing.company ? `
    <div class="tab-section">
      <div class="tab-section-title">Leasing</div>
      <div class="tab-grid">
        <div class="overview-field">
          <div class="overview-label">Leasingfirma</div>
          <div class="overview-value">${vehicle.leasing.company}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Monatliche Rate</div>
          <div class="overview-value">${vehicle.leasing.monthlyRate ? vehicle.leasing.monthlyRate.toLocaleString("de-DE", { style: "currency", currency: "EUR" }) : "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Startdatum</div>
          <div class="overview-value">${formatDate(vehicle.leasing.startDate)}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Enddatum</div>
          <div class="overview-value">${formatDate(vehicle.leasing.endDate)}</div>
        </div>
      </div>
    </div>
    ` : ""}

    <div class="tab-section">
      <div class="tab-section-title">Compliance</div>
      <div class="tab-grid">
        <div class="overview-field">
          <div class="overview-label">Versicherung Ablauf</div>
          <div class="overview-value">
            ${formatDate(vehicle.insuranceExpiry)}
            ${warnings.insurance !== "ok" ? `<span class="badge badge-${warnings.insurance === "danger" ? "danger" : "warning"}">!</span>` : ""}
          </div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Versicherung Anbieter</div>
          <div class="overview-value">${vehicle.insurance.provider || "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Versicherung Policenummer</div>
          <div class="overview-value">${vehicle.insurance.policyNumber || "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">TÜV Ablauf</div>
          <div class="overview-value">
            ${formatDate(vehicle.tuvExpiry)}
            ${warnings.tuv !== "ok" ? `<span class="badge badge-${warnings.tuv === "danger" ? "danger" : "warning"}">!</span>` : ""}
          </div>
        </div>
      </div>
    </div>

    ${vehicle.telematics?.isConnected ? `
    <div class="tab-section">
      <div class="tab-section-title">Telematik (Zusammenfassung)</div>
      <div class="tab-grid">
        <div class="overview-field">
          <div class="overview-label">Provider</div>
          <div class="overview-value">${vehicle.telematics.provider}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Live KM</div>
          <div class="overview-value">${vehicle.telematics.odometerKmLive ? vehicle.telematics.odometerKmLive.toLocaleString("de-DE") + " km" : "—"}</div>
        </div>
        <div class="overview-field">
          <div class="overview-label">Status</div>
          <div class="overview-value">
            <span class="pill pill-status-${vehicle.telematics.statusLive || "offline"}">
              ${vehicle.telematics.statusLive === "driving" ? "Fährt" :
                vehicle.telematics.statusLive === "idle" ? "Leerlauf" :
                vehicle.telematics.statusLive === "offline" ? "Offline" : "—"}
            </span>
          </div>
        </div>
        <div class="overview-field">
          <div class="overview-label">DTC Alerts</div>
          <div class="overview-value">${vehicle.telematics.dtcAlerts.length}</div>
        </div>
      </div>
    </div>
    ` : ""}

    ${vehicle.notes ? `
    <div class="tab-section">
      <div class="tab-section-title">Notizen</div>
      <div style="color: #374151; line-height: 1.6;">${vehicle.notes}</div>
    </div>
    ` : ""}
  `;
}

// Render tab: Telematics
function renderTabTelematics(vehicle: Vehicle): string {
  if (!vehicle.telematics?.isConnected) {
    return '<div class="empty-state">Telematik nicht verbunden</div>';
  }

  const telematics = vehicle.telematics;

  return `
    <div class="tab-section">
      <div class="tab-section-title">Live-Status Historie</div>
      <div class="empty-state">Funktion wird implementiert...</div>
    </div>

    <div class="tab-section">
      <div class="tab-section-title">DTC Alerts</div>
      ${telematics.dtcAlerts.length === 0
        ? '<div class="empty-state">Keine Alerts</div>'
        : telematics.dtcAlerts.map(alert => `
          <div class="dtc-alert dtc-alert-severity-${alert.severity}">
            <div class="dtc-alert-header">
              <div class="dtc-alert-code">${alert.code}</div>
              <div class="dtc-alert-date">${formatDate(alert.date)}</div>
            </div>
            <div class="dtc-alert-label">${alert.label}</div>
          </div>
        `).join("")
      }
    </div>

    <div class="tab-section">
      <div class="tab-section-title">Harsh Events</div>
      <div class="empty-state">Funktion wird implementiert...</div>
    </div>

    <div class="tab-section">
      <div class="tab-section-title">Fahrt-Zusammenfassungen</div>
      <div class="empty-state">Funktion wird implementiert...</div>
    </div>
  `;
}

// Render tab: Documents
function renderTabDocuments(): string {
  return `
    <div class="tab-section">
      <div class="tab-section-title">Dokumente</div>
      <div class="empty-state">
        <p>Dokumenten-Upload wird implementiert...</p>
        <button class="btn btn-primary" style="margin-top: 16px;" disabled>Dokument hochladen</button>
      </div>
    </div>
  `;
}

// Render tab: Maintenance
function renderTabMaintenance(vehicle: Vehicle): string {
  return `
    <div class="tab-section">
      <div class="tab-section-title">Wartung</div>
      <div class="empty-state">
        <p>Wartungsliste wird implementiert...</p>
        <button class="btn btn-primary" style="margin-top: 16px;" disabled>Wartung hinzufügen</button>
      </div>
    </div>
  `;
}

// Render tab: Damages
function renderTabDamages(vehicle: Vehicle, drivers: Driver[]): string {
  if (vehicle.damages.length === 0) {
    return `
      <div class="tab-section">
        <div class="tab-section-title">Schäden</div>
        <div class="empty-state">
          <p>Keine Schäden erfasst</p>
          <button class="btn btn-primary" style="margin-top: 16px;" disabled>Schaden hinzufügen</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="tab-section">
      <div class="tab-section-title">Schäden</div>
      <table class="tab-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Beschreibung</th>
            <th>Verantwortlicher</th>
          </tr>
        </thead>
        <tbody>
          ${vehicle.damages.map(damage => `
            <tr>
              <td>${formatDate(damage.date)}</td>
              <td>${damage.description}</td>
              <td>${getDriverName(drivers, damage.responsibleDriverId)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <button class="btn btn-primary" style="margin-top: 16px;" disabled>Schaden hinzufügen</button>
    </div>
  `;
}

// Render tab: Costs
function renderTabCosts(vehicle: Vehicle): string {
  const costs = vehicle.costs;
  const monthlyTotal = costs
    .filter(c => {
      const costDate = new Date(c.date);
      const now = new Date();
      return costDate.getMonth() === now.getMonth() && costDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, c) => sum + c.amount, 0);

  if (costs.length === 0) {
    return `
      <div class="tab-section">
        <div class="tab-section-title">Kosten</div>
        <div class="empty-state">
          <p>Keine Kosten erfasst</p>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 6px;">
            <strong>Monatliche Gesamtkosten: 0,00 €</strong>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="tab-section">
      <div class="tab-section-title">Kosten</div>
      <table class="tab-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Typ</th>
            <th>Betrag</th>
            <th>Notiz</th>
          </tr>
        </thead>
        <tbody>
          ${costs.map(cost => `
            <tr>
              <td>${formatDate(cost.date)}</td>
              <td>${cost.type}</td>
              <td>${cost.amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</td>
              <td>${cost.note}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 6px;">
        <strong>Monatliche Gesamtkosten: ${monthlyTotal.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</strong>
      </div>
    </div>
  `;
}

// Render page
export function renderPage(state: VehicleDetailState): void {
  if (!state.currentVehicle) return;

  const vehicle = state.currentVehicle;
  const drivers = state.drivers;

  // Update title
  const titleEl = document.getElementById("vehicle-title");
  if (titleEl) {
    titleEl.textContent = vehicle.name;
  }

  // Render overview
  const overviewEl = document.getElementById("overview-card");
  if (overviewEl) {
    overviewEl.innerHTML = renderOverviewCard(vehicle, drivers);
  }

  // Render telematics
  const telematicsEl = document.getElementById("telematics-block");
  if (telematicsEl) {
    telematicsEl.innerHTML = renderTelematicsBlock(vehicle);
  }

  // Show/hide telematics tab
  const telematicsTab = document.getElementById("tab-telematics");
  if (telematicsTab) {
    telematicsTab.style.display = vehicle.telematics?.isConnected ? "block" : "none";
  }

  // Render tabs
  const tabPanes = {
    overview: renderTabOverview(vehicle, drivers),
    telematics: renderTabTelematics(vehicle),
    documents: renderTabDocuments(),
    maintenance: renderTabMaintenance(vehicle),
    damages: renderTabDamages(vehicle, drivers),
    costs: renderTabCosts(vehicle),
  };

  Object.entries(tabPanes).forEach(([key, content]) => {
    const pane = document.getElementById(`tab-pane-${key}`);
    if (pane) {
      pane.innerHTML = content;
    }
  });
}

