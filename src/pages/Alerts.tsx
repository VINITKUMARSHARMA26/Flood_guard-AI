import { useState, useMemo } from 'react';
import { Bell, Filter, Clock } from 'lucide-react';
import { useLocationData } from '../hooks/useLocationData';
import LocationSelector from '../components/LocationSelector';
import RiskBadge from '../components/RiskBadge';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import type { Severity } from '../types';

interface AlertsProps {
  locationId: string;
  onLocationChange: (id: string) => void;
}

const SEVERITY_FILTERS: (Severity | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function Alerts({ locationId, onLocationChange }: AlertsProps) {
  const { locations, current, alerts, loading, error, refetch } =
    useLocationData(locationId);

  const [filter, setFilter] = useState<Severity | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    if (!alerts) return [];
    if (filter === 'ALL') return alerts;
    return alerts.filter((a) => a.severity === filter);
  }, [alerts, filter]);

  const counts = useMemo(() => {
    const c = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } as Record<Severity, number>;
    alerts?.forEach((a) => { c[a.severity]++; });
    return c;
  }, [alerts]);

  if (loading) return <LoadingState message="Loading alerts..." className="min-h-[50vh]" />;

  if (error || !current) {
    return (
      <ErrorState
        message={error ?? 'Unable to load alerts.'}
        onRetry={refetch}
        className="min-h-[40vh]"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alerts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Active flood-related alerts for {current.name}.
          </p>
        </div>
        <LocationSelector
          locations={locations}
          current={current}
          onSelect={onLocationChange}
        />
      </div>

      {/* Disclaimer */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
        <Bell className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <strong>Simulated alerts.</strong> These alerts are generated from demo data for
          demonstration purposes only.
        </p>
      </div>

      {/* Severity summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Critical" count={counts.CRITICAL} accent="bg-red-100 text-red-700" />
        <SummaryCard label="High" count={counts.HIGH} accent="bg-red-50 text-red-600" />
        <SummaryCard label="Medium" count={counts.MEDIUM} accent="bg-amber-50 text-amber-700" />
        <SummaryCard label="Low" count={counts.LOW} accent="bg-emerald-50 text-emerald-700" />
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <div className="flex flex-wrap gap-1.5">
          {SEVERITY_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alert cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="card-pad col-span-full text-center text-slate-500">
            No {filter !== 'ALL' ? filter.toLowerCase() : ''} alerts at this time.
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className="card-pad border-l-4 transition-shadow hover:shadow-md"
              style={{
                borderLeftColor:
                  alert.severity === 'CRITICAL' ? '#dc2626' :
                  alert.severity === 'HIGH' ? '#ef4444' :
                  alert.severity === 'MEDIUM' ? '#f59e0b' : '#10b981',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                      {alert.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {alert.message}
                  </p>
                </div>
                <RiskBadge level={alert.severity} size="sm" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </span>
                <span>{alert.location}</span>
                <span className="capitalize">{alert.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  accent,
}: {
  label: string;
  count: number;
  accent: string;
}) {
  return (
    <div className="card-pad flex items-center justify-between">
      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${accent}`}>
        {label}
      </span>
      <span className="text-2xl font-bold text-slate-900">{count}</span>
    </div>
  );
}
