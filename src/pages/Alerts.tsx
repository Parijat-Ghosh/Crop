import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alerts } from '../data/mockData';

type Filter = 'all' | 'critical' | 'warning' | 'resolved';

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  critical: 'Critical',
  warning: 'Warning',
  resolved: 'Resolved',
};

export default function Alerts() {
  const [filter, setFilter] = useState<Filter>('all');
  const navigate = useNavigate();

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'resolved') return a.resolved;
    return a.type === filter && !a.resolved;
  });

  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.type === 'critical' && !a.resolved).length,
    warning: alerts.filter(a => a.type === 'warning' && !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length,
  };

  const typeColors: Record<string, string> = {
    critical: '#FF5C6C',
    warning: '#F5B942',
    info: '#49C6FF',
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Alerts & Recommendations</h1>
          <p className="text-sm text-muted mt-1">{counts.critical} critical · {counts.warning} warnings · {counts.resolved} resolved</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-data/5 border border-data/20 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-health animate-pulse" />
          <span className="text-[11px] font-mono text-data">Monitoring active</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? 'bg-data/15 text-data border border-data/35'
                : 'bg-card border border-edge text-muted hover:text-ink'
            }`}
          >
            {FILTER_LABELS[f]}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-edge text-dim">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-edge rounded-xl p-12 text-center">
            <div className="text-health text-2xl mb-3">✓</div>
            <div className="text-sm font-semibold text-ink mb-1">No alerts</div>
            <div className="text-xs text-muted">No {filter !== 'all' ? filter : ''} alerts at this time.</div>
          </div>
        ) : (
          filtered.map(alert => {
            const color = typeColors[alert.type];
            return (
              <div
                key={alert.id}
                className={`bg-card border rounded-xl p-5 transition-all ${
                  alert.resolved ? 'opacity-60 border-edge' : 'border-edge hover:border-edge/60'
                }`}
                style={!alert.resolved ? { borderLeftWidth: '3px', borderLeftColor: color } : {}}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.resolved ? (
                        <div className="w-6 h-6 rounded-full bg-health/15 border border-health/30 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#39D98A" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ background: `${color}15`, borderColor: `${color}40` }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-ink">{alert.title}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border"
                              style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                          {alert.type}
                        </span>
                        {alert.resolved && <span className="text-[10px] text-health font-medium">Resolved</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted mb-2">
                        <span>{alert.field}</span>
                        {alert.zone && <><span>·</span><span>{alert.zone}</span></>}
                        {alert.value && <><span>·</span><span className="font-mono font-semibold" style={{ color }}>{alert.value}</span></>}
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-mono text-dim mb-2">{alert.timestamp}</div>
                    {!alert.resolved && (
                      <button
                        onClick={() => navigate('/fields/field-d')}
                        className="px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-all"
                        style={{ color, borderColor: `${color}40`, background: `${color}10` }}
                      >
                        {alert.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
