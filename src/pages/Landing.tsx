import { useNavigate } from 'react-router-dom';

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="absolute w-full h-px bg-data/20" style={{ top: `${i * 2.5}%` }} />
      ))}
    </div>
  );
}

function FieldPreviewSVG() {
  const zones = [
    { r: 0, c: 0, v: 0.91 }, { r: 0, c: 1, v: 0.84 }, { r: 0, c: 2, v: 0.79 }, { r: 0, c: 3, v: 0.72 },
    { r: 1, c: 0, v: 0.82 }, { r: 1, c: 1, v: 0.71 }, { r: 1, c: 2, v: 0.68 }, { r: 1, c: 3, v: 0.61 },
    { r: 2, c: 0, v: 0.73 }, { r: 2, c: 1, v: 0.65 }, { r: 2, c: 2, v: 0.54 }, { r: 2, c: 3, v: 0.32 },
    { r: 3, c: 0, v: 0.76 }, { r: 3, c: 1, v: 0.69 }, { r: 3, c: 2, v: 0.61 }, { r: 3, c: 3, v: 0.55 },
  ];

  function ndviColor(v: number) {
    if (v < 0.4) return '#c03040';
    if (v < 0.55) return '#d07820';
    if (v < 0.7) return '#509830';
    return '#2a7a25';
  }

  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 40px rgba(57, 217, 138, 0.15))' }}>
      <defs>
        <filter id="ln-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
        </filter>
        <linearGradient id="ln-vignette" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#080B0F" stopOpacity="0.6" />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#080B0F" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g filter="url(#ln-noise)">
        {zones.map(({ r, c, v }) => {
          const x = c * 80;
          const y = r * 60;
          return (
            <rect key={`${r}-${c}`} x={x} y={y} width={80} height={60} fill={ndviColor(v)} opacity="0.85" />
          );
        })}
      </g>
      {/* Crop rows */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 10} x2="320" y2={i * 10} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      ))}
      {/* Critical zone highlight */}
      <rect x={240} y={120} width={80} height={60} fill="transparent" stroke="#FF5C6C" strokeWidth="2" opacity="0.8" />
      <circle cx={280} cy={150} r="6" fill="#FF5C6C" opacity="0.9" />
      {/* Vignette */}
      <rect width="320" height="240" fill="url(#ln-vignette)" />
      {/* AI annotation */}
      <rect x={244} y={114} width={70} height={18} rx="3" fill="rgba(255,92,108,0.15)" stroke="rgba(255,92,108,0.5)" strokeWidth="0.5" />
      <text x={250} y={126} fill="#FF5C6C" fontSize="7" fontFamily="JetBrains Mono">ANOMALY DETECTED</text>
      {/* NDVI label */}
      <text x="6" y="16" fill="rgba(73,198,255,0.6)" fontSize="8" fontFamily="JetBrains Mono">NDVI LAYER</text>
      <text x="6" y="28" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono">Field D · Wheat · 12.4 ha</text>
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-hidden relative">
      <ScanLine />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-health/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-data/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-edge/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-health/20 border border-health/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39D98A" strokeWidth="1.5">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="text-sm font-bold text-ink">AgriVision</span>
          <span className="text-[10px] font-mono text-dim px-1.5 py-0.5 border border-edge rounded">BETA</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="hidden sm:block">AI-powered intelligence for healthier fields.</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-base border border-edge rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-health" />
            <span className="font-mono text-[10px] text-data">SYSTEM ONLINE</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between flex-1 px-8 py-12 gap-12 max-w-7xl mx-auto w-full">
        {/* Text */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-data/10 border border-data/25 rounded-full text-[11px] text-data font-mono mb-6">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Multispectral · AI Analysis · Field Intelligence
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-ink leading-tight mb-4">
            See what your crops
            <span className="block text-health">cannot tell you.</span>
          </h1>

          <p className="text-base text-muted leading-relaxed mb-8 max-w-md">
            Transform multispectral drone imagery into actionable crop intelligence. Detect stress, pest risk, and soil conditions before they become problems.
          </p>

          {/* Workflow */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {['Observe', 'Analyze', 'Detect', 'Explain', 'Act'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-data/15 border border-data/30 flex items-center justify-center text-[10px] font-mono text-data mb-1">{i + 1}</div>
                  <span className="text-[10px] text-muted whitespace-nowrap">{step}</span>
                </div>
                {i < arr.length - 1 && <div className="w-4 h-px bg-edge flex-shrink-0 mb-3" />}
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-health text-surface font-semibold text-sm rounded-lg hover:bg-health/90 transition-all hover:shadow-lg hover:shadow-health/20 active:scale-95"
            >
              Open Farm Dashboard
            </button>
            <button
              onClick={() => navigate('/fields/field-d')}
              className="px-6 py-3 bg-card border border-edge text-ink font-medium text-sm rounded-lg hover:bg-panel hover:border-data/30 transition-all"
            >
              View Demo Field →
            </button>
          </div>
        </div>

        {/* Field preview */}
        <div className="flex-1 max-w-lg w-full">
          <div className="bg-base border border-edge rounded-xl overflow-hidden shadow-2xl">
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-panel">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-risk/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warn/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-health/60" />
                </div>
                <span className="text-[10px] font-mono text-dim">Field D — Wheat — NDVI Analysis</span>
              </div>
              <span className="text-[10px] font-mono text-data">LIVE</span>
            </div>

            {/* SVG field */}
            <div className="aspect-video">
              <FieldPreviewSVG />
            </div>

            {/* Alert strip */}
            <div className="px-4 py-3 bg-risk/5 border-t border-risk/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-risk" />
                <span className="text-xs text-risk font-medium">High Pest Risk · Zone C4 · 81%</span>
              </div>
              <span className="text-[10px] font-mono text-dim">Confidence 82%</span>
            </div>
          </div>

          {/* Floating metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Crop Health', value: '63%', color: '#F5B942' },
              { label: 'Pest Risk', value: '78%', color: '#FF5C6C' },
              { label: 'Soil Moisture', value: '31%', color: '#49C6FF' },
            ].map(m => (
              <div key={m.label} className="bg-card border border-edge rounded-lg p-3 text-center">
                <div className="text-[10px] text-dim mb-1">{m.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="relative z-10 border-t border-edge px-8 py-4 flex items-center justify-between">
        <span className="text-[11px] text-dim font-mono">Smart India Hackathon · AgriVision Platform · 2026</span>
        <span className="text-[11px] text-dim">Prototype — ML model integration pending</span>
      </div>
    </div>
  );
}
