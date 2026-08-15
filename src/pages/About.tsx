import {
  Waves,
  LayoutDashboard,
  Server,
  Brain,
  Database,
  Map as MapIcon,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  Github,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white">
          <Waves className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          About FloodGuard AI
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          An intelligent flood-risk monitoring and visualization platform that
          combines rainfall data, terrain analysis, geospatial mapping and an
          explainable risk engine to support disaster-management decisions.
        </p>
      </div>

      {/* What it does */}
      <Section icon={LayoutDashboard} title="What FloodGuard AI Does">
        <p>
          FloodGuard AI lets users select a monitored location, view current
          rainfall and terrain conditions, and receive an explainable flood-risk
          score with a clear breakdown of contributing factors. The platform
          visualizes risk zones on an interactive map, shows nearby emergency
          infrastructure, and lets users run simulations by adjusting
          environmental parameters.
        </p>
      </Section>

      {/* Why it matters */}
      <Section icon={ShieldAlert} title="Why Flood-Risk Visualization Matters">
        <p>
          Flooding affects millions of people every year, causing displacement,
          infrastructure damage and loss of life. Making flood risk visible —
          through clear maps, data and explainable scoring — helps communities
          and administrators understand exposure, prepare evacuation plans and
          prioritize infrastructure investments. Visual tools turn abstract
          risk data into actionable awareness.
        </p>
      </Section>

      {/* How it works */}
      <Section icon={Brain} title="How the System Works">
        <ol className="list-inside list-decimal space-y-2 text-slate-600">
          <li>The user selects a monitored location from the dashboard.</li>
          <li>The system loads rainfall, terrain and infrastructure data for that area.</li>
          <li>The flood-risk engine processes rainfall, elevation, slope and drainage capacity.</li>
          <li>A weighted risk score (0–100) is calculated and classified as Low, Medium or High.</li>
          <li>Risk zones, shelters, hospitals and roads are visualized on an interactive map.</li>
          <li>The dashboard displays statistics, charts, analysis and recommendations.</li>
        </ol>
      </Section>

      {/* Architecture diagram */}
      <Section icon={Server} title="System Architecture">
        <div className="space-y-3">
          <ArchLayer
            icon={LayoutDashboard}
            title="React Frontend"
            desc="Vite · React Router · Leaflet · Recharts · Tailwind CSS"
            color="bg-sky-50 text-sky-600 ring-sky-100"
          />
          <ArchArrow />
          <ArchLayer
            icon={Server}
            title="Node.js + Express Backend"
            desc="REST API · /api/rainfall · /api/flood-risk · /api/shelters"
            color="bg-emerald-50 text-emerald-600 ring-emerald-100"
          />
          <ArchArrow />
          <ArchLayer
            icon={Brain}
            title="Python FastAPI Risk Engine"
            desc="POST /calculate-risk · weighted model · explainable factors"
            color="bg-violet-50 text-violet-600 ring-violet-100"
          />
          <ArchArrow />
          <ArchLayer
            icon={Database}
            title="Data Sources"
            desc="Rainfall · Terrain · Elevation · Infrastructure (demo data)"
            color="bg-amber-50 text-amber-600 ring-amber-100"
          />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          The current deployment runs the engine and data services in-browser as
          a self-contained demo. The architecture is designed so each layer can
          be deployed independently and connected via REST APIs.
        </p>
      </Section>

      {/* Tech stack */}
      <Section icon={MapIcon} title="Technology Stack">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { name: 'React', icon: LayoutDashboard },
            { name: 'Vite', icon: Server },
            { name: 'React Router', icon: MapIcon },
            { name: 'Leaflet', icon: MapIcon },
            { name: 'Recharts', icon: CloudRain },
            { name: 'Tailwind CSS', icon: LayoutDashboard },
            { name: 'Node.js', icon: Server },
            { name: 'Express', icon: Server },
            { name: 'Python', icon: Brain },
            { name: 'FastAPI', icon: Brain },
            { name: 'OpenStreetMap', icon: MapIcon },
            { name: 'Lucide Icons', icon: ShieldAlert },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{t.name}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Risk model */}
      <Section icon={Brain} title="The Risk Model">
        <p>
          The flood-risk engine uses an explainable weighted scoring model. Each
          input (rainfall, elevation, slope, drainage capacity) is normalized to
          a 0–100 sub-score and combined using fixed weights:
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <WeightChip label="Rainfall" weight="40%" />
          <WeightChip label="Elevation" weight="25%" />
          <WeightChip label="Slope" weight="20%" />
          <WeightChip label="Drainage" weight="15%" />
        </div>
        <p className="mt-3">
          Higher rainfall, lower elevation, flatter terrain and lower drainage
          capacity each increase the risk score. The final score is classified as
          Low (&lt;40), Medium (40–64) or High (&ge;65).
        </p>
      </Section>

      {/* Limitations */}
      <Section icon={AlertTriangle} title="Limitations">
        <ul className="list-inside list-disc space-y-1.5 text-slate-600">
          <li>Uses demo/sample data — not connected to real-time weather APIs.</li>
          <li>The risk model is a prototype, not a scientifically validated flood-prediction model.</li>
          <li>Does not integrate satellite imagery or digital elevation models (DEMs).</li>
          <li>This is a decision-support tool, not an official emergency warning system.</li>
          <li>Risk zones are illustrative polygons, not hydrologically simulated flood extents.</li>
        </ul>
      </Section>

      {/* Future improvements */}
      <Section icon={Lightbulb} title="Future Improvements">
        <ul className="list-inside list-disc space-y-1.5 text-slate-600">
          <li>Integration with real-time weather and rainfall APIs (IMD, OpenWeather).</li>
          <li>Satellite imagery and DEM-based terrain analysis.</li>
          <li>Machine-learning model trained on historical flood datasets.</li>
          <li>IoT river and water-level sensor integration.</li>
          <li>Government disaster-management API connectivity.</li>
          <li>Multi-language support and SMS/WhatsApp alert delivery.</li>
        </ul>
      </Section>

      {/* Footer */}
      <div className="mt-10 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-slate-600"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </a>
        <p className="text-xs text-slate-400">
          FloodGuard AI · Prototype / Decision-support tool · MIT License
        </p>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Waves;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-slate-600 [&_ol]:space-y-2 [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function ArchLayer({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: typeof Server;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-4 rounded-xl p-4 ring-1 ${color}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex justify-center">
      <ArrowRight className="h-5 w-5 -rotate-90 text-slate-300" />
    </div>
  );
}

function WeightChip({ label, weight }: { label: string; weight: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-base font-bold text-slate-900">{weight}</p>
    </div>
  );
}
