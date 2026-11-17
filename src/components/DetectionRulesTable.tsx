import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Network, Route, Cpu, Zap, Activity } from 'lucide-react';
import { DETECTION_RULES, DetectionRuleDef } from '../detector';

interface DetectionRulesTableProps {
  ruleStats?: Record<string, number>;
  onSelectRuleFilter?: (ruleCode: string) => void;
}

export const DetectionRulesTable: React.FC<DetectionRulesTableProps> = ({
  ruleStats = {},
  onSelectRuleFilter
}) => {
  const getRuleIcon = (code: string) => {
    switch (code) {
      case 'R1':
        return ShieldAlert;
      case 'R2':
        return Activity;
      case 'R3':
      case 'R4':
      case 'R5':
      case 'R6':
        return CheckCircle2;
      case 'R7':
        return Route;
      case 'R8':
        return Zap;
      case 'R9':
        return Network;
      default:
        return ShieldCheck;
    }
  };

  const getSeverityPill = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Detection Rules Reference (R1 – R9)
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 uppercase tracking-wider">
              9 Active Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard threat detection matrix for unseparated merchant POS LAN networks (Scenario C1).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Detector Engine Active
          </span>
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3.5 text-center w-14">Rule</th>
              <th className="py-3 px-3">Rule Name</th>
              <th className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">What It Checks</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-center">Severity</th>
              <th className="py-3 px-3 text-center">Trigger Count</th>
              <th className="py-3 px-3 text-center">Engine Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {DETECTION_RULES.map((rule) => {
              const Icon = getRuleIcon(rule.code);
              const count = ruleStats[rule.code] || 0;
              return (
                <tr
                  key={rule.code}
                  onClick={() => onSelectRuleFilter && onSelectRuleFilter(rule.code)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3.5 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md font-mono font-extrabold text-xs bg-brand-600 text-white shadow-soft-sm">
                      {rule.code}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {rule.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{rule.checks}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{rule.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {rule.category}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityPill(rule.severity)}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded-lg text-xs ${count > 0 ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
