interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  trend?: number;
  accent?: 'health' | 'warn' | 'risk' | 'data' | 'muted';
  icon?: React.ReactNode;
}

const ACCENT_CLASSES = {
  health: 'text-health',
  warn: 'text-warn',
  risk: 'text-risk',
  data: 'text-data',
  muted: 'text-ink',
};

export default function MetricCard({ label, value, unit, sub, trend, accent = 'muted', icon }: MetricCardProps) {
  const valueColor = ACCENT_CLASSES[accent];
  return (
    <div className="bg-card border border-edge rounded-lg p-4 flex flex-col gap-2 hover:border-edge/80 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-dim">{label}</span>
        {icon && <span className="text-dim">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold leading-none ${valueColor}`}>{value}</span>
        {unit && <span className="text-sm text-muted mb-0.5">{unit}</span>}
        {trend !== undefined && (
          <span className={`text-xs mb-0.5 font-medium ${trend < 0 ? 'text-risk' : 'text-health'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}
