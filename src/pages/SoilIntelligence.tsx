import { fields, soilZones } from '../data/mockData';

function MoistureSVG() {
  const field = fields[3];
  function moistureColor(v: number) {
    if (v < 26) return '#8B2500';
    if (v < 32) return '#D07820';
    if (v < 40) return '#2a7a50';
    return '#2860FF';
  }

  return (
    <svg viewBox="0 0 480 360" className="w-full h-full rounded-lg overflow-hidden">
      <defs>
        <filter id="soil-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.08" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feBlend in="SourceGraphic" in2="g" mode="overlay" />
        </filter>
      </defs>
      <rect width="480" height="360" fill="#0a0f08" />
      <g filter="url(#soil-noise)">
        {field.zones.map(zone => {
          const color = moistureColor(zone.moisture);
          return (
            <rect key={zone.id} x={zone.col * 120} y={zone.row * 90} width={120} height={90} fill={color} opacity="0.88" />
          );
        })}
      </g>
      {/* Row texture */}
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 10} x2="480" y2={i * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
      ))}
      <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
        {field.zones.map(zone => (
          <rect key={`b-${zone.id}`} x={zone.col * 120} y={zone.row * 90} width={120} height={90} />
        ))}
      </g>
      {field.zones.map(zone => (
        <text key={`m-${zone.id}`} x={zone.col * 120 + 60} y={zone.row * 90 + 50}
              textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="bold" fontFamily="JetBrains Mono">
          {zone.moisture}%
        </text>
      ))}
    </svg>
  );
}

export default function SoilIntelligence() {
  const field = fields[3];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Soil Intelligence</h1>
        <p className="text-sm text-muted mt-1">Moisture analysis from multispectral imaging · Field D · 21 Aug 2026</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Average Moisture', value: `${field.soilMoisture}%`, sub: 'Moderate', color: '#49C6FF' },
          { label: 'Moisture Status', value: 'Low', sub: 'Below optimal', color: '#F5B942' },
          { label: 'Water Stress Zones', value: '18%', sub: 'Requires irrigation', color: '#F5B942' },
          { label: 'Critical Dry Zones', value: '12%', sub: 'Field D south', color: '#FF5C6C' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-edge rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-wider text-dim mb-2">{m.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-muted mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Heatmap + zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Moisture heatmap */}
        <div className="lg:col-span-2 bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-ink">Soil Moisture Distribution — Field D</div>
            <div className="text-[10px] font-mono text-data">SWIR-derived</div>
          </div>
          <div className="aspect-video">
            <MoistureSVG />
          </div>
          {/* Legend */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #8B2500, #D07820, #2a7a50, #2860FF)' }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-dim mt-1">
            <span>Dry (&lt;26%)</span><span>Low (&lt;32%)</span><span>Adequate</span><span>Moist (&gt;40%)</span>
          </div>
        </div>

        {/* Zone breakdown */}
        <div className="space-y-3">
          <div className="bg-card border border-edge rounded-xl p-4">
            <div className="text-xs font-semibold text-ink mb-3">Moisture Zones</div>
            <div className="space-y-3">
              {soilZones.map(zone => (
                <div key={zone.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{zone.label}</span>
                    <span className="font-mono font-semibold" style={{ color: zone.color }}>{zone.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-edge rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${zone.percentage}%`, background: zone.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI recommendation */}
          <div className="bg-data/5 border border-data/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-data/15 border border-data/30 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#49C6FF" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-data">Irrigation Recommendation</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">12% of the monitored field may require additional irrigation. The southern section (rows C-D) shows critically low moisture levels.</p>
            <div className="mt-3 text-[10px] text-dim">Confidence: 74%</div>
          </div>

          {/* Zone details */}
          <div className="bg-card border border-edge rounded-xl p-4">
            <div className="text-xs font-semibold text-ink mb-3">Critical Zones</div>
            {field.zones.filter(z => z.moisture < 28).map(zone => (
              <div key={zone.id} className="flex items-center justify-between py-2 border-b border-edge last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-risk" />
                  <span className="text-xs font-mono text-ink">Zone {zone.id}</span>
                </div>
                <span className="text-xs font-mono text-risk">{zone.moisture}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plain language summary */}
      <div className="bg-card border border-edge rounded-xl p-5">
        <div className="text-xs font-semibold text-ink mb-3">What This Means for Your Farm</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted">
          <div className="p-3 bg-panel rounded-lg border border-edge">
            <div className="text-warn font-semibold mb-1">Soil is relatively dry</div>
            <p>Average moisture (31%) is below the 40% optimal threshold for wheat at vegetative stage.</p>
          </div>
          <div className="p-3 bg-panel rounded-lg border border-edge">
            <div className="text-risk font-semibold mb-1">South section needs water</div>
            <p>Zones C4 and D3-D4 are critically dry (&lt;26%). Immediate irrigation recommended.</p>
          </div>
          <div className="p-3 bg-panel rounded-lg border border-edge">
            <div className="text-health font-semibold mb-1">North section adequate</div>
            <p>Zones A1-A3 have adequate moisture (41-48%). No irrigation needed in the next 48 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
