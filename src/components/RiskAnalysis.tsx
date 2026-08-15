import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { RiskFactors, RiskResult } from '../types';
import RiskBadge from './RiskBadge';

interface RiskAnalysisProps {
  result: RiskResult;
}

export default function RiskAnalysis({ result }: RiskAnalysisProps) {
  const radarData: { factor: string; value: number }[] = [
    { factor: 'Rainfall', value: result.factors.rainfall },
    { factor: 'Elevation', value: result.factors.elevation },
    { factor: 'Slope', value: result.factors.slope },
    { factor: 'Drainage', value: result.factors.drainage },
  ];

  return (
    <div className="card-pad">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Risk Analysis</h3>
        <RiskBadge level={result.riskLevel} />
      </div>

      {/* Score */}
      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-bold tracking-tight text-slate-900">
          {result.riskScore}
        </span>
        <span className="pb-1 text-lg font-semibold text-slate-400">/ 100</span>
        <span className="pb-1.5 ml-auto text-sm text-slate-500">
          Est. depth: <strong className="text-slate-700">{result.estimatedDepth} m</strong>
        </span>
      </div>

      {/* Factor bars */}
      <div className="mt-4 space-y-3">
        {radarData.map((f) => (
          <FactorBar key={f.factor} label={f.factor} value={f.value} />
        ))}
      </div>

      {/* Radar chart */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} outerRadius={75}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: '#64748b' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Explanation */}
      <div className="mt-2 rounded-lg bg-slate-50 p-3">
        <p className="text-sm leading-relaxed text-slate-600">{result.explanation}</p>
      </div>
    </div>
  );
}

function FactorBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
