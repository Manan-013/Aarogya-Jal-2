export interface DeviceStatus {
  device_id: string;

  location: {
    lat: number;
    lng: number;
    village?: string;
    district?: string;
  };

  status: "online" | "offline" | "error"; // default: "online"

  last_seen: string; // ISO date-time string

  battery_level?: number; // 0–100

  network_strength?: "good" | "weak" | "disconnected"; // default: "good"

  latest_readings?: Record<string, any>; // flexible sensor data

  assigned_to?: string;

  remarks?: string;
}
