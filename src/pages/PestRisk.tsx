import { useState } from 'react';
import { fields, pestHotspots } from '../data/mockData';

function PestHeatmapSVG({ selectedHotspot, onSelect }: { selectedHotspot: string | null; onSelect: (z: string) => void }) {
  const field = fields[3];

  function pestColor(v: number) {
    if (v < 30) return '#1a3a1a';
    if (v < 50) return '#384a10';
    if (v < 65) return '#c07820';
    return '#c02830';
  }

  return (
    <svg viewBox="0 0 480 360" className="w-full h-full rounded-lg overflow-hidden cursor-crosshair">
      <defs>
        <filter id="pest-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="3" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feBlend in="SourceGraphic" in2="g" mode="overlay" />
        </filter>
        <filter id="hotspot-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#FF5C6C" floodOpacity="0.5" result="c" />
          <feComposite in="c" in2="blur" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="480" height="360" fill="#0a0808" />
      <g filter="url(#pest-noise)">
        {field.zones.map(zone => (
          <rect key={zone.id} x={zone.col * 120} y={zone.row * 90} width={120} height={90}
                fill={pestColor(zone.pestRisk)} opacity="0.9" />
        ))}
      </g>
      {/* Row texture */}
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 10} x2="480" y2={i * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
      ))}
      {/* Risk hotspot radials */}
      {pestHotspots.map(h => {
        const zone = field.zones.find(z => z.id === h.zone);
        if (!zone) return null;
        const cx = zone.col * 120 + 60;
        const cy = zone.row * 90 + 45;
        const r = 30 * (h.risk / 100);
        return (
          <g key={h.zone} onClick={() => onSelect(h.zone)} style={{ cursor: 'pointer' }}>
            <circle cx={cx} cy={cy} r={r * 1.8} fill={`rgba(255,92,108,${h.risk / 400})`} />
            <circle cx={cx} cy={cy} r={r} fill={`rgba(255,92,108,${h.risk / 180})`}
                    filter={selectedHotspot === h.zone ? 'url(#hotspot-glow)' : undefined} />
            <circle cx={cx} cy={cy} r="6" fill="#FF5C6C" opacity="0.9" />
            {selectedHotspot === h.zone && (
              <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="#FF5C6C" strokeWidth="2" strokeDasharray="4 4" />
            )}
          </g>
        );
      })}
      {/* Zone borders */}
      <g fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5">
        {field.zones.map(zone => (
          <rect key={`b-${zone.id}`} x={zone.col * 120} y={zone.row * 90} width={120} height={90} />
        ))}
      </g>
      {/* Risk labels */}
      {field.zones.filter(z => z.pestRisk > 55).map(zone => (
        <text key={`l-${zone.id}`} x={zone.col * 120 + 60} y={zone.row * 90 + 80}
              textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="JetBrains Mono">
          Zone {zone.id}
        </text>
      ))}
    </svg>
  );
}

export default function PestRisk() {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const field = fields[3];
  const hotspot = pestHotspots.find(h => h.zone === selectedHotspot);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pest Risk Monitoring</h1>
        <p className="text-sm text-muted mt-1">Spectral anomaly detection · Field D · 21 Aug 2026</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Field Pest Risk', value: `${field.pestRisk}%`, sub: 'High', color: '#FF5C6C' },
          { label: 'Potential Hotspots', value: '3', sub: 'Detected', color: '#F5B942' },
          { label: 'Critical Zones', value: '1', sub: 'Zone C4', color: '#FF5C6C' },
          { label: 'AI Confidence', value: '78%', sub: 'Requires validation', color: '#49C6FF' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-edge rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-wider text-dim mb-2">{m.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-muted mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Heatmap + panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-ink">Pest Risk Heatmap — Field D</div>
            <div className="flex gap-2 text-[10px] font-mono text-dim">
              <span className="px-2 py-0.5 bg-risk/10 border border-risk/30 rounded text-risk">● {pestHotspots.length} hotspots</span>
            </div>
          </div>
          <div className="aspect-video">
            <PestHeatmapSVG selectedHotspot={selectedHotspot} onSelect={setSelectedHotspot} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #1a3a1a, #384a10, #c07820, #c02830)' }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-dim mt-1">
            <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
          </div>
          <p className="text-[11px] text-dim mt-2">Click a hotspot to view details</p>
        </div>

        {/* Hotspot panel */}
        <div className="space-y-3">
          {hotspot ? (
            <div className="bg-risk/5 border border-risk/25 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-risk" />
                <span className="text-xs font-semibold text-risk">Potential Pest Hotspot</span>
              </div>
              <div className="text-lg font-bold font-mono text-ink mb-3">Zone {hotspot.zone}</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Risk Level</span>
                  <span className="text-risk font-mono font-bold">{hotspot.risk}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Confidence</span>
                  <span className="text-data font-mono">{hotspot.confidence}%</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[10px] text-dim mb-2 uppercase tracking-wider">Observed Signals</div>
                {hotspot.signals.map(s => (
                  <div key={s} className="flex items-center gap-2 py-1 text-[11px] text-muted">
                    <span className="w-1 h-1 rounded-full bg-risk flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 bg-warn/5 border border-warn/20 rounded-lg">
                <div className="text-[11px] text-warn font-semibold">Recommendation</div>
                <div className="text-[11px] text-muted mt-0.5">Field inspection recommended. Potential anomaly requires validation.</div>
              </div>
              <button onClick={() => setSelectedHotspot(null)} className="mt-3 w-full text-[11px] text-dim hover:text-muted transition-colors">Clear selection</button>
            </div>
          ) : (
            <div className="bg-card border border-edge rounded-xl p-4 text-center">
              <div className="text-dim text-xs py-4">Click a hotspot on the map to view analysis</div>
            </div>
          )}

          {/* All hotspots list */}
          <div className="bg-card border border-edge rounded-xl p-4">
            <div className="text-xs font-semibold text-ink mb-3">All Detected Hotspots</div>
            <div className="space-y-2">
              {pestHotspots.map(h => (
                <div key={h.zone} onClick={() => setSelectedHotspot(h.zone)}
                     className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                       selectedHotspot === h.zone ? 'bg-risk/10 border-risk/30' : 'bg-panel border-edge hover:border-edge/60'
                     }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: h.risk > 75 ? '#FF5C6C' : h.risk > 55 ? '#F5B942' : '#39D98A' }} />
                    <span className="text-xs font-mono text-ink">Zone {h.zone}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: h.risk > 75 ? '#FF5C6C' : h.risk > 55 ? '#F5B942' : '#39D98A' }}>{h.risk}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
