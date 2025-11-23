// Helper functions for vehicles page

import { Vehicle, Driver } from "../models/vehicle.js";

// Get driver name by ID
export function getDriverName(driverId: string | null, drivers: Driver[]): string {
  if (!driverId) return "—";
  const driver = drivers.find((d) => d.id === driverId);
  return driver ? driver.name : "—";
}

// Get status label in German
export function getStatusLabel(status: Vehicle["status"]): string {
  const labels: Record<Vehicle["status"], string> = {
    available: "Verfügbar",
    in_use: "In Nutzung",
    reserved: "Reserviert",
    maintenance: "Wartung",
    out_of_service: "Außer Betrieb",
  };
  return labels[status];
}

// Get status priority for sorting
export function getStatusPriority(status: Vehicle["status"]): number {
  const priorities: Record<Vehicle["status"], number> = {
    out_of_service: 0,
    maintenance: 1,
    in_use: 2,
    reserved: 3,
    available: 4,
  };
  return priorities[status];
}

// Check compliance warnings
export function getComplianceWarnings(vehicle: Vehicle): {
  insurance: "ok" | "warning" | "danger";
  tuv: "ok" | "warning" | "danger";
} {
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  let insurance: "ok" | "warning" | "danger" = "ok";
  if (!vehicle.insuranceExpiry) {
    insurance = "danger";
  } else {
    const expiry = new Date(vehicle.insuranceExpiry);
    const diff = expiry.getTime() - now.getTime();
    if (diff < 0) {
      insurance = "danger";
    } else if (diff < thirtyDays) {
      insurance = "warning";
    }
  }

  let tuv: "ok" | "warning" | "danger" = "ok";
  if (!vehicle.tuvExpiry) {
    tuv = "ok"; // TÜV not required for all vehicles
  } else {
    const expiry = new Date(vehicle.tuvExpiry);
    const diff = expiry.getTime() - now.getTime();
    if (diff < 0) {
      tuv = "danger";
    } else if (diff < thirtyDays) {
      tuv = "warning";
    }
  }

  return { insurance, tuv };
}

