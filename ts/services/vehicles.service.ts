// Vehicles service - state management and filtering

import { Vehicle, Driver } from "../models/vehicle.js";
import { getStatusPriority } from "../utils/vehicles.helpers.js";

export interface VehiclesState {
  vehicles: Vehicle[];
  drivers: Driver[];
  currentFilter: string;
  searchQuery: string;
}

// Create initial vehicles state
export function createVehiclesState(
  mockVehicles: Vehicle[],
  mockDrivers: Driver[]
): VehiclesState {
  return {
    vehicles: [...mockVehicles],
    drivers: [...mockDrivers],
    currentFilter: "all",
    searchQuery: "",
  };
}

// Get filtered and sorted vehicles
export function getFilteredVehicles(state: VehiclesState): Vehicle[] {
  let filtered = [...state.vehicles];

  // Search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.licensePlate.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (state.currentFilter !== "all") {
    filtered = filtered.filter((v) => v.status === state.currentFilter);
  }

  // Sort by status priority
  filtered.sort((a, b) => {
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);
    return priorityA - priorityB;
  });

  return filtered;
}

// Find vehicle by ID
export function findVehicle(
  state: VehiclesState,
  id: string
): Vehicle | undefined {
  return state.vehicles.find((v) => v.id === id);
}

// Upsert vehicle (update if exists, else push)
export function upsertVehicle(state: VehiclesState, vehicle: Vehicle): void {
  const index = state.vehicles.findIndex((v) => v.id === vehicle.id);
  if (index >= 0) {
    state.vehicles[index] = vehicle;
  } else {
    state.vehicles.push(vehicle);
  }
}

