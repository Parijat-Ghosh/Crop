import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { healthHistory } from '../data/mockData';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-edge rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-dim font-mono mb-1">{label}</div>
      <div className="text-data font-bold">{payload[0].value}% health</div>
      {payload[1] && <div className="text-health font-medium">NDVI {payload[1].value.toFixed(2)}</div>}
    </div>
  );
}

export default function HealthTrendChart() {
  return (
    <div className="bg-card border border-edge rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Field Health Over Time</div>
          <div className="text-xl font-bold text-ink mt-1">63% <span className="text-sm font-normal text-muted">current</span></div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-dim font-mono">Jul 01 → Aug 21</div>
          <div className="text-xs text-risk font-medium mt-0.5">↓ 27% decline</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={healthHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2535" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[55, 92]}
            tick={{ fill: '#55687A', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={70} stroke="#F5B942" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="health"
            stroke="#49C6FF"
            strokeWidth={2}
            dot={{ fill: '#49C6FF', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#49C6FF', stroke: '#111820', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 p-2.5 bg-panel rounded-md border border-edge">
        <div className="text-[10px] font-semibold text-warn mb-1">Trend Detected</div>
        <p className="text-[11px] text-muted">Crop health has declined approximately 27% over the monitored period. Significant drop observed post August 1st.</p>
      </div>
    </div>
  );
}
