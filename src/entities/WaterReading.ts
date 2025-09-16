/**
 * WaterReading Entity
 * Unified schema for water quality data
 */
export interface WaterReading {
  /** Unique ID for the reading */
  id: string;

  /** Device identifier */
  device_id: string;

  /** ISO date-time string */
  timestamp: string;

  /** Location of the reading */
  location?: {
    lat: number;
    lng: number;
    village?: string;
    district?: string;
  };

  /** Water pH value */
  pH?: number;

  /** Turbidity level */
  turbidity?: number;

  /** Total dissolved solids */
  tds?: number;

  /** Water temperature (°C) */
  temperature?: number;

  /** Dissolved oxygen level */
  dissolved_oxygen?: number;

  /** Nitrate concentration */
  nitrate?: number;

  /** Ammonia concentration */
  ammonia?: number;

  /** Chlorine concentration */
  chlorine?: number;

  /** Whether coliform bacteria were detected */
  coliform_detected?: boolean;

  /** Carbon percentage */
  carbon_pct?: number;

  /** Raw sensor payload (flexible data from sensors) */
  raw_payload?: Record<string, any>;
}
