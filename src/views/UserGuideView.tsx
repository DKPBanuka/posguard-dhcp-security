import React from 'react';
import {
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Radio,
  Server,
  Layers,
  Network
} from 'lucide-react';

interface UserGuideViewProps {
  onTriggerReset: () => void;
  onTriggerNormalLease: () => void;
  onTriggerRenewal: () => void;
  onTriggerRogueOffer: () => void;
  onTriggerStarvationBurst: () => void;
  onNavigate: (route: any) => void;
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  onTriggerReset,
  onTriggerNormalLease,
  onTriggerRenewal,
  onTriggerRogueOffer,
  onTriggerStarvationBurst,
  onNavigate,
}) => {
  const guidePages = [
    {
      step: '1',
      title: 'Overview Dashboard',
      description:
        'Displays high-level network activity counters (events captured, alerts raised, precision, recall) and establishes the research scope for Scenario C1 (unseparated merchant POS LAN).',
      linkText: 'Open Overview',
      route: 'overview',
    },
    {
      step: '2',
      title: 'Risk Ranking (Table 6.1)',
      description:
        'Explains why Candidate V2 (rogue DHCP server) was selected as the research target based on feasibility (F=4) and detectability (D=5), even though it ranks sixth on risk.',
      linkText: 'Inspect Table 6.1',
      route: 'scoring',
    },
    {
      step: '3',
      title: 'Live DHCP Monitor',
      description:
        'Configure the trusted DHCP server address and inject test traffic. Watch incoming packets in real-time and inspect packet dissections in the right-hand drawer.',
      linkText: 'Open Live Monitor',
      route: 'monitor',
    },
    {
      step: '4',
      title: 'Threat Alerts Investigation',
      description:
        'Examine security rules fired by the detector. Triage incidents, examine observed vs. expected DHCP options, change status to Investigating, and mark Resolved.',
      linkText: 'Review Alerts',
      route: 'alerts',
    },
    {
      step: '5',
      title: 'Detector Evaluation & Metrics',
      description:
        'Computes precision, recall, F1 score and breaks down the confusion matrix (TP, FN, FP, TN) using session ground-truth labels.',
      linkText: 'View Evaluation',
      route: 'eval',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Guide & Research Walkthrough
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Page 6
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed documentation of each view, suggested reproduction walkthrough, and physical lab setup.
        </p>
      </div>

      {/* Suggested Interactive Walkthrough Banner matching Figure 6 */}
      <div className="bg-gradient-to-br from-brand-50 to-sky-50 dark:from-brand-950/40 dark:to-sky-950/20 border border-brand-200/80 dark:border-brand-800/60 rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
            Suggested Interactive Walkthrough
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          Follow these sequential actions to replicate the experimental session shown in the research paper:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-900 shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-600 block mb-1">
                STEP 01
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Reset Session</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Clear all events and return counters to 0</p>
            </div>
            <button
              onClick={onTriggerReset}
              className="mt-3 w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-900 shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-600 block mb-1">
                STEP 02
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Normal Baseline</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Inject normal leases & renewal</p>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={onTriggerNormalLease}
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 text-[11px] font-bold transition-colors"
              >
                + Lease
              </button>
              <button
                onClick={onTriggerRenewal}
                className="flex-1 py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 dark:text-sky-300 text-[11px] font-bold transition-colors"
              >
                + Renew
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-900 shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-600 block mb-1">
                STEP 03
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Inject Rogue Offer</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Test Rule 1 (unauthorized server)</p>
            </div>
            <button
              onClick={onTriggerRogueOffer}
              className="mt-3 w-full py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Rogue Offer</span>
            </button>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-900 shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-600 block mb-1">
                STEP 04
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Starvation Burst</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Test Rule 2 (≥15 DISCOVERs/5s)</p>
            </div>
            <button
              onClick={onTriggerStarvationBurst}
              className="mt-3 w-full py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Flame className="w-3 h-3" />
              <span>Burst Attack</span>
            </button>
          </div>

          {/* Step 5 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-brand-100 dark:border-brand-900 shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-600 block mb-1">
                STEP 05
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Inspect Results</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Observe alerts and confusion matrix</p>
            </div>
            <button
              onClick={() => onNavigate('eval')}
              className="mt-3 w-full py-1.5 px-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>View Metrics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Explanations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidePages.map((p) => (
          <div
            key={p.step}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                  {p.step}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate(p.route)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>{p.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Setup Architecture Card (Check B of Table 6.6) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Physical Lab Setup Architecture (Check B of Table 6.6)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The research framework is designed to run in an isolated hardware testbed representing merchant scenario C1:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-brand-600 block mb-1">1. Merchant Router</span>
            <p className="text-slate-500 text-[11px]">
              Acts as the legitimate DHCP server (192.0.2.10) and default gateway (192.0.2.1).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-brand-600 block mb-1">2. POS Terminal</span>
            <p className="text-slate-500 text-[11px]">
              Dedicated terminal running unauthenticated DHCP client, acquiring IP lease over Ethernet.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-rose-600 block mb-1">3. Attacker Node</span>
            <p className="text-slate-500 text-[11px]">
              Adversary connected to the shared unseparated merchant switch, injecting rogue DHCP OFFERs.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-emerald-600 block mb-1">4. POSGuard Monitor</span>
            <p className="text-slate-500 text-[11px]">
              Lightweight detector capturing broadcast traffic via switch SPAN / mirror port or directly on POS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
