import React, { useState } from 'react';
import { Play, RotateCcw, ShieldCheck, Flame, Radio, Server, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SimulationControlsProps {
  trustedServer: string;
  onUpdateTrustedServer: (ip: string) => void;
  onTriggerNormalLease: () => void;
  onTriggerRenewal: () => void;
  onTriggerRogueOffer: () => void;
  onTriggerStarvationBurst: () => void;
  onTriggerTunnelVision?: () => void;
  onReset: () => void;
  onSeedDemo: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  trustedServer,
  onUpdateTrustedServer,
  onTriggerNormalLease,
  onTriggerRenewal,
  onTriggerRogueOffer,
  onTriggerStarvationBurst,
  onTriggerTunnelVision,
  onReset,
  onSeedDemo,
}) => {
  const [inputIp, setInputIp] = useState(trustedServer);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const handleAction = (label: string, action: () => void) => {
    action();
    setActiveFeedback(label);
    setTimeout(() => setActiveFeedback(null), 2500);
  };

  const handleIpChange = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTrustedServer(inputIp);
    setActiveFeedback(`Trusted DHCP Server updated to ${inputIp}`);
    setTimeout(() => setActiveFeedback(null), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 lg:p-5 shadow-soft mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Trusted server input */}
        <form onSubmit={handleIpChange} className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Server className="w-4 h-4" />
            </div>
            <span>Trusted DHCP Server:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              className="px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-36 sm:w-40"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Set
            </button>
          </div>
        </form>

        {/* Right: Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Normal Lease */}
          <button
            onClick={() => handleAction('Normal Lease dispatched (DISCOVER -> OFFER -> REQUEST -> ACK)', onTriggerNormalLease)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-soft-sm transition-all active:scale-95"
            title="Inject legitimate DORA exchange"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Normal Lease</span>
          </button>

          {/* Renewal */}
          <button
            onClick={() => handleAction('Renewal request injected (REQUEST -> ACK)', onTriggerRenewal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60 shadow-soft-sm transition-all active:scale-95"
            title="Inject DHCP renewal handshake"
          >
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>Renewal</span>
          </button>

          {/* Rogue Offer */}
          <button
            onClick={() => handleAction('Rogue DHCP Offer attack injected! (Rule 1 trigger)', onTriggerRogueOffer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 shadow-soft-sm transition-all active:scale-95"
            title="Inject rogue offer from unauthorized IP"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rogue Offer</span>
          </button>

          {/* Starvation Burst */}
          <button
            onClick={() => handleAction('Starvation Burst injected (25 DISCOVERs, R8 trigger)', onTriggerStarvationBurst)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 shadow-soft-sm transition-all active:scale-95"
            title="Inject 25 rapid DISCOVER packets (Rule R8)"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Starvation (R8)</span>
          </button>

          {/* TunnelVision Route Push */}
          {onTriggerTunnelVision && (
            <button
              onClick={() => handleAction('TunnelVision & Gateway MAC attack injected (R7 & R9 trigger)', onTriggerTunnelVision)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 shadow-soft-sm transition-all active:scale-95"
              title="Inject Option 121 route push and Gateway MAC shift (Rules R7, R9)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
              <span>TunnelVision (R7/R9)</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={() => handleAction('Session Reset: all events and metrics cleared', onReset)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 shadow-soft-sm transition-all active:scale-95"
            title="Reset in-memory session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          {/* Seed Demo */}
          <button
            onClick={() => handleAction('Demo dataset loaded', onSeedDemo)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 shadow-soft-sm transition-all active:scale-95"
            title="Reload reference demo dataset"
          >
            <Play className="w-3.5 h-3.5 text-brand-600" />
            <span>Seed Demo</span>
          </button>
        </div>
      </div>

      {/* Live feedback banner */}
      {activeFeedback && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-950/40 px-3 py-1.5 rounded-lg border border-brand-200/60 dark:border-brand-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span>{activeFeedback}</span>
        </div>
      )}
    </div>
  );
};
