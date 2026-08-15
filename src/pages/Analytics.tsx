import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useLocationData } from '../hooks/useLocationData';
import LocationSelector from '../components/LocationSelector';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import type { TimeRange } from '../types';

interface AnalyticsProps {
  locationId: string;
  onLocationChange: (id: string) => void;
}

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
];

export default function Analytics({ locationId, onLocationChange }: AnalyticsProps) {
  const {
    locations,
    current,
    rainfall,
    shelters,
    stats,
    timeline,
    loading,
    error,
    refetch,
  } = useLocationData(locationId);

  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Extend rainfall data depending on time range
  const rainfallData = useMemo(() => {
    if (!rainfall) return [];
    if (timeRange === '24h') return rainfall.slice(-3);
    if (timeRange === '7d') return rainfall;
    // 30 days: repeat the 7-day pattern 4 times + add synthetic points
    const extended = [...rainfall];
    for (let i = 0; i < 4; i++) {
      rainfall.forEach((d, idx) => {
        extended.push({
          ...d,
          day: `W${i + 1}-${d.day}`,
          rainfall: Math.round((d.rainfall ?? 0) * (0.7 + i * 0.1)),
          forecast: null,
        });
        void idx;
      });
    }
    return extended;
  }, [rainfall, timeRange]);

  // Risk score trend from timeline
  const riskTrend = useMemo(() => {
    if (!timeline) return [];
    return timeline.map((f) => ({ name: f.label, score: f.riskScore, rainfall: f.rainfall }));
  }, [timeline]);

  // Elevation distribution (synthetic from current elevation)
  const elevationDist = useMemo(() => {
    if (!current) return [];
    const base = current.elevation;
    return [
      { range: '0-50m', count: Math.round(35 - base / 20) },
      { range: '50-150m', count: Math.round(25 + base / 30) },
      { range: '150-300m', count: Math.round(20 + base / 25) },
      { range: '300-500m', count: Math.round(15 + base / 20) },
      { range: '500m+', count: Math.round(10 + base / 15) },
    ].filter((d) => d.count > 0);
  }, [current]);

  // Risk factor comparison
  const factorComparison = useMemo(() => {
    if (!current) return [];
    // Generate comparative data across locations
    return locations.map((loc) => {
      const score = Math.round(
        Math.min(100, 50 + (100 - loc.elevation) / 3 + (loc.elevation < 100 ? 20 : 0)),
      );
      return { name: loc.name, score };
    });
  }, [current, locations]);

  // Infrastructure at risk
  const infraAtRisk = useMemo(() => {
    if (!shelters) return [];
    return shelters.map((s) => ({
      name: s.name,
      risk: s.status === 'Full' ? 90 : s.status === 'Limited' ? 60 : 25,
      type: s.type,
    }));
  }, [shelters]);

  // Affected area pie
  const affectedPie = useMemo(() => {
    if (!stats || !current) return [];
    const affected = stats.affectedArea;
    const safe = Math.max(0, current.area - affected);
    return [
      { name: 'Affected', value: affected, color: '#ef4444' },
      { name: 'Safe', value: safe, color: '#10b981' },
    ];
  }, [stats, current]);

  if (loading) return <LoadingState message="Loading analytics..." className="min-h-[50vh]" />;

  if (error || !current) {
    return (
      <ErrorState
        message={error ?? 'Unable to load analytics.'}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Rainfall trends, risk analysis and infrastructure assessment.
          </p>
        </div>
        <LocationSelector
          locations={locations}
          current={current}
          onSelect={onLocationChange}
        />
      </div>

      {/* Time range selector */}
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {TIME_RANGES.map((tr) => (
          <button
            key={tr.id}
            onClick={() => setTimeRange(tr.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              timeRange === tr.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rainfall trend */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Rainfall Trend</h3>
          <p className="mt-1 text-xs text-slate-400">Demo data — {timeRange}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={rainfallData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" mm" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="rainfall"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#rainGrad)"
                name="Rainfall"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk score trend */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Risk Score Trend</h3>
          <p className="mt-1 text-xs text-slate-400">48-hour projection</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={riskTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Risk Score" />
              <Line type="monotone" dataKey="rainfall" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Rainfall" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Affected area */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Affected Area Distribution</h3>
          <p className="mt-1 text-xs text-slate-400">{current.name} — {current.area} km² total</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={affectedPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
              >
                {affectedPie.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Elevation distribution */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Elevation Distribution</h3>
          <p className="mt-1 text-xs text-slate-400">Terrain analysis (demo)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={elevationDist} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Area (km²)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk factor comparison across locations */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Risk Factor Comparison</h3>
          <p className="mt-1 text-xs text-slate-400">Across all monitored locations</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={factorComparison} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} name="Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Infrastructure at risk */}
        <div className="card-pad">
          <h3 className="text-base font-semibold text-slate-900">Infrastructure at Risk</h3>
          <p className="mt-1 text-xs text-slate-400">Risk level per facility</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={infraAtRisk} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={60} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="risk" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Risk %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: '0.75rem',
  border: '1px solid #e2e8f0',
  fontSize: '0.875rem',
};
