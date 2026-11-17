import React from 'react';
import { Laptop, Router, Server, Monitor, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface NetworkLabDiagramProps {
  hasAlerts: boolean;
  trustedServer: string;
}

export const NetworkLabDiagram: React.FC<NetworkLabDiagramProps> = ({
  hasAlerts,
  trustedServer,
}) => {
  const nodes = [
    {
      id: 'terminal',
      title: 'POS Terminal',
      ip: '192.0.2.11',
      mac: '02:00:00:00:00:11',
      icon: Laptop,
      status: 'normal'
    },
    {
      id: 'gateway',
      title: 'Gateway',
      ip: '192.0.2.1',
      mac: '02:00:00:00:00:01',
      icon: Router,
      status: 'normal'
    },
    {
      id: 'dhcp',
      title: 'DHCP Server',
      ip: trustedServer,
      mac: '02:00:00:00:00:10',
      icon: Server,
      status: 'trusted'
    },
    {
      id: 'monitor',
      title: 'POSGuard Monitor',
      ip: '192.0.2.20',
      mac: '02:00:00:00:00:20',
      icon: Monitor,
      status: hasAlerts ? 'alert' : 'listening'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Lab Simulation Status
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Scenario C1: Unseparated merchant POS LAN topology
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Running
        </span>
      </div>

      {/* Nodes Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isLast = index === nodes.length - 1;
          return (
            <div key={node.id} className="relative group">
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  node.status === 'alert'
                    ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60'
                    : 'bg-slate-50/80 border-slate-200/70 dark:bg-slate-800/60 dark:border-slate-700/60'
                }`}
              >
                <div className="w-9 h-9 mx-auto rounded-lg bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2 shadow-soft-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{node.title}</p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{node.ip}</p>
                <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {node.mac}
                </p>
              </div>

              {!isLast && (
                <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live State Banner */}
      <div
        className={`mt-4 p-2.5 rounded-xl border flex items-center justify-between text-xs ${
          hasAlerts
            ? 'bg-amber-50/90 text-amber-900 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60'
            : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60'
        }`}
      >
        <div className="flex items-center gap-2">
          {hasAlerts ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          )}
          <span className="font-semibold">
            {hasAlerts
              ? 'Anomalous DHCP offers intercepted & flagged'
              : 'Simulation running • Normal baseline operation'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold opacity-75">Isolated Lab</span>
      </div>
    </div>
  );
};
