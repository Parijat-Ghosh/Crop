import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fields } from '../data/mockData';
import type { Zone } from '../data/mockData';
import MetricCard from '../components/MetricCard';
import SpectralViewer from '../components/SpectralViewer';
import ZoneDrawer from '../components/ZoneDrawer';
import HealthTrendChart from '../components/HealthTrendChart';
import StatusBadge from '../components/StatusBadge';

const LOADING_STEPS = [
  'Multispectral imagery loaded',
  'Vegetation patterns analyzed',
  'Soil anomalies detected',
  'Risk zones identified',
];

function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setStep(s => Math.max(s, i + 1)), (i + 1) * 450)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-full bg-surface">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full border-2 border-data/30 border-t-data mx-auto mb-6 animate-spin" />
        <div className="text-xs font-mono text-data uppercase tracking-widest mb-6">Analyzing Field</div>
        <div className="space-y-3">
          {LOADING_STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 transition-all duration-300 ${i < step ? 'opacity-100' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.45}s` }}
            >
              <div className="w-4 h-4 rounded-full bg-health/20 border border-health/40 flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#39D98A" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-xs text-muted text-left">{s}</span>
            </div>
          ))}
        </div>
        {step >= LOADING_STEPS.length && (
          <div className="mt-4 text-xs text-health font-medium animate-fadeIn">Analysis complete</div>
        )}
      </div>
    </div>
  );
}

function InterventionSimulator({ field }: { field: typeof fields[0] }) {
  const [irrigation, setIrrigation] = useState(50);
  const projectedHealth = Math.round(field.health + (irrigation / 100) * (100 - field.health) * 0.35);
  const projectedPest = Math.round(field.pestRisk - (irrigation / 100) * field.pestRisk * 0.38);
  const waterUsage = Math.round(irrigation * 0.36);

  return (
    <div className="bg-card border border-edge rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded bg-data/15 border border-data/30 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#49C6FF" strokeWidth="2.5">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-data">Field Intervention Simulator</span>
        <span className="ml-auto text-[10px] font-mono px-2 py-0.5 bg-warn/10 border border-warn/25 rounded text-warn">SIMULATION</span>
      </div>
      <p className="text-[11px] text-dim mb-4">What happens if I irrigate this field? Projected values are simulated for prototype demonstration.</p>

      <div className="mb-4">
        <div className="flex justify-between text-[11px] mb-2">
          <span className="text-muted">Irrigation Level</span>
          <span className="font-mono text-ink">{irrigation}%</span>
        </div>
        <input
          type="range" min="0" max="100" value={irrigation}
          onChange={e => setIrrigation(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #49C6FF ${irrigation}%, #1a2535 ${irrigation}%)` }}
        />
        <div className="flex justify-between text-[10px] text-dim mt-1">
          <span>0%</span><span>100%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Crop Health', current: `${field.health}%`, projected: `${projectedHealth}%`, up: true },
          { label: 'Pest Risk', current: `${field.pestRisk}%`, projected: `${projectedPest}%`, up: false },
          { label: 'Water Use', current: '0%', projected: `+${waterUsage}%`, up: null },
        ].map(m => (
          <div key={m.label} className="bg-panel rounded-lg p-3 text-center border border-edge">
            <div className="text-[10px] text-dim mb-2">{m.label}</div>
            <div className="text-xs text-muted line-through mb-0.5">{m.current}</div>
            <div className={`text-base font-bold font-mono ${m.up === true ? 'text-health' : m.up === false ? 'text-risk' : 'text-data'}`}>{m.projected}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FieldAnalysis() {
  const { id } = useParams<{ id: string }>();
  const field = fields.find(f => f.id === id);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedZone(null);
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, [id]);

  if (!field) return <Navigate to="/fields" replace />;
  if (loading) return <LoadingScreen />;

  const hasDrawer = selectedZone !== null;

  return (
    <div className="p-6 space-y-5 animate-fadeIn">
      {/* Field header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-ink">{field.name} — {field.crop}</h1>
            <StatusBadge status={field.status as any} size="md" />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-dim font-mono">
            <span>{field.area} ha</span>
            <span>·</span>
            <span>Stage: {field.growthStage}</span>
            <span>·</span>
            <span>Scan: {field.lastScan}</span>
            <span>·</span>
            <span>{field.imageSource}</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-data/10 border border-data/25 rounded-lg text-xs text-data font-medium hover:bg-data/15 transition-colors flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Generate Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Crop Health" value={`${field.health}%`} sub="Moderate" accent={field.health < 65 ? 'warn' : 'health'} trend={-7} />
        <MetricCard label="Soil Moisture" value={`${field.soilMoisture}%`} sub="Below optimal" accent="data" />
        <MetricCard label="Pest Risk" value={`${field.pestRisk}%`} sub="Zone C4 critical" accent="risk" />
        <MetricCard label="Stress Level" value={field.stressLevel ?? 'Moderate'} sub="Vegetative stage" accent="warn" />
      </div>

      {/* Main viewer + drawer */}
      <div className={`grid gap-4 ${hasDrawer ? 'grid-cols-1 lg:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
        {/* Spectral viewer */}
        <div style={{ minHeight: '480px' }} className="h-[55vh]">
          <SpectralViewer
            zones={field.zones}
            selectedZone={selectedZone}
            onZoneSelect={zone => setSelectedZone(prev => prev?.id === zone.id ? null : zone)}
          />
        </div>

        {/* Zone drawer */}
        {hasDrawer && selectedZone && (
          <div className="h-[55vh] overflow-hidden rounded-lg border border-edge">
            <ZoneDrawer zone={selectedZone} onClose={() => setSelectedZone(null)} />
          </div>
        )}
      </div>

      {/* Zone click prompt */}
      {!hasDrawer && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-[11px] text-dim">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            Click any zone on the field to open AI analysis
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthTrendChart />
        <InterventionSimulator field={field} />
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-edge rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5B942" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h3 className="text-sm font-semibold text-ink">Recommended Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🔴', title: 'Inspect Zone C4', desc: 'High anomaly and pest-risk score detected. Physical inspection required.', border: 'border-risk/20 bg-risk/5' },
            { icon: '🟡', title: 'Check Irrigation', desc: 'Soil moisture is below the preferred threshold in the southern section.', border: 'border-warn/20 bg-warn/5' },
            { icon: '🟡', title: 'Perform Field Inspection', desc: 'Visually inspect crops for signs of pest activity or early disease.', border: 'border-warn/20 bg-warn/5' },
          ].map(r => (
            <div key={r.title} className={`flex gap-3 p-3 rounded-lg border ${r.border}`}>
              <span className="text-xl">{r.icon}</span>
              <div>
                <div className="text-xs font-semibold text-ink mb-1">{r.title}</div>
                <div className="text-[11px] text-muted leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
