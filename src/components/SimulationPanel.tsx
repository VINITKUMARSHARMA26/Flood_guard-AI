import { useState } from 'react';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import type { SimulationInput, RiskResult } from '../types';
import { calculateFloodRisk } from '../services/api';
import RiskBadge from './RiskBadge';
import ErrorState from './ErrorState';

interface SimulationPanelProps {
  defaults: SimulationInput;
  onResult: (result: RiskResult) => void;
}

export default function SimulationPanel({ defaults, onResult }: SimulationPanelProps) {
  const [input, setInput] = useState<SimulationInput>(defaults);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SimulationInput>(key: K, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await calculateFloodRisk(input);
      setResult(res);
      onResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInput(defaults);
    setResult(null);
    setError(null);
  }

  return (
    <div className="card-pad">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Flood Simulation</h3>
        <span className="text-xs text-slate-400">Adjust &amp; run</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Modify environmental parameters to see how flood risk changes.
      </p>

      <div className="mt-4 space-y-4">
        <Slider
          label="Rainfall"
          unit="mm"
          min={0}
          max={300}
          step={5}
          value={input.rainfall}
          onChange={(v) => update('rainfall', v)}
        />
        <Slider
          label="Elevation"
          unit="m"
          min={0}
          max={600}
          step={10}
          value={input.elevation}
          onChange={(v) => update('elevation', v)}
        />
        <Slider
          label="Slope"
          unit="°"
          min={0}
          max={25}
          step={0.5}
          value={input.slope}
          onChange={(v) => update('slope', v)}
        />
        <Slider
          label="Drainage Capacity"
          unit="%"
          min={0}
          max={100}
          step={5}
          value={input.drainage}
          onChange={(v) => update('drainage', v)}
        />
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={run} disabled={loading} className="btn-primary flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Simulation
            </>
          )}
        </button>
        <button onClick={reset} className="btn-ghost" disabled={loading}>
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {error && <ErrorState message={error} className="py-4" />}

      {result && !error && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Result</span>
            <RiskBadge level={result.riskLevel} />
          </div>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-2xl font-bold text-slate-900">{result.riskScore}</span>
            <span className="pb-0.5 text-sm text-slate-400">/ 100</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Estimated flood depth: <strong>{result.estimatedDepth} m</strong>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

function Slider({ label, unit, min, max, step, value, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-600"
      />
    </div>
  );
}
