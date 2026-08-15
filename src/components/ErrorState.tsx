import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 text-center ${className}`}
    >
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <p className="max-w-sm text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-sky-700">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
