import { useLocation } from 'react-router-dom';
import { alerts } from '../data/mockData';

const TITLES: Record<string, string> = {
  '/dashboard': 'Farm Overview',
  '/fields': 'Fields',
  '/health': 'Crop Health',
  '/soil': 'Soil Intelligence',
  '/pest-risk': 'Pest Risk',
  '/alerts': 'Alerts',
  '/reports': 'Reports',
};

export default function TopNav() {
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'Field Analysis';
  const isFieldDetail = location.pathname.startsWith('/fields/');
  const fieldId = isFieldDetail ? location.pathname.split('/')[2] : null;
  const unresolved = alerts.filter(a => !a.resolved).length;

  return (
    <header className="h-14 border-b border-edge bg-base flex items-center px-6 gap-4 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex-1">
        {isFieldDetail ? (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="text-dim">Fields</span>
            <span className="text-dim">/</span>
            <span className="text-ink font-medium capitalize">{fieldId?.replace('-', ' ').replace('field ', 'Field ')}</span>
            <span className="text-dim">/</span>
            <span className="text-data">Analysis</span>
          </div>
        ) : (
          <h1 className="text-sm font-semibold text-ink">{title}</h1>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-edge rounded-md text-xs text-dim w-48">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Search fields...
      </div>

      {/* Alerts badge */}
      <button className="relative p-1.5 text-muted hover:text-ink transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unresolved > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-risk text-[9px] font-bold text-white rounded-full flex items-center justify-center">
            {unresolved}
          </span>
        )}
      </button>

      {/* AI status */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-data/5 border border-data/20 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-health animate-pulse" />
        <span className="text-[10px] font-mono text-data">AI ACTIVE</span>
      </div>
    </header>
  );
}
