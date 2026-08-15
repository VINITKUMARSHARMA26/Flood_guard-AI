import type { RiskZone } from '../types';

// Helper to build a rough polygon around a center point (lat, lng)
function buildPolygon(
  center: [number, number],
  radiusDeg: number,
  distortion = 1,
): [number, number][] {
  const [lat, lng] = center;
  const points: [number, number][] = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    const r = radiusDeg * (0.7 + 0.3 * Math.sin(angle * 2 + distortion));
    points.push([lat + r * Math.cos(angle), lng + r * Math.sin(angle) * 1.3]);
  }
  return points;
}

export const riskZones: Record<string, RiskZone[]> = {
  jaipur: [
    { id: 'j-low1', level: 'LOW', depth: 0.3, coords: buildPolygon([26.9124, 75.8200], 0.035, 1) },
    { id: 'j-med1', level: 'MEDIUM', depth: 0.9, coords: buildPolygon([26.9100, 75.7950], 0.028, 3) },
    { id: 'j-high1', level: 'HIGH', depth: 1.8, coords: buildPolygon([26.9050, 75.7850], 0.022, 5) },
  ],
  mumbai: [
    { id: 'm-low1', level: 'LOW', depth: 0.4, coords: buildPolygon([19.1100, 72.9100], 0.04, 2) },
    { id: 'm-med1', level: 'MEDIUM', depth: 1.2, coords: buildPolygon([19.076, 72.8700], 0.03, 4) },
    { id: 'm-high1', level: 'HIGH', depth: 2.4, coords: buildPolygon([19.0500, 72.8500], 0.025, 1) },
    { id: 'm-high2', level: 'HIGH', depth: 2.1, coords: buildPolygon([19.0200, 72.8400], 0.02, 6) },
  ],
  guwahati: [
    { id: 'g-low1', level: 'LOW', depth: 0.3, coords: buildPolygon([26.1700, 91.7300], 0.035, 2) },
    { id: 'g-med1', level: 'MEDIUM', depth: 1.0, coords: buildPolygon([26.1500, 91.7500], 0.03, 3) },
    { id: 'g-high1', level: 'HIGH', depth: 2.0, coords: buildPolygon([26.1400, 91.7600], 0.025, 5) },
  ],
  chennai: [
    { id: 'c-low1', level: 'LOW', depth: 0.3, coords: buildPolygon([13.0200, 80.2400], 0.035, 1) },
    { id: 'c-med1', level: 'MEDIUM', depth: 1.1, coords: buildPolygon([13.0600, 80.2500], 0.03, 4) },
    { id: 'c-high1', level: 'HIGH', depth: 1.9, coords: buildPolygon([13.0800, 80.2700], 0.022, 2) },
  ],
  patna: [
    { id: 'p-low1', level: 'LOW', depth: 0.3, coords: buildPolygon([25.6200, 85.1600], 0.03, 1) },
    { id: 'p-med1', level: 'MEDIUM', depth: 1.0, coords: buildPolygon([25.6000, 85.1400], 0.028, 3) },
    { id: 'p-high1', level: 'HIGH', depth: 2.2, coords: buildPolygon([25.5900, 85.1500], 0.025, 5) },
  ],
  kolkata: [
    { id: 'k-low1', level: 'LOW', depth: 0.4, coords: buildPolygon([22.5100, 88.3700], 0.035, 2) },
    { id: 'k-med1', level: 'MEDIUM', depth: 1.3, coords: buildPolygon([22.5500, 88.3700], 0.03, 4) },
    { id: 'k-high1', level: 'HIGH', depth: 2.0, coords: buildPolygon([22.5700, 88.3600], 0.025, 1) },
    { id: 'k-high2', level: 'HIGH', depth: 1.8, coords: buildPolygon([22.5800, 88.3500], 0.02, 6) },
  ],
};
