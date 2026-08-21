import type { Zone } from '../data/mockData';

interface ZoneDrawerProps {
  zone: Zone;
  onClose: () => void;
}

function SignalRow({ label, value, direction, status }: { label: string; value: string; direction: '↑' | '↓'; status: 'high' | 'low' | 'critical' }) {
  const color = status === 'critical' ? 'text-risk' : status === 'high' ? 'text-risk' : 'text-warn';
  return (
    <div className="flex items-center justify-between py-2 border-b border-edge last:border-0">
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm font-bold ${color}`}>{direction}</span>
        <span className="text-xs text-muted">{label}</span>
      </div>
      <span className={`text-xs font-mono font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function MetricRow({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-dim">{label}</span>
      <span className="text-sm font-mono font-semibold" style={{ color: color ?? '#E8EFF8' }}>
        {value}{unit && <span className="text-xs text-muted ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-dim font-semibold">AI Confidence</span>
        <span className="text-sm font-mono font-bold text-data">{value}%</span>
      </div>
      <div className="h-1.5 bg-card rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: 'linear-gradient(to right, #49C6FF, #39D98A)' }}
        />
      </div>
    </div>
  );
}

export default function ZoneDrawer({ zone, onClose }: ZoneDrawerProps) {
  const isHighRisk = zone.pestRisk > 60 || zone.health < 50;
  const status = zone.status === 'critical' ? 'CRITICAL' : zone.status === 'warning' ? 'HIGH RISK' : zone.status === 'moderate' ? 'MODERATE' : 'HEALTHY';
  const statusColor = zone.status === 'critical' || zone.status === 'warning' ? '#FF5C6C' : zone.status === 'moderate' ? '#F5B942' : '#39D98A';
  const confidence = zone.status === 'critical' ? 82 : zone.status === 'warning' ? 74 : zone.status === 'moderate' ? 68 : 91;

  const moistureLabel = zone.moisture < 28 ? 'Relatively dry' : zone.moisture < 40 ? 'Moderate moisture' : 'Adequate moisture';
  const ndviLabel = zone.ndvi < 0.4 ? 'Crop health poor' : zone.ndvi < 0.6 ? 'Crop health moderate' : 'Crop health good';

  return (
    <div className="h-full flex flex-col bg-panel border-l border-edge animate-slideInRight overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-edge flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-data/15 border border-data/30 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#49C6FF" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-data">AI Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-ink font-mono">Zone {zone.id}</h2>
          <p className="text-xs text-muted mt-0.5">{zone.stress} stress · {zone.health}% crop health</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border"
            style={{ color: statusColor, borderColor: `${statusColor}40`, backgroundColor: `${statusColor}10` }}
          >
            {status}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-muted hover:text-ink hover:bg-card transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Zone metrics */}
      <div className="p-4 border-b border-edge space-y-2.5">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-3">Zone Metrics</div>
        <MetricRow label="Crop Health" value={`${zone.health}%`} color={zone.health < 50 ? '#FF5C6C' : zone.health < 70 ? '#F5B942' : '#39D98A'} />
        <MetricRow label="NDVI" value={zone.ndvi.toFixed(2)} color={zone.ndvi < 0.4 ? '#FF5C6C' : zone.ndvi < 0.6 ? '#F5B942' : '#39D98A'} />
        <MetricRow label="NDRE" value={zone.ndre.toFixed(2)} color={zone.ndre < 0.25 ? '#FF5C6C' : zone.ndre < 0.4 ? '#F5B942' : '#49C6FF'} />
        <MetricRow label="Soil Moisture" value={`${zone.moisture}%`} color={zone.moisture < 28 ? '#F5B942' : '#49C6FF'} />
        <MetricRow label="Pest Risk" value={`${zone.pestRisk}%`} color={zone.pestRisk > 60 ? '#FF5C6C' : zone.pestRisk > 40 ? '#F5B942' : '#39D98A'} />
        <MetricRow label="Stress Level" value={zone.stress} />
      </div>

      {/* Farmer-friendly interpretation */}
      <div className="p-4 border-b border-edge space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-3">Plain Language</div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted w-28 flex-shrink-0">Crop status:</span>
          <span className={zone.health < 50 ? 'text-risk' : zone.health < 70 ? 'text-warn' : 'text-health'}>{ndviLabel}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted w-28 flex-shrink-0">Soil water:</span>
          <span className={zone.moisture < 28 ? 'text-warn' : 'text-health'}>{moistureLabel}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted w-28 flex-shrink-0">Pest threat:</span>
          <span className={zone.pestRisk > 60 ? 'text-risk' : zone.pestRisk > 40 ? 'text-warn' : 'text-health'}>
            {zone.pestRisk > 60 ? 'High-risk area — inspect field' : zone.pestRisk > 40 ? 'Elevated risk — monitor' : 'Low risk'}
          </span>
        </div>
      </div>

      {/* Why flagged */}
      {isHighRisk && (
        <div className="p-4 border-b border-edge">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-3">Why Was This Zone Flagged?</div>
          <div className="bg-card rounded-lg p-3 space-y-0.5">
            {zone.ndvi < 0.55 && <SignalRow label="NDVI" value={zone.ndvi.toFixed(2)} direction="↓" status="high" />}
            {zone.ndre < 0.35 && <SignalRow label="NDRE" value={zone.ndre.toFixed(2)} direction="↓" status="high" />}
            {zone.moisture < 32 && <SignalRow label="Moisture" value={`${zone.moisture}%`} direction="↓" status="low" />}
            {zone.pestRisk > 50 && <SignalRow label="Pest Risk" value={`${zone.pestRisk}%`} direction="↑" status="critical" />}
          </div>
        </div>
      )}

      {/* AI Interpretation */}
      <div className="p-4 border-b border-edge">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-3">AI Interpretation</div>
        <div className="bg-data/5 border border-data/20 rounded-lg p-3 mb-3">
          <p className="text-xs leading-relaxed text-ink font-medium">
            {zone.status === 'critical'
              ? 'Localized crop stress detected with high anomaly score. Reduced vegetation response combined with low moisture suggests possible water stress. Elevated risk patterns may indicate potential pest activity.'
              : zone.status === 'warning'
              ? 'Spectral patterns indicate developing crop stress. Chlorophyll index trending downward. Requires field validation to distinguish between abiotic stress and potential pest activity.'
              : zone.status === 'moderate'
              ? 'Mild spectral anomaly observed. Vegetation health below optimal range. Monitor closely over the next scan cycle.'
              : 'Zone within expected spectral range. No significant anomalies detected.'}
          </p>
        </div>
        <p className="text-[10px] text-dim italic">
          Potential anomaly — requires field validation. This is a prototype analysis.
        </p>
      </div>

      {/* Confidence */}
      <div className="p-4 border-b border-edge">
        <ConfidenceBar value={confidence} />
      </div>

      {/* Recommendations */}
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-3">Recommended Actions</div>
        <div className="space-y-2">
          {zone.pestRisk > 60 && (
            <div className="flex gap-3 p-3 bg-risk/5 border border-risk/20 rounded-lg">
              <span className="text-base mt-0.5">🔴</span>
              <div>
                <div className="text-xs font-semibold text-ink">Inspect Zone {zone.id}</div>
                <div className="text-[11px] text-muted mt-0.5">High pest-risk anomaly detected. Physical field inspection recommended.</div>
              </div>
            </div>
          )}
          {zone.moisture < 30 && (
            <div className="flex gap-3 p-3 bg-warn/5 border border-warn/20 rounded-lg">
              <span className="text-base mt-0.5">🟡</span>
              <div>
                <div className="text-xs font-semibold text-ink">Check Irrigation</div>
                <div className="text-[11px] text-muted mt-0.5">Soil moisture below threshold. Additional irrigation may be needed.</div>
              </div>
            </div>
          )}
          {zone.pestRisk > 40 && (
            <div className="flex gap-3 p-3 bg-warn/5 border border-warn/20 rounded-lg">
              <span className="text-base mt-0.5">🟡</span>
              <div>
                <div className="text-xs font-semibold text-ink">Perform Field Inspection</div>
                <div className="text-[11px] text-muted mt-0.5">Visually inspect crops for signs of pest activity or disease.</div>
              </div>
            </div>
          )}
          {zone.status === 'healthy' && (
            <div className="flex gap-3 p-3 bg-health/5 border border-health/20 rounded-lg">
              <span className="text-base mt-0.5">🟢</span>
              <div>
                <div className="text-xs font-semibold text-ink">No Action Required</div>
                <div className="text-[11px] text-muted mt-0.5">Zone is within healthy thresholds. Continue routine monitoring.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
