import { useNavigate } from 'react-router-dom';
import { fields } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Fields() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Fields</h1>
          <p className="text-sm text-muted mt-1">Green Valley Farm · Punjab, India · {fields.length} fields</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Healthy', 'At Risk'].map(f => (
            <button key={f} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${f === 'All' ? 'bg-data/15 text-data border border-data/35' : 'bg-card border border-edge text-muted hover:text-ink'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-edge rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-edge bg-panel">
              {['Field', 'Crop', 'Area', 'Health', 'Moisture', 'Pest Risk', 'Status', 'Last Scan', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-dim font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, i) => (
              <tr
                key={field.id}
                onClick={() => navigate(`/fields/${field.id}`)}
                className={`border-b border-edge cursor-pointer hover:bg-panel transition-colors group ${i === fields.length - 1 ? 'border-0' : ''}`}
              >
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-ink group-hover:text-data transition-colors">{field.name}</div>
                  <div className="text-[10px] text-dim font-mono">{field.imageSource}</div>
                </td>
                <td className="px-4 py-4 text-xs text-muted">{field.crop}</td>
                <td className="px-4 py-4 text-xs font-mono text-muted">{field.area} ha</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-edge rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${field.health}%`,
                          background: field.health > 80 ? '#39D98A' : field.health > 65 ? '#F5B942' : '#FF5C6C',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono" style={{ color: field.health > 80 ? '#39D98A' : field.health > 65 ? '#F5B942' : '#FF5C6C' }}>{field.health}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-mono text-data">{field.soilMoisture}%</td>
                <td className="px-4 py-4 text-xs font-mono" style={{ color: field.pestRisk > 60 ? '#FF5C6C' : field.pestRisk > 35 ? '#F5B942' : '#39D98A' }}>{field.pestRisk}%</td>
                <td className="px-4 py-4"><StatusBadge status={field.status as any} /></td>
                <td className="px-4 py-4 text-[11px] font-mono text-dim">{field.lastScan}</td>
                <td className="px-4 py-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dim group-hover:text-data transition-colors">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Farm area map */}
      <div className="bg-card border border-edge rounded-xl p-4">
        <div className="text-xs font-semibold text-ink mb-3">Farm Overview</div>
        <div className="grid grid-cols-2 gap-2 h-48">
          {fields.map(field => {
            const bg = field.status === 'healthy' ? 'bg-health/15 border-health/30 hover:border-health/50' :
                       field.status === 'critical' ? 'bg-risk/15 border-risk/30 hover:border-risk/50' :
                       'bg-warn/15 border-warn/30 hover:border-warn/50';
            const tc = field.status === 'healthy' ? 'text-health' : field.status === 'critical' ? 'text-risk' : 'text-warn';
            return (
              <div key={field.id}
                   onClick={() => navigate(`/fields/${field.id}`)}
                   className={`border rounded-lg p-3 cursor-pointer transition-all ${bg} flex flex-col justify-between`}>
                <div>
                  <div className="text-xs font-semibold text-ink">{field.name}</div>
                  <div className="text-[10px] text-muted">{field.crop}</div>
                </div>
                <div className={`text-xl font-bold font-mono ${tc}`}>{field.health}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
