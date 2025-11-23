// Helper functions for vehicle detail page

import { Vehicle, Driver } from "../models/vehicle.js";

// Get vehicle ID from URL
export function getVehicleIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Get driver name by ID
export function getDriverName(drivers: Driver[], driverId: string | null): string {
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

// Format date
export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE");
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
    tuv = "ok";
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

