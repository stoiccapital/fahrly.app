// Vehicle detail telematics connect/disconnect handling

import { VehicleDetailState } from "../services/vehicle-detail.service.js";

// Bind telematics events
export function bindTelematicsEvents(
  state: VehicleDetailState,
  rerender: () => void
): void {
  if (!state.currentVehicle) return;

  // Connect button
  const connectBtn = document.getElementById("btn-connect-telematics");
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      if (!state.currentVehicle) return;

      const providerSelect = document.getElementById("telematics-provider") as HTMLSelectElement;
      const provider = providerSelect?.value || "Samsara";

      // Mock connect - create telematics data
      state.currentVehicle.telematics = {
        isConnected: true,
        provider,
        externalVehicleId: `${provider.toUpperCase()}-${Date.now()}`,
        lastSyncAt: new Date().toISOString(),
        statusLive: "idle",
        odometerKmLive: state.currentVehicle.odometerKm + Math.floor(Math.random() * 100),
        fuelLevelLive: state.currentVehicle.fuelType === "Elektro" ? null : Math.floor(Math.random() * 100),
        batteryPctLive: state.currentVehicle.fuelType === "Elektro" ? Math.floor(Math.random() * 100) : null,
        dtcAlerts: [],
      };

      rerender();
    });
  }

  // Disconnect button
  const disconnectBtn = document.getElementById("btn-disconnect-telematics");
  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      if (!state.currentVehicle) return;
      if (confirm("Telematik wirklich trennen?")) {
        state.currentVehicle.telematics = {
          isConnected: false,
          provider: state.currentVehicle.telematics?.provider || "Samsara",
          externalVehicleId: null,
          lastSyncAt: null,
          statusLive: null,
          odometerKmLive: null,
          fuelLevelLive: null,
          batteryPctLive: null,
          dtcAlerts: [],
        };
        rerender();
      }
    });
  }
}

