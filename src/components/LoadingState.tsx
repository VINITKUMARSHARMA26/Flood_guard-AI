import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = 'Loading...',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-slate-500 ${className}`}
    >
      <Loader2 className="h-7 w-7 animate-spin text-sky-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
