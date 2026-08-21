import { useState } from 'react';
import type { Zone } from '../data/mockData';

// ─── Color helpers ────────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }

function lerp(a: number, b: number, t: number) { return a + (b - a) * clamp(t); }

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): string {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`;
}

function triColor(
  ca: [number, number, number],
  cb: [number, number, number],
  cc: [number, number, number],
  t: number,
): string {
  if (t < 0.5) return lerpColor(ca, cb, t * 2);
  return lerpColor(cb, cc, (t - 0.5) * 2);
}

const C_RISK: [number, number, number] = [255, 92, 108];
const C_WARN: [number, number, number] = [245, 185, 66];
const C_HLTH: [number, number, number] = [57, 217, 138];
const C_DATA: [number, number, number] = [73, 198, 255];

function ndviColor(v: number) { return triColor(C_RISK, C_WARN, C_HLTH, clamp((v - 0.25) / 0.55)); }
function ndreColor(v: number) { return triColor(C_RISK, C_WARN, C_DATA, clamp((v - 0.15) / 0.45)); }
function moistureColor(v: number) { return triColor([139, 69, 19], C_WARN, [60, 120, 255], clamp((v - 20) / 40)); }
function pestColor(v: number) { return triColor(C_HLTH, C_WARN, C_RISK, clamp(v / 100)); }
function nirColor(v: number) { return triColor([26, 37, 64], [180, 60, 60], [255, 130, 130], clamp((v - 40) / 55)); }
function redEdgeColor(v: number) { return triColor([100, 20, 160], [60, 120, 170], C_DATA, clamp((v - 0.15) / 0.45)); }
function rgbColor(v: number) { return triColor([100, 78, 38], [120, 155, 48], [44, 110, 38], clamp((v - 50) / 50)); }

function getZoneColor(zone: Zone, layer: string): string {
  switch (layer) {
    case 'nir':      return nirColor(zone.health);
    case 'redEdge':  return redEdgeColor(zone.ndre);
    case 'ndvi':     return ndviColor(zone.ndvi);
    case 'ndre':     return ndreColor(zone.ndre);
    case 'moisture': return moistureColor(zone.moisture);
    case 'pestRisk': return pestColor(zone.pestRisk);
    default:         return rgbColor(zone.health);
  }
}

// ─── Zone tooltip ─────────────────────────────────────────────────────────────

function Tooltip({ zone, layer, x, y }: { zone: Zone; layer: string; x: number; y: number }) {
  const statusColors: Record<string, string> = {
    healthy: '#39D98A', moderate: '#F5B942', warning: '#F5B942', critical: '#FF5C6C',
  };
  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ left: x + 12, top: y - 8 }}
    >
      <div className="bg-card border border-edge rounded-lg p-3 shadow-xl text-xs min-w-[140px]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono font-semibold text-ink">Zone {zone.id}</span>
          <span style={{ color: statusColors[zone.status] }} className="text-[10px] font-semibold uppercase">{zone.status}</span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between"><span className="text-dim">Health</span><span className="text-ink font-medium">{zone.health}%</span></div>
          <div className="flex justify-between"><span className="text-dim">NDVI</span><span className="text-ink font-medium">{zone.ndvi.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-dim">Moisture</span><span className="text-ink font-medium">{zone.moisture}%</span></div>
          <div className="flex justify-between"><span className="text-dim">Pest Risk</span>
            <span style={{ color: zone.pestRisk > 60 ? '#FF5C6C' : zone.pestRisk > 40 ? '#F5B942' : '#39D98A' }} className="font-medium">
              {zone.pestRisk}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main SVG component ────────────────────────────────────────────────────────

interface FieldMapSVGProps {
  zones: Zone[];
  activeLayer: string;
  selectedZone: Zone | null;
  onZoneClick: (zone: Zone) => void;
  compareMode?: boolean;
  compareSlider?: number;
}

const W = 480;
const H = 360;
const COLS = 4;
const ROWS = 4;
const ZW = W / COLS;   // 120
const ZH = H / ROWS;   // 90

export default function FieldMapSVG({ zones, activeLayer, selectedZone, onZoneClick, compareMode, compareSlider = 50 }: FieldMapSVGProps) {
  const [hovered, setHovered] = useState<Zone | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  function renderField(layer: string, clipId?: string) {
    return (
      <g clipPath={clipId ? `url(#${clipId})` : undefined}>
        {/* Background */}
        <rect width={W} height={H} fill="#0a1008" />

        {/* Zone fills */}
        <g filter="url(#fieldNoise)">
          {zones.map(zone => {
            const x = zone.col * ZW;
            const y = zone.row * ZH;
            const color = getZoneColor(zone, layer);
            const gradId = `g-${zone.id}-${layer}`;
            return (
              <g key={zone.id}>
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.72" />
                  </linearGradient>
                </defs>
                <rect x={x} y={y} width={ZW} height={ZH} fill={`url(#${gradId})`} />
              </g>
            );
          })}
        </g>

        {/* Crop row texture (RGB / NIR only) */}
        {(layer === 'rgb' || layer === 'nir') && (
          <rect width={W} height={H} fill="url(#cropRows)" />
        )}

        {/* Pest hotspot circles (pest risk layer) */}
        {layer === 'pestRisk' && zones.filter(z => z.pestRisk > 60).map(zone => (
          <circle key={`hot-${zone.id}`}
            cx={zone.col * ZW + ZW / 2}
            cy={zone.row * ZH + ZH / 2}
            r={ZW * 0.3 * (zone.pestRisk / 100)}
            fill="rgba(255,92,108,0.2)"
            stroke="rgba(255,92,108,0.5)"
            strokeWidth="1"
          />
        ))}
      </g>
    );
  }

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* Organic noise filter */}
          <filter id="fieldNoise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.07" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Glow for selected zone */}
          <filter id="zoneGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#49C6FF" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Crop row pattern */}
          <pattern id="cropRows" x="0" y="0" width={W} height="9" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4.5" x2={W} y2="4.5" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          </pattern>

          {/* Compare clip paths */}
          {compareMode && (
            <>
              <clipPath id="clipLeft">
                <rect x="0" y="0" width={W * (compareSlider / 100)} height={H} />
              </clipPath>
              <clipPath id="clipRight">
                <rect x={W * (compareSlider / 100)} y="0" width={W * (1 - compareSlider / 100)} height={H} />
              </clipPath>
            </>
          )}
        </defs>

        {compareMode ? (
          <>
            {renderField('rgb', 'clipLeft')}
            {renderField('ndvi', 'clipRight')}
            {/* Divider */}
            <line
              x1={W * (compareSlider / 100)} y1="0"
              x2={W * (compareSlider / 100)} y2={H}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
            />
            <circle
              cx={W * (compareSlider / 100)} cy={H / 2}
              r="14" fill="rgba(255,255,255,0.9)"
            />
            <text
              x={W * (compareSlider / 100)} y={H / 2 + 4}
              textAnchor="middle"
              fill="#080B0F"
              fontSize="10"
              fontWeight="bold"
              style={{ userSelect: 'none' }}
            >
              ⟺
            </text>
            {/* Labels */}
            <text x="12" y="20" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="JetBrains Mono">RGB</text>
            <text x={W - 12} y="20" fill="#49C6FF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">NDVI</text>
          </>
        ) : (
          renderField(activeLayer)
        )}

        {/* Zone borders */}
        {!compareMode && (
          <g fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5">
            {zones.map(zone => (
              <rect key={`b-${zone.id}`} x={zone.col * ZW} y={zone.row * ZH} width={ZW} height={ZH} />
            ))}
          </g>
        )}

        {/* Zone labels */}
        {!compareMode && (
          <g>
            {zones.map(zone => (
              <text
                key={`l-${zone.id}`}
                x={zone.col * ZW + 7}
                y={zone.row * ZH + 16}
                fill="rgba(255,255,255,0.35)"
                fontSize="9"
                fontFamily="JetBrains Mono"
                style={{ userSelect: 'none' }}
              >
                {zone.id}
              </text>
            ))}
          </g>
        )}

        {/* Clickable zone overlays */}
        {!compareMode && zones.map(zone => (
          <rect
            key={`hit-${zone.id}`}
            x={zone.col * ZW}
            y={zone.row * ZH}
            width={ZW}
            height={ZH}
            fill="transparent"
            onClick={() => onZoneClick(zone)}
            onMouseEnter={() => setHovered(zone)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Hover highlight */}
        {!compareMode && hovered && hovered.id !== selectedZone?.id && (
          <rect
            x={hovered.col * ZW}
            y={hovered.row * ZH}
            width={ZW}
            height={ZH}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Selected zone */}
        {!compareMode && selectedZone && (
          <rect
            x={selectedZone.col * ZW}
            y={selectedZone.row * ZH}
            width={ZW}
            height={ZH}
            fill="rgba(73,198,255,0.08)"
            stroke="#49C6FF"
            strokeWidth="2.5"
            filter="url(#zoneGlow)"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Critical zones pulsing ring */}
        {!compareMode && zones.filter(z => z.status === 'critical').map(zone => (
          <circle
            key={`pulse-${zone.id}`}
            cx={zone.col * ZW + ZW / 2}
            cy={zone.row * ZH + ZH / 2}
            r="6"
            fill="#FF5C6C"
            stroke="rgba(255,92,108,0.5)"
            strokeWidth="8"
            opacity="0.8"
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </svg>

      {/* HTML tooltip */}
      {hovered && !compareMode && (
        <Tooltip zone={hovered} layer={activeLayer} x={tooltipPos.x} y={tooltipPos.y} />
      )}
    </div>
  );
}
