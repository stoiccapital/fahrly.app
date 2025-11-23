// Vehicle detail service - state management and vehicle loading

import { Vehicle, Driver } from "../models/vehicle.js";
import { getVehicleIdFromUrl } from "../utils/vehicle-detail.helpers.js";

export interface VehicleDetailState {
  vehicles: Vehicle[];
  drivers: Driver[];
  currentVehicle: Vehicle | null;
}

// Create initial vehicle detail state
export function createVehicleDetailState(
  mockVehicles: Vehicle[],
  mockDrivers: Driver[]
): VehicleDetailState {
  return {
    vehicles: [...mockVehicles],
    drivers: [...mockDrivers],
    currentVehicle: null,
  };
}

// Load vehicle or redirect
export function loadVehicleOrRedirect(state: VehicleDetailState): Vehicle | null {
  const vehicleId = getVehicleIdFromUrl();
  if (!vehicleId) {
    alert("Keine Fahrzeug-ID gefunden");
    window.location.href = "vehicles.html";
    return null;
  }

  const vehicle = state.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) {
    alert("Fahrzeug nicht gefunden");
    window.location.href = "vehicles.html";
    return null;
  }

  state.currentVehicle = vehicle;
  return vehicle;
}

