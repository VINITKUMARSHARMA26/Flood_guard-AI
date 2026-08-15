import type { TimelineFrame } from '../types';

interface TimelineSliderProps {
  frames: TimelineFrame[];
  current: number;
  onSelect: (index: number) => void;
}

export default function TimelineSlider({
  frames,
  current,
  onSelect,
}: TimelineSliderProps) {
  const frame = frames[current];

  return (
    <div className="card-pad">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Timeline Progression</h3>
        <span className="text-xs text-slate-400">0h → 48h forecast</span>
      </div>

      {frame && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Metric label="Rainfall" value={`${frame.rainfall} mm`} />
          <Metric label="Risk Score" value={`${frame.riskScore}`} />
          <Metric label="Affected" value={`${frame.affectedArea} km²`} />
        </div>
      )}

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          step={1}
          value={current}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-red-400 accent-slate-800"
        />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          {frames.map((f, i) => (
            <button
              key={f.hour}
              onClick={() => onSelect(i)}
              className={`font-medium transition-colors ${
                i === current ? 'text-slate-900' : 'hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
