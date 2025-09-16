// src/entities/all.ts

// ----------------
// Define interfaces
// ----------------
export interface Location {
  village?: string;
  district?: string;
}

// ---- Alert ----
export interface AlertData {
  alert_id: string;
  timestamp: string;
  updated_date: string;
  predicted_disease?: string;
  location?: Location;
  alert_level: "green" | "yellow" | "orange" | "red";
  status: "active" | "resolved";
  risk_score: number;
  source?: string;
  issued_to?: string[];
}

export const AlertAPI = {
  async list(order: string = "-timestamp", limit: number = 50): Promise<AlertData[]> {
    return [
      {
        alert_id: "a1",
        timestamp: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        predicted_disease: "cholera",
        location: { village: "RiverSide", district: "District A" },
        alert_level: "orange",
        status: "active",
        risk_score: 0.62,
        source: "ml_model",
        issued_to: ["health_officer@example.com"],
      },
    ];
  },

  async update(alertId: string, updateData: Partial<AlertData>): Promise<void> {
    console.log(`Mock update for alert ${alertId}:`, updateData);
  },
};

// ---- Water Reading (Live Water Quality) ----
export interface WaterReading {
  reading_id: string;
  device_id: string;
  timestamp: string;
  pH: number;
  tds: number;
  turbidity: number;
  carbon_pct?: number;
  temperature?: number;
  dissolved_oxygen?: number;
  chlorine?: number;
  nitrate?: number;
  coliform_detected?: boolean;
}

export const WaterReadingAPI = {
  async list(order: string = "-timestamp", limit: number = 20): Promise<WaterReading[]> {
    const readings: WaterReading[] = Array.from({ length: limit }, (_, i) => ({
      reading_id: `w${i + 1}`,
      device_id: `d${(i % 3) + 1}`,
      timestamp: new Date(Date.now() - i * 3600 * 1000).toISOString(),
      pH: 6.5 + Math.random() * 2,
      tds: 200 + Math.floor(Math.random() * 300),
      turbidity: Math.floor(Math.random() * 10),
      carbon_pct: Math.floor(Math.random() * 20),
      temperature: 15 + Math.random() * 15,
      dissolved_oxygen: 4 + Math.random() * 4,
      chlorine: parseFloat((Math.random() * 2).toFixed(2)),
      nitrate: parseFloat((Math.random() * 30).toFixed(1)),
      coliform_detected: Math.random() > 0.8,
    }));

    // Sort by timestamp
    readings.sort((a, b) =>
      order === "-timestamp"
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return readings;
  },
};

// ---- Health Report ----
export interface HealthReportData {
  report_id: string;
  timestamp: string;
  patient_id: string;
  diagnosis: string;
  location?: Location;
}

export const HealthReportAPI = {
  async list(order: string = "-timestamp", limit: number = 50): Promise<HealthReportData[]> {
    return [
      {
        report_id: "h1",
        timestamp: new Date().toISOString(),
        patient_id: "p123",
        diagnosis: "diarrhea",
        location: { village: "GreenValley", district: "District B" },
      },
    ];
  },
};

// ---- User ----
export interface User {
  user_id: string;
  name: string;
  email: string;
}

export const UserAPI = {
  async me(): Promise<User> {
    return {
      user_id: "u1",
      name: "John Doe",
      email: "john@example.com",
    };
  },
};

// ---- Device Status ----
export interface DeviceStatusData {
  device_id: string;
  name: string;
  status: "online" | "offline";
  last_seen: string;
}

export const DeviceStatusAPI = {
  async list(order: string = "-last_seen", limit: number = 50): Promise<DeviceStatusData[]> {
    return [
      {
        device_id: "d1",
        name: "Sensor A",
        status: "online",
        last_seen: new Date().toISOString(),
      },
      {
        device_id: "d2",
        name: "Sensor B",
        status: "offline",
        last_seen: new Date().toISOString(),
      },
    ];
  },
};

// ---------------------------
// ✅ Aliases for consistency
// ---------------------------
export type Alert = AlertData;
export type HealthReport = HealthReportData;
export type DeviceStatus = DeviceStatusData;

// Alias WaterQualityData → WaterReading
export type WaterQuality = WaterReading;
export const WaterQualityAPI = WaterReadingAPI;

export interface WaterQualityData {
  id: number;
  device_id: string;
  pH: number;
  tds: number;
  turbidity: number;
  carbon_pct?: number;  // <-- add this line
  timestamp: string;
}
