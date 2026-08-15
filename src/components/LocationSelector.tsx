import { Search, MapPin, ChevronDown } from 'lucide-react';
import type { Location } from '../types';

interface LocationSelectorProps {
  locations: Location[];
  current: Location;
  onSelect: (id: string) => void;
}

export default function LocationSelector({
  locations,
  current,
  onSelect,
}: LocationSelectorProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <MapPin className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-slate-500">Monitoring Location</p>
          <p className="text-sm font-semibold text-slate-900">
            {current.name}, {current.state}
          </p>
        </div>
      </div>

      <div className="relative sm:ml-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select
          value={current.id}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 sm:w-auto"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}, {loc.state}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
