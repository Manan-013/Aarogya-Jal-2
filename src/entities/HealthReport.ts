// src/entities/HealthReport.ts

/**
 * HealthReport Entity
 * Converted from JSON Schema to TypeScript interface
 */
export interface HealthReport {
  /** ISO date-time string */
  timestamp: string;

  /** user id or phone number */
  reported_by: string;

  location: {
    lat: number;
    lng: number;
    village?: string;
    district?: string;
  };

  age_group?: "child" | "adult" | "elderly";

  /** List of reported symptoms */
  symptoms: string[];

  /** Disease suspected from symptoms */
  suspected_disease?: string;

  /** user id of health worker, or null */
  verified_by?: string | null;

  /** Report status - default: "new" */
  status?: "new" | "verified" | "treated";

  /** URLs to attachments (images, files, etc.) */
  attachments?: string[];
}
