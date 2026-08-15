import type {
  Location,
  Shelter,
  RiskZone,
  RainfallPoint,
  Alert,
  SimulationInput,
  RiskResult,
  TimelineFrame,
  LocationStats,
} from '../types';
import { locations } from '../data/locations';
import { shelters } from '../data/shelters';
import { riskZones } from '../data/riskZones';
import { rainfallData } from '../data/rainfall';
import { alerts } from '../data/alerts';
import { calculateRisk } from '../engine/riskModel';

/**
 * API service layer.
 *
 * Each function simulates an async REST call (GET /api/... or
 * POST /api/flood-risk) with a small artificial delay and typed
 * errors. In a production deployment these would be fetch() calls
 * to a Node/Express backend, which in turn would call the Python
 * FastAPI flood engine. The function signatures mirror those
 * endpoints so the network layer can be swapped in without
 * changing any component code.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /api/health */
export async function getHealth(): Promise<{ status: string; engine: string }> {
  await delay(200);
  return { status: 'operational', engine: 'prototype-v1' };
}

/** GET /api/locations */
export async function getLocations(): Promise<Location[]> {
  await delay(300);
  return locations;
}

/** GET /api/locations/:id */
export async function getLocation(id: string): Promise<Location> {
  await delay(250);
  const loc = locations.find((l) => l.id === id);
  if (!loc) throw new ApiError(`Location "${id}" not found`, 'NOT_FOUND');
  return loc;
}

/** GET /api/shelters/:locationId */
export async function getShelters(locationId: string): Promise<Shelter[]> {
  await delay(350);
  const list = shelters[locationId];
  if (!list) throw new ApiError(`No shelters for location "${locationId}"`, 'NOT_FOUND');
  return list;
}

/** GET /api/risk-zones/:locationId */
export async function getRiskZones(locationId: string): Promise<RiskZone[]> {
  await delay(400);
  const zones = riskZones[locationId];
  if (!zones) throw new ApiError(`No risk zones for location "${locationId}"`, 'NOT_FOUND');
  return zones;
}

/** GET /api/rainfall/:locationId */
export async function getRainfall(locationId: string): Promise<RainfallPoint[]> {
  await delay(350);
  const data = rainfallData[locationId];
  if (!data) throw new ApiError(`No rainfall data for location "${locationId}"`, 'NOT_FOUND');
  return data;
}

/** GET /api/alerts/:locationId */
export async function getAlerts(locationId: string): Promise<Alert[]> {
  await delay(300);
  const list = alerts[locationId] ?? [];
  return list;
}

/**
 * POST /api/flood-risk
 * Body: SimulationInput → calls the (Python) flood engine.
 */
export async function calculateFloodRisk(
  input: SimulationInput,
): Promise<RiskResult> {
  await delay(500);
  if (
    input.rainfall < 0 ||
    input.elevation < 0 ||
    input.slope < 0 ||
    input.drainage < 0
  ) {
    throw new ApiError('Invalid simulation input: values must be non-negative', 'BAD_REQUEST');
  }
  return calculateRisk(input);
}

/** GET /api/timeline/:locationId — simulated 48h progression. */
export async function getTimeline(locationId: string): Promise<TimelineFrame[]> {
  await delay(400);
  const location = locations.find((l) => l.id === locationId);
  if (!location) throw new ApiError(`Location "${locationId}" not found`, 'NOT_FOUND');

  const hours = [0, 6, 12, 18, 24, 48];
  return hours.map((hour) => {
    const progress = hour / 48;
    const rainfall = Math.round(20 + progress * 120 + (location.elevation < 100 ? 40 : 0));
    const riskScore = Math.round(30 + progress * 55 + (location.elevation < 100 ? 15 : 0));
    const affectedArea = Math.round((progress * location.area * 0.12) * 10) / 10;
    return {
      hour,
      label: hour === 0 ? 'Now' : `${hour}h`,
      rainfall,
      riskScore: Math.min(100, riskScore),
      affectedArea,
    };
  });
}

/** GET /api/stats/:locationId — derived aggregate statistics. */
export async function getStats(locationId: string): Promise<LocationStats> {
  await delay(450);
  const location = locations.find((l) => l.id === locationId);
  if (!location) throw new ApiError(`Location "${locationId}" not found`, 'NOT_FOUND');

  const rain = rainfallData[locationId];
  const shelterList = shelters[locationId] ?? [];

  const lastRainfall = [...rain].reverse().find((r) => r.rainfall !== null)?.rainfall ?? 0;
  const forecast = rain?.find((r) => r.forecast !== null)?.forecast ?? 0;

  const result = calculateRisk({
    rainfall: lastRainfall,
    elevation: location.elevation,
    slope: Math.max(2, 18 - location.elevation / 40),
    drainage: 55,
  });

  const availableShelters = shelterList.filter(
    (s) => s.type === 'shelter' && s.status !== 'Full',
  ).length;

  return {
    rainfall24h: lastRainfall,
    floodRisk: result.riskLevel,
    affectedArea: Math.round((result.riskScore / 100) * location.area * 0.12 * 10) / 10,
    sheltersAvailable: availableShelters,
    avgElevation: location.elevation,
    populationAffected: Math.round((result.riskScore / 100) * location.population * 0.08),
    roadsAtRisk: shelterList.filter((s) => s.type === 'road').length,
    rainfallForecast: forecast,
  };
}
