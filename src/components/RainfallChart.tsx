import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { RainfallPoint } from '../types';

interface RainfallChartProps {
  data: RainfallPoint[];
}

export default function RainfallChart({ data }: RainfallChartProps) {
  const chartData = data.map((d) => ({
    day: d.day,
    Historical: d.rainfall,
    Forecast: d.forecast,
  }));

  const avg =
    chartData.reduce((s, d) => s + (d.Historical ?? 0), 0) /
    chartData.filter((d) => d.Historical !== null).length;
  const max = Math.max(...chartData.map((d) => d.Historical ?? 0));

  const first = chartData[0]?.Historical ?? 0;
  const lastHistorical = chartData[chartData.length - 2]?.Historical ?? 0;
  const trend = first > 0 ? ((lastHistorical - first) / first) * 100 : 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
          <span className="text-slate-600">
            Avg: <strong className="text-slate-900">{avg.toFixed(0)} mm</strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-700" />
          <span className="text-slate-600">
            Max: <strong className="text-slate-900">{max} mm</strong>
          </span>
        </span>
        <span className="text-slate-600">
          Trend:{' '}
          <strong className={trend >= 0 ? 'text-red-600' : 'text-emerald-600'}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(0)}%
          </strong>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" mm" />
          <Tooltip
            contentStyle={{
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
          <ReferenceLine y={avg} stroke="#0284c7" strokeDasharray="4 4" label={{ value: 'Avg', fontSize: 11, fill: '#0284c7' }} />
          <Bar dataKey="Historical" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Historical (demo)" />
          <Line
            type="monotone"
            dataKey="Forecast"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#f59e0b' }}
            name="Forecast (demo)"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-slate-400">
        Demo / sample rainfall data — not real-time measurements
      </p>
    </div>
  );
}
