export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TimeRange = '24h' | '7d' | '30d';

export interface Location {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevation: number;
  population: number;
  area: number;
}

export interface Shelter {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'school' | 'road';
  lat: number;
  lng: number;
  capacity: number;
  occupants: number;
  status: 'Available' | 'Limited' | 'Full';
  distanceKm: number;
}

export interface RiskZone {
  id: string;
  level: RiskLevel;
  // Polygon coordinates as [lat, lng] pairs
  coords: [number, number][];
  depth: number;
}

export interface RainfallPoint {
  day: string;
  rainfall: number | null;
  forecast: number | null;
  label: string;
}

export interface RiskFactors {
  rainfall: number;
  elevation: number;
  slope: number;
  drainage: number;
}

export interface RiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  estimatedDepth: number;
  factors: RiskFactors;
  explanation: string;
}

export interface SimulationInput {
  rainfall: number;
  elevation: number;
  slope: number;
  drainage: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  time: string;
  location: string;
  category: 'rainfall' | 'flood' | 'shelter' | 'infrastructure';
}

export interface TimelineFrame {
  hour: number;
  label: string;
  rainfall: number;
  riskScore: number;
  affectedArea: number;
}

export interface LocationData {
  location: Location;
  shelters: Shelter[];
  riskZones: RiskZone[];
  rainfall: RainfallPoint[];
  stats: LocationStats;
  currentRisk: RiskResult;
}

export interface LocationStats {
  rainfall24h: number;
  floodRisk: RiskLevel;
  affectedArea: number;
  sheltersAvailable: number;
  avgElevation: number;
  populationAffected: number;
  roadsAtRisk: number;
  rainfallForecast: number;
}
