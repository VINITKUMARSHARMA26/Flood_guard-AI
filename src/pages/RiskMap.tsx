import { useLocationData } from '../hooks/useLocationData';
import FloodMap from '../components/FloodMap';
import LocationSelector from '../components/LocationSelector';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import type { Shelter } from '../types';
import { Home, Hospital, GraduationCap, Route as RoadIcon } from 'lucide-react';

interface RiskMapPageProps {
  locationId: string;
  onLocationChange: (id: string) => void;
}

export default function RiskMapPage({ locationId, onLocationChange }: RiskMapPageProps) {
  const {
    locations,
    current,
    shelters,
    riskZones,
    loading,
    error,
    refetch,
  } = useLocationData(locationId);

  if (loading) {
    return <LoadingState message="Loading map..." className="min-h-[60vh]" />;
  }

  if (error || !current || !riskZones || !shelters) {
    return (
      <ErrorState
        message={error ?? 'Unable to load map data.'}
        onRetry={refetch}
        className="min-h-[40vh]"
      />
    );
  }

  const infraCounts = countInfrastructure(shelters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Risk Map</h1>
          <p className="mt-1 text-sm text-slate-500">
            Interactive flood-risk visualization with zones and infrastructure.
          </p>
        </div>
        <LocationSelector
          locations={locations}
          current={current}
          onSelect={onLocationChange}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-base font-semibold text-slate-900">
            {current.name}, {current.state}
          </h3>
        </div>
        <div className="p-3">
          <FloodMap
            location={current}
            riskZones={riskZones}
            shelters={shelters}
            height="600px"
          />
        </div>
      </div>

      {/* Infrastructure summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfraCard icon={Home} label="Shelters" count={infraCounts.shelter} color="bg-sky-50 text-sky-600" />
        <InfraCard icon={Hospital} label="Hospitals" count={infraCounts.hospital} color="bg-pink-50 text-pink-600" />
        <InfraCard icon={GraduationCap} label="Schools" count={infraCounts.school} color="bg-violet-50 text-violet-600" />
        <InfraCard icon={RoadIcon} label="Roads" count={infraCounts.road} color="bg-slate-100 text-slate-600" />
      </div>

      {/* Shelter table */}
      <div className="mt-6 card-pad">
        <h3 className="text-base font-semibold text-slate-900">Infrastructure &amp; Shelters</h3>
        <div className="mt-4 overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-2 pr-4 font-semibold">Name</th>
                <th className="pb-2 pr-4 font-semibold">Type</th>
                <th className="pb-2 pr-4 font-semibold">Capacity</th>
                <th className="pb-2 pr-4 font-semibold">Occupants</th>
                <th className="pb-2 pr-4 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shelters
                .filter((s) => s.type !== 'road')
                .map((s) => (
                  <tr key={s.id} className="text-slate-700">
                    <td className="py-2.5 pr-4 font-medium">{s.name}</td>
                    <td className="py-2.5 pr-4 capitalize">{s.type}</td>
                    <td className="py-2.5 pr-4">{s.capacity}</td>
                    <td className="py-2.5 pr-4">{s.occupants}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          s.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : s.status === 'Limited'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5">{s.distanceKm} km</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function countInfrastructure(shelters: Shelter[]) {
  return shelters.reduce(
    (acc, s) => {
      acc[s.type] = (acc[s.type] ?? 0) + 1;
      return acc;
    },
    { shelter: 0, hospital: 0, school: 0, road: 0 } as Record<string, number>,
  );
}

function InfraCard({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: typeof Home;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="card-pad flex items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-900">{count}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
