import { useState, useRef, useCallback } from 'react';
import type { Zone } from '../data/mockData';
import FieldMapSVG from './FieldMapSVG';

interface SpectralViewerProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
}

const LAYERS = [
  { id: 'rgb', label: 'RGB' },
  { id: 'nir', label: 'NIR' },
  { id: 'redEdge', label: 'Red Edge' },
  { id: 'ndvi', label: 'NDVI' },
  { id: 'ndre', label: 'NDRE' },
  { id: 'moisture', label: 'Moisture' },
  { id: 'pestRisk', label: 'Pest Risk' },
];

const LEGENDS: Record<string, { colors: string[]; labels: string[] }> = {
  rgb:      { colors: ['#645026', '#789830', '#2c6e26'], labels: ['Bare soil', 'Stressed', 'Healthy crop'] },
  nir:      { colors: ['#1a2540', '#b43c3c', '#ff8282'], labels: ['Low reflectance', 'Mid', 'High reflectance'] },
  redEdge:  { colors: ['#6614aa', '#3c78aa', '#49C6FF'], labels: ['Low chlorophyll', 'Moderate', 'High'] },
  ndvi:     { colors: ['#FF5C6C', '#F5B942', '#39D98A'], labels: ['Stressed (< 0.3)', 'Moderate', 'Healthy (> 0.65)'] },
  ndre:     { colors: ['#FF5C6C', '#F5B942', '#49C6FF'], labels: ['Low (< 0.2)', 'Moderate', 'High (> 0.5)'] },
  moisture: { colors: ['#8B4513', '#F5B942', '#3c78ff'], labels: ['Dry (< 25%)', 'Adequate', 'Moist (> 55%)'] },
  pestRisk: { colors: ['#39D98A', '#F5B942', '#FF5C6C'], labels: ['Low risk', 'Moderate', 'High risk (> 70%)'] },
};

function LegendBar({ layer }: { layer: string }) {
  const legend = LEGENDS[layer] ?? LEGENDS.ndvi;
  const gradient = `linear-gradient(to right, ${legend.colors.join(', ')})`;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 rounded-full" style={{ background: gradient }} />
      <div className="flex justify-between w-full absolute text-[10px] text-dim font-mono" style={{ top: '50%' }}>
      </div>
      <div className="flex gap-4 text-[10px] text-dim font-mono whitespace-nowrap">
        {legend.labels.map((l, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: legend.colors[i] }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SpectralViewer({ zones, selectedZone, onZoneSelect }: SpectralViewerProps) {
  const [activeLayer, setActiveLayer] = useState('ndvi');
  const [compareMode, setCompareMode] = useState(false);
  const [compareSlider, setCompareSlider] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setCompareSlider(Math.max(8, Math.min(92, pct)));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setCompareSlider(Math.max(8, Math.min(92, pct)));
  }, []);

  return (
    <div className="flex flex-col h-full bg-panel border border-edge rounded-lg overflow-hidden">
      {/* Layer selector */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-edge bg-base overflow-x-auto flex-shrink-0">
        <div className="flex gap-1 flex-1">
          {LAYERS.map(layer => (
            <button
              key={layer.id}
              onClick={() => { setActiveLayer(layer.id); setCompareMode(false); }}
              className={`px-3 py-1.5 rounded text-[11px] font-medium whitespace-nowrap transition-all ${
                activeLayer === layer.id && !compareMode
                  ? 'bg-data/15 text-data border border-data/35'
                  : 'text-muted hover:text-ink hover:bg-card border border-transparent'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCompareMode(c => !c)}
          className={`ml-2 px-3 py-1.5 rounded text-[11px] font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 flex-shrink-0 ${
            compareMode
              ? 'bg-warn/15 text-warn border-warn/35'
              : 'text-muted hover:text-ink bg-card border-edge'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
          </svg>
          Compare
        </button>
      </div>

      {/* Viewer area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <FieldMapSVG
          zones={zones}
          activeLayer={activeLayer}
          selectedZone={selectedZone}
          onZoneClick={onZoneSelect}
          compareMode={compareMode}
          compareSlider={compareSlider}
        />

        {/* Compare slider handle */}
        {compareMode && (
          <div
            className="absolute top-0 bottom-0 z-10 cursor-ew-resize"
            style={{ left: `${compareSlider}%`, width: '2px', background: 'rgba(255,255,255,0.6)' }}
            onMouseDown={handleMouseDown}
            onTouchStart={() => { isDragging.current = true; }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/90 border-2 border-white shadow-xl flex items-center justify-center text-surface text-sm font-bold cursor-ew-resize">
              ⟺
            </div>
          </div>
        )}

        {/* Compare mode info */}
        {compareMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-base/90 border border-edge rounded-lg text-[11px] text-muted text-center backdrop-blur-sm max-w-xs">
            Spectral analysis reveals localized crop stress not visible in RGB imagery
          </div>
        )}

        {/* Viewer controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {[
            { icon: '+', title: 'Zoom in' },
            { icon: '−', title: 'Zoom out' },
            { icon: '⛶', title: 'Fullscreen' },
          ].map(({ icon, title }) => (
            <button
              key={title}
              title={title}
              className="w-8 h-8 bg-base/90 border border-edge rounded-md flex items-center justify-center text-muted hover:text-ink text-sm transition-colors backdrop-blur-sm"
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Active layer label */}
        {!compareMode && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-base/90 border border-data/30 rounded-md text-[10px] font-mono text-data backdrop-blur-sm">
            {LAYERS.find(l => l.id === activeLayer)?.label ?? activeLayer.toUpperCase()}
          </div>
        )}

        {/* Scan metadata */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-dim bg-base/70 px-2 py-1 rounded backdrop-blur-sm">
          21 Aug 2026 · Drone Survey · Field D
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-edge bg-base flex-shrink-0">
        <LegendBar layer={compareMode ? 'ndvi' : activeLayer} />
      </div>
    </div>
  );
}
