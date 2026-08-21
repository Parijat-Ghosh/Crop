interface StatusBadgeProps {
  status: 'healthy' | 'moderate' | 'warning' | 'critical' | 'info';
  label?: string;
  size?: 'sm' | 'md';
}

const CONFIG = {
  healthy: { dot: 'bg-health', text: 'text-health', bg: 'bg-health/10 border-health/30', label: 'Healthy' },
  moderate: { dot: 'bg-warn', text: 'text-warn', bg: 'bg-warn/10 border-warn/30', label: 'Moderate' },
  warning: { dot: 'bg-warn', text: 'text-warn', bg: 'bg-warn/10 border-warn/30', label: 'Warning' },
  critical: { dot: 'bg-risk', text: 'text-risk', bg: 'bg-risk/10 border-risk/30', label: 'Critical' },
  info: { dot: 'bg-data', text: 'text-data', bg: 'bg-data/10 border-data/30', label: 'Info' },
};

export default function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  const padding = size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5';
  const fontSize = size === 'md' ? 'text-xs' : 'text-[10px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-medium uppercase tracking-wider ${padding} ${fontSize} ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label ?? cfg.label}
    </span>
  );
}
