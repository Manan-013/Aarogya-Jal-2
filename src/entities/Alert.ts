export interface Alert {
  timestamp: string; // ISO date-time

  location: {
    lat: number;
    lng: number;
    village?: string;
    district?: string;
  };

  alert_level: "green" | "yellow" | "orange" | "red";

  predicted_disease?: string;

  risk_score: number; // between 0 and 1

  issued_to?: string[];

  status: "active" | "resolved";

  source: "sensor" | "ml" | "health_report";
}
