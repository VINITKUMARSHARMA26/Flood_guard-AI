import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  icon: LucideIcon;
  accent?: 'sky' | 'emerald' | 'amber' | 'red' | 'slate' | 'violet';
}

const accentMap = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
};

export default function StatCard({
  label,
  value,
  unit,
  sublabel,
  icon: Icon,
  accent = 'slate',
}: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className="card-pad flex items-start justify-between gap-3 transition-shadow hover:shadow-md">
      <div className="min-w-0">
        <p className="section-title">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {value}
          {unit && <span className="ml-1 text-base font-semibold text-slate-400">{unit}</span>}
        </p>
        {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
      </div>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${a.bg} ${a.text} ${a.ring}`}
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}
