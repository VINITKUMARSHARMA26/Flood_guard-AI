import type { RiskLevel, Severity } from '../types';

interface RiskBadgeProps {
  level: RiskLevel | Severity;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const styles: Record<string, string> = {
    LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-200',
    HIGH: 'bg-red-50 text-red-700 ring-red-200',
    CRITICAL: 'bg-red-100 text-red-800 ring-red-300',
  };
  const dot: Record<string, string> = {
    LOW: 'bg-emerald-500',
    MEDIUM: 'bg-amber-500',
    HIGH: 'bg-red-500',
    CRITICAL: 'bg-red-600',
  };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${padding} ${styles[level]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[level]}`} />
      {level}
    </span>
  );
}
