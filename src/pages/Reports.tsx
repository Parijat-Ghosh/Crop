import { fields, healthHistory, pestHotspots, stressZones } from '../data/mockData';

export default function Reports() {
  const field = fields[3];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Field Health Report</h1>
          <p className="text-sm text-muted mt-1">Field D · Wheat · Generated 21 Aug 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-data/10 border border-data/25 rounded-lg text-xs text-data font-medium hover:bg-data/15 transition-colors flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
          <button className="px-4 py-2 bg-health/10 border border-health/25 rounded-lg text-xs text-health font-medium hover:bg-health/15 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Report header card */}
      <div className="bg-card border border-edge rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-edge">
          <div>
            <div className="text-xs font-mono text-dim mb-1">AGRIVISION · FIELD INTELLIGENCE REPORT</div>
            <div className="text-xl font-bold text-ink">Field D — Wheat Analysis</div>
            <div className="text-xs text-muted mt-0.5">Green Valley Farm · Punjab, India · 21 August 2026</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-dim mb-1">Report ID</div>
            <div className="text-xs font-mono text-muted">RPT-2026-0821-D</div>
          </div>
        </div>

        {/* Summary grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Field Area', value: `${field.area} ha`, color: '#E8EFF8' },
            { label: 'Crop Health', value: `${field.health}%`, color: '#F5B942' },
            { label: 'Pest Risk', value: `${field.pestRisk}%`, color: '#FF5C6C' },
            { label: 'Soil Moisture', value: `${field.soilMoisture}%`, color: '#49C6FF' },
          ].map(m => (
            <div key={m.label} className="text-center p-3 bg-panel rounded-lg border border-edge">
              <div className="text-[10px] text-dim mb-1.5">{m.label}</div>
              <div className="text-xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Crop health section */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-data" />
            <div className="text-sm font-semibold text-ink">Crop Health Assessment</div>
          </div>
          <div className="space-y-3 text-xs text-muted">
            <p>Overall crop health is at <span className="text-warn font-semibold">63%</span>, classified as moderate. Significant decline observed over the past 51 days.</p>
            <div className="space-y-2">
              {healthHistory.map(h => (
                <div key={h.date} className="flex items-center gap-3">
                  <span className="w-14 text-dim font-mono text-[10px]">{h.date}</span>
                  <div className="flex-1 h-1.5 bg-edge rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-data" style={{ width: `${h.health}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-ink">{h.health}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Soil condition */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-data" />
            <div className="text-sm font-semibold text-ink">Soil Condition</div>
          </div>
          <div className="space-y-2 text-xs text-muted">
            <p>Soil moisture averaging <span className="text-warn font-semibold">31%</span> — below optimal range of 40-55% for wheat.</p>
            <div className="space-y-2 mt-3">
              {[
                { label: 'North section (A1-A4)', moisture: 43, status: 'Adequate' },
                { label: 'Mid section (B1-B4)', moisture: 34, status: 'Borderline' },
                { label: 'South section (C1-D4)', moisture: 27, status: 'Critical' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-2 bg-panel rounded-md border border-edge">
                  <span className="text-muted">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-ink">{s.moisture}%</span>
                    <span className={`text-[10px] font-medium ${s.status === 'Critical' ? 'text-risk' : s.status === 'Borderline' ? 'text-warn' : 'text-health'}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pest risk section */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-risk" />
            <div className="text-sm font-semibold text-ink">Pest Risk Analysis</div>
          </div>
          <div className="space-y-2 text-xs text-muted">
            <p>Field D shows elevated pest risk at <span className="text-risk font-semibold">78%</span> with {pestHotspots.length} identified hotspots. Immediate field validation recommended.</p>
            <div className="space-y-2 mt-3">
              {pestHotspots.map(h => (
                <div key={h.zone} className="flex items-center justify-between p-2 bg-panel rounded-md border border-edge">
                  <span className="font-mono text-ink">Zone {h.zone}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: h.risk > 75 ? '#FF5C6C' : '#F5B942' }} className="font-mono font-semibold">{h.risk}%</span>
                    <span className="text-[10px] text-dim">conf. {h.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High-risk zones */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-warn" />
            <div className="text-sm font-semibold text-ink">High-Risk Zones</div>
          </div>
          <div className="space-y-2">
            {stressZones.map(zone => (
              <div key={`${zone.zone}-${zone.field}`} className="p-3 bg-panel border border-edge rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-ink">Zone {zone.zone}</span>
                  <span className={`text-xs font-medium ${zone.level === 'High' ? 'text-risk' : 'text-warn'}`}>{zone.level} Stress</span>
                </div>
                <div className="flex gap-3 text-[11px] text-muted">
                  <span>NDVI: <span className="font-mono text-ink">{zone.ndvi.toFixed(2)}</span></span>
                  <span>{zone.field}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-edge rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full bg-warn" />
          <div className="text-sm font-semibold text-ink">Recommended Actions</div>
        </div>
        <div className="space-y-3">
          {[
            { priority: '01', icon: '🔴', title: 'Immediate Field Inspection — Zone C4', desc: 'Highest pest-risk anomaly. Physical field inspection required within 24-48 hours to validate spectral findings.', urgency: 'Immediate' },
            { priority: '02', icon: '🟡', title: 'Irrigation — South Section', desc: 'Zones C4, D3, D4 show critically low moisture. Additional irrigation needed within 72 hours.', urgency: 'High' },
            { priority: '03', icon: '🟡', title: 'Monitor Field B — Zone B2', desc: 'Moderate stress trend detected. Schedule next drone survey within 7 days.', urgency: 'Moderate' },
          ].map(r => (
            <div key={r.priority} className="flex gap-4 p-3 bg-panel border border-edge rounded-lg">
              <span className="text-xl">{r.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-ink">{r.title}</span>
                  <span className={`text-[10px] font-semibold uppercase ml-auto ${r.urgency === 'Immediate' ? 'text-risk' : r.urgency === 'High' ? 'text-warn' : 'text-data'}`}>{r.urgency}</span>
                </div>
                <p className="text-[11px] text-muted">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-panel border border-edge rounded-xl p-4 text-center">
        <p className="text-[11px] text-dim">This report is generated from spectral analysis of drone imagery. All AI-derived findings are indicative and require field validation. This is a prototype analysis — results should not be used for critical agricultural decisions without expert review.</p>
      </div>
    </div>
  );
}
