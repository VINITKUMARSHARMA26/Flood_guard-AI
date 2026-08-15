import { useState, useMemo } from 'react';
import {
  CloudRain,
  AlertOctagon,
  Map as MapIcon,
  Home,
  Mountain,
  Users,
  Route as RoadIcon,
  TrendingUp,
} from 'lucide-react';
import { useLocationData } from '../hooks/useLocationData';
import { calculateRisk } from '../engine/riskModel';
import type { RiskResult, SimulationInput } from '../types';
import StatCard from '../components/StatCard';
import FloodMap from '../components/FloodMap';
import RainfallChart from '../components/RainfallChart';
import RiskAnalysis from '../components/RiskAnalysis';
import SimulationPanel from '../components/SimulationPanel';
import TimelineSlider from '../components/TimelineSlider';
import LocationSelector from '../components/LocationSelector';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

interface DashboardProps {
  locationId: string;
  onLocationChange: (id: string) => void;
}

export default function Dashboard({ locationId, onLocationChange }: DashboardProps) {
  const {
    locations,
    current,
    shelters,
    riskZones,
    rainfall,
    stats,
    timeline,
    loading,
    error,
    refetch,
  } = useLocationData(locationId);

  const [simResult, setSimResult] = useState<RiskResult | null>(null);
  const [timelineIndex, setTimelineIndex] = useState(0);

  const baseRisk = useMemo<RiskResult | null>(() => {
    if (!current) return null;
    return calculateRisk({
      rainfall: stats?.rainfall24h ?? 0,
      elevation: current.elevation,
      slope: Math.max(2, 18 - current.elevation / 40),
      drainage: 55,
    });
  }, [current, stats]);

  const simDefaults: SimulationInput | null = useMemo(() => {
    if (!current) return null;
    return {
      rainfall: stats?.rainfall24h ?? 100,
      elevation: current.elevation,
      slope: Math.max(2, 18 - current.elevation / 40),
      drainage: 55,
    };
  }, [current, stats]);

  if (loading) {
    return (
      <div>
        <PageHeader />
        <LoadingState message="Loading rainfall data..." />
        <LoadingState message="Calculating flood risk..." />
      </div>
    );
  }

  if (error || !current || !stats || !riskZones || !shelters || !rainfall) {
    return (
      <div>
        <PageHeader />
        <ErrorState
          message={error ?? 'Data is missing for the selected location.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const activeRisk = simResult ?? baseRisk;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
          Flood Monitoring System
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Flood Risk Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Monitor rainfall, terrain conditions and potential flood risks using
          geospatial visualization and an explainable risk-analysis engine.
        </p>
        <div className="mt-5 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <LocationSelector
            locations={locations}
            current={current}
            onSelect={onLocationChange}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
        <AlertOctagon className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <strong>Prototype / Decision-support tool.</strong> This is not an
          official emergency warning system. Data is simulated for demonstration.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Rainfall"
          value={stats.rainfall24h}
          unit="mm"
          sublabel="Last 24 hours"
          icon={CloudRain}
          accent="sky"
        />
        <StatCard
          label="Flood Risk"
          value={stats.floodRisk}
          sublabel="Current risk level"
          icon={AlertOctagon}
          accent={stats.floodRisk === 'HIGH' ? 'red' : stats.floodRisk === 'MEDIUM' ? 'amber' : 'emerald'}
        />
        <StatCard
          label="Affected Area"
          value={stats.affectedArea}
          unit="km²"
          sublabel="Estimated"
          icon={MapIcon}
          accent="violet"
        />
        <StatCard
          label="Shelters"
          value={stats.sheltersAvailable}
          sublabel="Available nearby"
          icon={Home}
          accent="emerald"
        />
      </div>

      {/* Secondary stat cards */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Avg Elevation" value={stats.avgElevation} unit="m" icon={Mountain} accent="slate" />
        <StatCard
          label="Population Affected"
          value={stats.populationAffected.toLocaleString()}
          sublabel="Potentially"
          icon={Users}
          accent="amber"
        />
        <StatCard label="Roads at Risk" value={stats.roadsAtRisk} icon={RoadIcon} accent="red" />
        <StatCard label="Rainfall Forecast" value={stats.rainfallForecast} unit="mm" sublabel="Next 24h" icon={TrendingUp} accent="sky" />
      </div>

      {/* Map + Risk analysis */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h3 className="text-base font-semibold text-slate-900">Interactive Flood Map</h3>
              <span className="text-xs text-slate-400">{current.name} region</span>
            </div>
            <div className="p-3">
              <FloodMap
                location={current}
                riskZones={riskZones}
                shelters={shelters}
                height="480px"
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          {activeRisk && <RiskAnalysis result={activeRisk} />}
        </div>
      </div>

      {/* Rainfall chart + Simulation */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-pad lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Rainfall Analytics</h3>
            <span className="text-xs text-slate-400">7-day demo data</span>
          </div>
          <div className="mt-4">
            <RainfallChart data={rainfall} />
          </div>
        </div>
        <div className="lg:col-span-1">
          {simDefaults && (
            <SimulationPanel defaults={simDefaults} onResult={setSimResult} />
          )}
        </div>
      </div>

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <div className="mt-6">
          <TimelineSlider
            frames={timeline}
            current={timelineIndex}
            onSelect={setTimelineIndex}
          />
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
          Flood Monitoring System
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Flood Risk Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-300">Loading location data...</p>
      </div>
    </div>
  );
}
