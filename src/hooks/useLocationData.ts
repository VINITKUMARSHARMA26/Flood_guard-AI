import { useState, useEffect, useCallback } from 'react';
import type {
  Location,
  Shelter,
  RiskZone,
  RainfallPoint,
  Alert,
  LocationStats,
  TimelineFrame,
} from '../types';
import {
  getLocations,
  getLocation,
  getShelters,
  getRiskZones,
  getRainfall,
  getAlerts,
  getStats,
  getTimeline,
} from '../services/api';

interface LocationDataSet {
  locations: Location[];
  current: Location | null;
  shelters: Shelter[] | null;
  riskZones: RiskZone[] | null;
  rainfall: RainfallPoint[] | null;
  alerts: Alert[] | null;
  stats: LocationStats | null;
  timeline: TimelineFrame[] | null;
  loading: boolean;
  error: string | null;
}

export function useLocationData(locationId: string): LocationDataSet & { refetch: () => void } {
  const [state, setState] = useState<LocationDataSet>({
    locations: [],
    current: null,
    shelters: null,
    riskZones: null,
    rainfall: null,
    alerts: null,
    stats: null,
    timeline: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [
        allLocations,
        current,
        shelters,
        riskZones,
        rainfall,
        alerts,
        stats,
        timeline,
      ] = await Promise.all([
        getLocations(),
        getLocation(locationId),
        getShelters(locationId),
        getRiskZones(locationId),
        getRainfall(locationId),
        getAlerts(locationId),
        getStats(locationId),
        getTimeline(locationId),
      ]);

      setState({
        locations: allLocations,
        current,
        shelters,
        riskZones,
        rainfall,
        alerts,
        stats,
        timeline,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load data',
      }));
    }
  }, [locationId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, refetch: load };
}
