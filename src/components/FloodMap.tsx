import { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Home, Hospital, GraduationCap, Route as RoadIcon } from 'lucide-react';
import type { Location, Shelter, RiskZone } from '../types';

// Fix default Leaflet marker icons in bundler environments
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const zoneColors: Record<RiskZone['level'], string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
};

function shelterIcon(type: Shelter['type']): L.DivIcon {
  const colorMap: Record<string, string> = {
    shelter: '#0ea5e9',
    hospital: '#ec4899',
    school: '#8b5cf6',
    road: '#64748b',
  };
  const htmlMap: Record<string, string> = {
    shelter: '🏠',
    hospital: '🏥',
    school: '🎓',
    road: '🛣️',
  };
  const color = colorMap[type];
  return L.divIcon({
    className: 'fg-marker',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">${htmlMap[type]}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

interface FloodMapProps {
  location: Location;
  riskZones: RiskZone[];
  shelters: Shelter[];
  height?: string;
  showLegend?: boolean;
  showLayerControl?: boolean;
}

export default function FloodMap({
  location,
  riskZones,
  shelters,
  height = '500px',
  showLegend = true,
  showLayerControl = true,
}: FloodMapProps) {
  const center: [number, number] = [location.lat, location.lng];

  const locationMarkerIcon = L.divIcon({
    className: 'fg-marker',
    html: `<div style="background:#0369a1;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:16px;">📍</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const infraLabel: Record<string, string> = {
    shelter: 'Emergency Shelter',
    hospital: 'Hospital',
    school: 'School',
    road: 'Road Junction',
  };

  const mapContent = useMemo(
    () => (
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Risk zone polygons */}
        {riskZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coords}
            pathOptions={{
              color: zoneColors[zone.level],
              fillColor: zoneColors[zone.level],
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{zone.level} Risk Zone</p>
                <p className="text-slate-600">Est. flood depth: {zone.depth} m</p>
                <p className="text-xs text-slate-400">Demo/sample data</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Location marker */}
        <Marker position={center} icon={locationMarkerIcon}>
          <Popup>
            <div>
              <p className="font-semibold">{location.name}, {location.state}</p>
              <p className="text-slate-600">Elevation: {location.elevation} m</p>
              <p className="text-slate-600">Area: {location.area} km²</p>
            </div>
          </Popup>
        </Marker>

        {/* Infrastructure markers */}
        {shelters.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={shelterIcon(s.type)}
          >
            <Popup>
              <div className="space-y-0.5">
                <p className="font-semibold">{s.name}</p>
                <p className="text-slate-600">{infraLabel[s.type]}</p>
                {s.type !== 'road' && (
                  <>
                    <p className="text-slate-600">
                      Capacity: {s.capacity} people
                    </p>
                    <p className="text-slate-600">
                      Occupants: {s.occupants}/{s.capacity}
                    </p>
                    <p className="font-medium">
                      Status: <span className={
                        s.status === 'Available' ? 'text-emerald-600' :
                        s.status === 'Limited' ? 'text-amber-600' : 'text-red-600'
                      }>{s.status}</span>
                    </p>
                  </>
                )}
                <p className="text-slate-500">Distance: {s.distanceKm} km</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    ),
    [riskZones, shelters, center, location, locationMarkerIcon],
  );

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        {showLayerControl ? (
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street Map">
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        ) : null}
        {mapContent}
      </MapContainer>

      {showLegend && <MapLegend />}
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
        Flood Risk
      </p>
      <div className="space-y-1.5">
        <LegendItem color="#10b981" label="Low" />
        <LegendItem color="#f59e0b" label="Medium" />
        <LegendItem color="#ef4444" label="High" />
      </div>
      <div className="my-2 h-px bg-slate-200" />
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
        Infrastructure
      </p>
      <div className="space-y-1.5">
        <InfraItem icon={Home} color="#0ea5e9" label="Shelter" />
        <InfraItem icon={Hospital} color="#ec4899" label="Hospital" />
        <InfraItem icon={GraduationCap} color="#8b5cf6" label="School" />
        <InfraItem icon={RoadIcon} color="#64748b" label="Road" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: color, opacity: 0.7, border: `1px solid ${color}` }}
      />
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}

function InfraItem({
  icon: Icon,
  color,
  label,
}: {
  icon: typeof Home;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Icon className="h-2.5 w-2.5 text-white" />
      </span>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}
