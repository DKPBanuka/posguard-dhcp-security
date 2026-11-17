import React from 'react';
import {
  LayoutDashboard,
  Network,
  Activity,
  ShieldAlert,
  FlaskConical,
  BarChart3,
  BookOpen,
  Server,
  Info,
  X
} from 'lucide-react';
import { RouteId } from '../types';

interface SidebarProps {
  currentRoute: RouteId;
  totalAlerts: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  totalAlerts,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as RouteId,
      name: 'Overview',
      hash: '#overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'lab' as RouteId,
      name: 'Network Lab',
      hash: '#lab',
      icon: Network,
      badge: 'Live'
    },
    {
      id: 'monitor' as RouteId,
      name: 'DHCP Monitor',
      hash: '#monitor',
      icon: Activity,
      badge: null
    },
    {
      id: 'alerts' as RouteId,
      name: 'Threat Alerts',
      hash: '#alerts',
      icon: ShieldAlert,
      badge: totalAlerts > 0 ? totalAlerts : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'scoring' as RouteId,
      name: 'Risk Ranking',
      hash: '#scoring',
      icon: FlaskConical,
      badge: 'Table 6.1'
    },
    {
      id: 'eval' as RouteId,
      name: 'Evaluation',
      hash: '#eval',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'guide' as RouteId,
      name: 'User Guide',
      hash: '#guide',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'backend' as RouteId,
      name: 'Backend Spec',
      hash: '#backend',
      icon: Server,
      badge: 'FastAPI'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:self-start lg:shrink-0 lg:z-20 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Threat Research Lab
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.hash}
                  onClick={onCloseMobile}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-soft-sm font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-600 rounded-r-full" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom card: Data Source Simulated (as in all 4 screenshots) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-700/60 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Data Source</span>
              </div>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              Simulated Dataset
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Dataset: Demo / Synthetic v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
