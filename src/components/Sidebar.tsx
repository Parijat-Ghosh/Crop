import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/fields',
    label: 'Fields',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/health',
    label: 'Crop Health',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: '/soil',
    label: 'Soil Intel',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M8 5.2A9.9 9.9 0 0 1 12 4c1.44 0 2.8.31 4 .86" />
        <path d="M6 6.3A9.96 9.96 0 0 0 2 12h3" />
        <path d="M18 6.3A9.96 9.96 0 0 1 22 12h-3" />
      </svg>
    ),
  },
  {
    path: '/pest-risk',
    label: 'Pest Risk',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    path: '/alerts',
    label: 'Alerts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-base border-r border-edge flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-edge">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-health/20 border border-health/30 flex items-center justify-center text-health">
            <LeafIcon />
          </div>
          <div>
            <div className="text-sm font-bold text-ink tracking-tight">AgriVision</div>
            <div className="text-[10px] text-dim font-mono">v2.4.1 BETA</div>
          </div>
        </div>
      </div>

      {/* Farm label */}
      <div className="px-5 py-3 border-b border-edge">
        <div className="text-[10px] text-dim uppercase tracking-widest mb-1">Active Farm</div>
        <div className="text-xs text-muted font-medium">Green Valley Farm</div>
        <div className="text-[10px] text-dim">Punjab, India</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-data/10 text-data border border-data/20'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-edge px-3 py-3 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs text-muted hover:text-ink hover:bg-card transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          Settings
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-6 h-6 rounded-full bg-data/20 border border-data/30 flex items-center justify-center text-[10px] font-bold text-data">R</div>
          <div>
            <div className="text-xs text-ink font-medium">Ravi Kumar</div>
            <div className="text-[10px] text-dim">Field Officer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
