import React from 'react';
import { Shield, Bell, Moon, Sun, Menu, RefreshCw, Cpu, Activity } from 'lucide-react';
import { RouteId } from '../types';

interface NavbarProps {
  currentRoute: RouteId;
  totalAlerts: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  totalAlerts,
  isDarkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Brand & Left Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="#overview" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">POSGuard</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800">
                  SecLab
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                Network Security Research
              </p>
            </div>
          </a>
        </div>

        {/* Center / Status Indicator (desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-full shadow-soft-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Simulation Mode</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Synthetic POS Lab Data</span>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? "Switch to Soft Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <a
            href="#alerts"
            className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Threat Alerts"
            aria-label="Threat Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {totalAlerts}
              </span>
            )}
          </a>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* User Profile Pill matching screenshot ("JD / PB Pasindu Banuka - Researcher") */}
          <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-soft-sm hover:border-slate-300 transition-all">
            <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              PB
            </div>
            <div className="text-left hidden sm:block pr-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">Pasindu Banuka</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Security Researcher</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
