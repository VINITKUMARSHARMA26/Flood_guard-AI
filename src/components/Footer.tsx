import { Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white">
              <Waves className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-slate-700">
              FloodGuard <span className="text-sky-600">AI</span>
            </span>
          </div>
          <nav className="flex gap-4 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/risk-map" className="hover:text-slate-900">Risk Map</Link>
            <Link to="/analytics" className="hover:text-slate-900">Analytics</Link>
            <Link to="/alerts" className="hover:text-slate-900">Alerts</Link>
            <Link to="/about" className="hover:text-slate-900">About</Link>
          </nav>
          <p className="text-xs text-slate-400">
            Prototype · Decision-support tool · Not an official warning system
          </p>
        </div>
      </div>
    </footer>
  );
}
