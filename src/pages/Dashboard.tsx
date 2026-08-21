import { useNavigate } from 'react-router-dom';
import { farm, fields, alerts } from '../data/mockData';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';

function FieldCard({ field }: { field: typeof fields[0] }) {
  const navigate = useNavigate();
  const bgColor = field.status === 'healthy' ? 'bg-health/10 border-health/25' : field.status === 'critical' ? 'bg-risk/10 border-risk/25' : 'bg-warn/10 border-warn/25';

  function MiniFieldSVG() {
    const colors: Record<string, string> = { healthy: '#39D98A', moderate: '#F5B942', critical: '#FF5C6C' };
    const baseColor = colors[field.status] ?? '#F5B942';
    const zones = Array.from({ length: 16 }).map((_, i) => ({
      x: (i % 4) * 30,
      y: Math.floor(i / 4) * 22,
      v: Math.random() * 0.4 + (field.health / 100) * 0.6,
    }));
    return (
      <svg viewBox="0 0 120 88" className="w-full h-full rounded">
        <defs>
          <filter id={`mn-${field.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" stitchTiles="stitch" result="n" />
            <feColorMatrix type="saturate" values="0" in="n" result="g" />
            <feBlend in="SourceGraphic" in2="g" mode="overlay" />
          </filter>
        </defs>
        <g filter={`url(#mn-${field.id})`}>
          {zones.map((z, i) => {
            const t = Math.max(0, Math.min(1, z.v));
            const r = Math.round(57 + (245 - 57) * (1 - t));
            const g = Math.round(217 + (185 - 217) * (1 - t));
            const b = Math.round(138 + (66 - 138) * (1 - t));
            return <rect key={i} x={z.x} y={z.y} width={30} height={22} fill={`rgb(${r},${g},${b})`} opacity="0.9" />;
          })}
        </g>
        {/* Crop rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 11} x2="120" y2={i * 11} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {field.status === 'critical' && (
          <>
            <rect x="90" y="44" width="30" height="22" fill="transparent" stroke="#FF5C6C" strokeWidth="1.5" opacity="0.7" />
            <circle cx="105" cy="55" r="4" fill="#FF5C6C" opacity="0.8" />
          </>
        )}
      </svg>
    );
  }

  return (
    <div
      onClick={() => navigate(`/fields/${field.id}`)}
      className={`bg-card border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group ${bgColor}`}
    >
      <div className="aspect-video relative">
        <MiniFieldSVG />
        <div className="absolute top-2 left-2">
          <StatusBadge status={field.status as any} />
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50">{field.area} ha</div>
        {field.status === 'critical' && (
          <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-risk/20 border border-risk/50 flex items-center justify-center animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-risk" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-semibold text-ink group-hover:text-data transition-colors">{field.name}</div>
            <div className="text-xs text-muted">{field.crop} · {field.growthStage}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dim group-hover:text-data transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Health', value: `${field.health}%`, color: field.health > 80 ? '#39D98A' : field.health > 65 ? '#F5B942' : '#FF5C6C' },
            { label: 'Moisture', value: `${field.soilMoisture}%`, color: '#49C6FF' },
            { label: 'Pest', value: `${field.pestRisk}%`, color: field.pestRisk > 60 ? '#FF5C6C' : field.pestRisk > 35 ? '#F5B942' : '#39D98A' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="text-[10px] text-dim mb-0.5">{m.label}</div>
              <div className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{greeting}, Ravi</h1>
          <p className="text-sm text-muted mt-1">{"Here's what's happening across your farm today."}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-dim">21 Aug 2026 · 09:14</div>
          <div className="flex items-center gap-1.5 mt-1 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-health" />
            <span className="text-[11px] text-health font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Farm Health" value={farm.overallHealth} unit="/ 100" sub="Healthy overall" accent="health" />
        <MetricCard label="Fields Monitored" value={farm.fieldsCount} sub="All active" accent="data"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>} />
        <MetricCard label="Active Alerts" value={farm.activeAlerts} sub="2 critical" accent="risk" trend={-7}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>} />
        <MetricCard label="High-Risk Zones" value={farm.highRiskZones} sub="Field D" accent="warn"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>} />
        <MetricCard label="Area Monitored" value={farm.totalArea} unit="ha" sub="Punjab, India" accent="muted" />
      </div>

      {/* Fields grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Field Status</h2>
          <button onClick={() => navigate('/fields')} className="text-xs text-data hover:text-data/80 transition-colors">View all fields →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map(field => <FieldCard key={field.id} field={field} />)}
        </div>
      </div>

      {/* Bottom row: Alerts + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent alerts */}
        <div className="lg:col-span-2 bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Recent Alerts</h3>
            <button onClick={() => navigate('/alerts')} className="text-xs text-data hover:text-data/80">View all →</button>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 4).map(alert => {
              const colors = { critical: '#FF5C6C', warning: '#F5B942', info: '#49C6FF' };
              const color = colors[alert.type];
              return (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-panel border border-edge hover:border-edge/60 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-ink truncate">{alert.title}</span>
                      <span className="text-[10px] font-mono text-dim whitespace-nowrap">{alert.timestamp.split(',')[0]}</span>
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">{alert.field}{alert.zone && ` · ${alert.zone}`}{alert.value && ` · ${alert.value}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-data/15 border border-data/25 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#49C6FF" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-data">AI Farm Summary</span>
          </div>
          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <p>Field D shows declining crop health (63%) with high pest risk in Zone C4 (81%). Immediate field inspection recommended.</p>
            <p>Fields A and B remain healthy. Field C exhibits moderate stress patterns, monitor over next scan cycle.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-edge">
            <div className="text-[10px] text-dim mb-2">Priority Actions</div>
            {[
              { color: '#FF5C6C', text: 'Inspect Zone C4 · Field D' },
              { color: '#F5B942', text: 'Check irrigation · Field D' },
              { color: '#F5B942', text: 'Monitor stress · Field C' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <span className="text-[11px] text-muted">{a.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/fields/field-d')}
            className="mt-3 w-full py-2 bg-data/10 border border-data/25 rounded-lg text-xs text-data font-medium hover:bg-data/15 transition-colors"
          >
            Analyze Field D →
          </button>
        </div>
      </div>
    </div>
  );
}
