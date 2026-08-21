import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fields, cropHealthDistribution, stressZones, healthHistory } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const fieldHealthData = fields.map(f => ({ name: f.name, health: f.health, crop: f.crop }));

function MiniHeatmap() {
  const colors: Record<string, string> = {
    healthy: '#39D98A', moderate: '#8DA840', warning: '#F5B942', critical: '#FF5C6C',
  };
  const field = fields[3]; // Field D

  return (
    <svg viewBox="0 0 480 360" className="w-full h-full rounded-lg overflow-hidden">
      <defs>
        <filter id="ch-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" stitchTiles="stitch" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feBlend in="SourceGraphic" in2="g" mode="overlay" />
        </filter>
      </defs>
      <g filter="url(#ch-noise)">
        {field.zones.map(zone => (
          <rect key={zone.id} x={zone.col * 120} y={zone.row * 90} width={120} height={90}
                fill={colors[zone.status]} opacity="0.85" />
        ))}
      </g>
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 10} x2="480" y2={i * 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
      ))}
      <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
        {field.zones.map(zone => (
          <rect key={`b-${zone.id}`} x={zone.col * 120} y={zone.row * 90} width={120} height={90} />
        ))}
      </g>
      {/* Health % labels */}
      {field.zones.map(zone => (
        <text key={`t-${zone.id}`} x={zone.col * 120 + 60} y={zone.row * 90 + 50}
              textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="bold" fontFamily="JetBrains Mono">
          {zone.health}%
        </text>
      ))}
    </svg>
  );
}

export default function CropHealth() {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-ink">Crop Health Monitoring</h1>
        <p className="text-sm text-muted mt-1">Spectral vegetation analysis · All fields · 21 Aug 2026</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Overall Health', value: '78/100', sub: 'Farm average', color: '#F5B942' },
          { label: 'Healthy Area', value: '68%', sub: '32.4 ha', color: '#39D98A' },
          { label: 'Moderate Stress', value: '21%', sub: '10.0 ha', color: '#F5B942' },
          { label: 'Critical Zones', value: '11%', sub: '5.2 ha', color: '#FF5C6C' },
        ].map(m => (
          <div key={m.label} className="bg-card border border-edge rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-wider text-dim mb-2">{m.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-muted mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Health distribution bar */}
      <div className="bg-card border border-edge rounded-xl p-4">
        <div className="text-xs font-semibold text-ink mb-3">Health Distribution</div>
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-3">
          {cropHealthDistribution.map(d => (
            <div key={d.label} className="flex items-center justify-center text-[10px] font-mono text-white/80 transition-all"
                 style={{ width: `${d.value}%`, background: d.color }}>
              {d.value > 15 ? `${d.value}%` : ''}
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          {cropHealthDistribution.map(d => (
            <div key={d.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
              <span className="text-[11px] text-muted">{d.label}</span>
              <span className="text-[11px] font-mono text-ink font-semibold">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Field heatmap + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Heatmap */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-ink">Field D — Crop Health Heatmap</div>
            <div className="text-[10px] font-mono text-dim">NDVI-derived</div>
          </div>
          <div className="aspect-video">
            <MiniHeatmap />
          </div>
          <div className="flex gap-3 mt-3">
            {[['#39D98A', 'Healthy (>75%)'], ['#F5B942', 'Moderate (50-75%)'], ['#FF5C6C', 'Critical (<50%)']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                <span className="text-[10px] text-muted">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health by field */}
        <div className="bg-card border border-edge rounded-xl p-4">
          <div className="text-xs font-semibold text-ink mb-4">Health By Field</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fieldHealthData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2535" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#151D26', border: '1px solid #1a2535', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#8899AA' }}
                itemStyle={{ color: '#E8EFF8' }}
              />
              <Bar dataKey="health" radius={[3, 3, 0, 0]}
                   fill="#49C6FF"
                   label={{ position: 'top', fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono', formatter: (v: number) => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stress zones */}
      <div className="bg-card border border-edge rounded-xl p-4">
        <div className="text-xs font-semibold text-ink mb-4">Detected Stress Zones</div>
        <div className="space-y-2">
          {stressZones.map(zone => (
            <div key={`${zone.zone}-${zone.field}`} className="flex items-center justify-between p-3 bg-panel border border-edge rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${zone.level === 'High' ? 'bg-risk' : 'bg-warn'}`} />
                <div>
                  <span className="text-xs font-semibold text-ink">Zone {zone.zone}</span>
                  <span className="text-[11px] text-muted ml-2">{zone.field}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-mono text-muted">NDVI {zone.ndvi.toFixed(2)}</div>
                <StatusBadge status={zone.level === 'High' ? 'warning' : 'moderate'} label={zone.level} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="bg-card border border-edge rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-ink">Vegetation Health Trend — Field D</div>
          <div className="text-[10px] font-mono text-risk">↓ 27% over 51 days</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={healthHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2535" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis domain={[55, 92]} tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151D26', border: '1px solid #1a2535', borderRadius: '8px', fontSize: '11px' }} />
            <Line type="monotone" dataKey="health" stroke="#49C6FF" strokeWidth={2} dot={{ fill: '#49C6FF', r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
