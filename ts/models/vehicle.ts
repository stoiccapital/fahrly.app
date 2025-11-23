// Vehicle data model

export interface Telematics {
  isConnected: boolean;
  provider: "Samsara" | "Webfleet" | "Geotab" | "Custom" | string;
  externalVehicleId: string | null;
  lastSyncAt: string | null;
  statusLive: "driving" | "idle" | "offline" | null;
  odometerKmLive: number | null;
  fuelLevelLive: number | null;
  batteryPctLive: number | null;
  dtcAlerts: Array<{
    code: string;
    label: string;
    severity: "low" | "med" | "high";
    date: string;
  }>;
}

export interface Damage {
  id: string;
  date: string;
  description: string;
  photos: string[];
  responsibleDriverId: string | null;
}

export interface Cost {
  id: string;
  date: string;
  type: string;
  amount: number;
  note: string;
}

export interface Vehicle {
  // Tier-1 core
  id: string;
  name: string;
  licensePlate: string;
  category: string;
  assignedDriverId: string | null;
  status: "available" | "in_use" | "reserved" | "maintenance" | "out_of_service";
  odometerKm: number;
  fuelType: string;
  notes: string;

  // Tier-2 ops
  nextMaintenanceDate: string | null;
  nextMaintenanceKm: number | null;
  insuranceExpiry: string | null;
  tuvExpiry: string | null;
  ownerType: "company" | "driver_owned" | "lease" | "subscription";
  leasing: {
    company: string | null;
    monthlyRate: number | null;
    startDate: string | null;
    endDate: string | null;
  };

  // Tier-3 premium
  vin: string | null;
  modelYear: number | null;
  color: string | null;
  insurance: {
    provider: string | null;
    policyNumber: string | null;
  };
  equipment: string[];
  damages: Damage[];
  costs: Cost[];

  // Telematics (optional)
  telematics?: Telematics;
}

export interface Driver {
  id: string;
  name: string;
  email: string | null;
}

