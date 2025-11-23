// Vehicles modal and form handling

import { Vehicle } from "../models/vehicle.js";
import { createModal } from "../components/modal.js";

// Open add/edit modal
export function openVehicleModal(
  vehicleOrNull: Vehicle | null,
  onSave: (vehicle: Vehicle) => void
): void {
  try {
    const vehicle = vehicleOrNull;
    const isEdit = !!vehicle;

    const formHtml = `
    <form id="vehicle-form" style="display: flex; flex-direction: column; gap: 24px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Name *</label>
          <input type="text" id="vehicle-name" value="${vehicle?.name || ""}" required style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Kennzeichen *</label>
          <input type="text" id="vehicle-plate" value="${vehicle?.licensePlate || ""}" required style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Kategorie</label>
          <input type="text" id="vehicle-category" value="${vehicle?.category || ""}" style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Status</label>
          <select id="vehicle-status" style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
            <option value="available" ${vehicle?.status === "available" ? "selected" : ""}>Verfügbar</option>
            <option value="in_use" ${vehicle?.status === "in_use" ? "selected" : ""}>In Nutzung</option>
            <option value="reserved" ${vehicle?.status === "reserved" ? "selected" : ""}>Reserviert</option>
            <option value="maintenance" ${vehicle?.status === "maintenance" ? "selected" : ""}>Wartung</option>
            <option value="out_of_service" ${vehicle?.status === "out_of_service" ? "selected" : ""}>Außer Betrieb</option>
          </select>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">KM *</label>
          <input type="number" id="vehicle-odometer" value="${vehicle?.odometerKm || 0}" min="0" required style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Kraftstoff</label>
          <select id="vehicle-fuel" style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
            <option value="Diesel" ${vehicle?.fuelType === "Diesel" ? "selected" : ""}>Diesel</option>
            <option value="Benzin" ${vehicle?.fuelType === "Benzin" ? "selected" : ""}>Benzin</option>
            <option value="Elektro" ${vehicle?.fuelType === "Elektro" ? "selected" : ""}>Elektro</option>
          </select>
        </div>
      </div>
      <div>
        <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Notizen</label>
        <textarea id="vehicle-notes" rows="3" style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; font-family: Inter, sans-serif;">${vehicle?.notes || ""}</textarea>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
        <button type="button" class="btn btn-secondary" id="btn-cancel">Abbrechen</button>
        <button type="submit" class="btn btn-primary">${isEdit ? "Speichern" : "Hinzufügen"}</button>
      </div>
    </form>
  `;

    const modal = createModal(
      isEdit ? "Fahrzeug bearbeiten" : "Neues Fahrzeug",
      formHtml,
      () => {}
    );

    if (!modal) {
      console.error("Failed to create modal");
      alert("Fehler beim Erstellen des Formulars. Bitte versuchen Sie es erneut.");
      return;
    }

    const form = modal.querySelector("#vehicle-form") as HTMLFormElement;
    const cancelBtn = modal.querySelector("#btn-cancel");

    if (!form) {
      console.error("Form not found in modal");
      modal.remove();
      alert("Fehler beim Laden des Formulars. Bitte versuchen Sie es erneut.");
      return;
    }

    cancelBtn?.addEventListener("click", () => {
      modal.remove();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = modal.querySelector("#vehicle-name") as HTMLInputElement;
      const plateInput = modal.querySelector("#vehicle-plate") as HTMLInputElement;
      const categoryInput = modal.querySelector("#vehicle-category") as HTMLInputElement;
      const statusSelect = modal.querySelector("#vehicle-status") as HTMLSelectElement;
      const odometerInput = modal.querySelector("#vehicle-odometer") as HTMLInputElement;
      const fuelSelect = modal.querySelector("#vehicle-fuel") as HTMLSelectElement;
      const notesTextarea = modal.querySelector("#vehicle-notes") as HTMLTextAreaElement;

      const name = nameInput?.value || "";
      const plate = plateInput?.value || "";
      const category = categoryInput?.value || "";
      const status = (statusSelect?.value || "available") as Vehicle["status"];
      const odometer = parseInt(odometerInput?.value || "0");
      const fuelType = fuelSelect?.value || "";
      const notes = notesTextarea?.value || "";

      if (!name || !plate) {
        alert("Name und Kennzeichen sind erforderlich");
        return;
      }

      let savedVehicle: Vehicle;
      if (isEdit && vehicle) {
        // Update existing
        savedVehicle = {
          ...vehicle,
          name,
          licensePlate: plate,
          category,
          status,
          odometerKm: odometer,
          fuelType,
          notes,
        };
      } else {
        // Create new
        savedVehicle = {
          id: `v${Date.now()}`,
          name,
          licensePlate: plate,
          category,
          assignedDriverId: null,
          status,
          odometerKm: odometer,
          fuelType,
          notes,
          nextMaintenanceDate: null,
          nextMaintenanceKm: null,
          insuranceExpiry: null,
          tuvExpiry: null,
          ownerType: "company",
          leasing: {
            company: null,
            monthlyRate: null,
            startDate: null,
            endDate: null,
          },
          vin: null,
          modelYear: null,
          color: null,
          insurance: {
            provider: null,
            policyNumber: null,
          },
          equipment: [],
          damages: [],
          costs: [],
        };
      }

      modal.remove();
      onSave(savedVehicle);
    });
  } catch (error) {
    console.error("Error in openVehicleModal:", error);
    alert("Fehler beim Öffnen des Formulars. Bitte versuchen Sie es erneut.");
  }
}

