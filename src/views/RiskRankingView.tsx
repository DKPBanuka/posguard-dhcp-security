import React, { useState } from 'react';
import { CandidateVulnerability } from '../types';
import candidatesData from '../data/candidates.json';
import { AlertCircle, CheckCircle2, XCircle, Info, X, ExternalLink, ShieldCheck } from 'lucide-react';

export const RiskRankingView: React.FC = () => {
  const candidates = candidatesData as CandidateVulnerability[];
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateVulnerability | null>(null);

  const getGateBadge = (gate: string) => {
    switch (gate) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            pass
          </span>
        );
      case 'fragile pass':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            fragile pass
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            fail
          </span>
        );
      default:
        return null;
    }
  };

  const getGradePill = (grade: 'A' | 'B' | 'C') => {
    const colors = {
      A: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
      B: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      C: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
    };
    return (
      <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border ${colors[grade]}`}>
        {grade}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Risk Ranking (Table 6.1)
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            11 Candidate Vulnerabilities
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Proposed scores from Table 6.1 (single assessor, evidence grades B and C, nothing measured). Explain why V2 was chosen.
        </p>
      </div>

      {/* Required Note Banner from Section 4, Page 4 */}
      <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 dark:bg-brand-950/20 dark:border-brand-900/60 flex items-start gap-3 text-xs shadow-soft-sm">
        <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-brand-900 dark:text-brand-300">
            Selection Rationale & Inconclusive Ranking Notice
          </p>
          <p className="text-brand-800/90 dark:text-brand-300/90 leading-relaxed">
            The ranking is inconclusive: all eleven risk ranges share one band (6.9 to 13.4) and no candidate passed the 80% robustness test.
            <strong className="mx-1 text-brand-950 dark:text-white">V2 (highlighted below)</strong>
            was chosen by suitability for detection, with detectability <span className="font-mono font-bold">D = 5</span> and feasibility <span className="font-mono font-bold">F = 4</span>, and it ranks sixth on risk.
            <span className="italic ml-1">V2 is the highest-priority research target, not the highest-risk threat.</span>
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Vulnerability Scoring & Gate G2 Assessment
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              R = sqrt(E × S) × I | Gate G2: D ≥ 3 and F ≥ 3
            </p>
          </div>
          <span className="text-xs text-slate-400">Click any row to inspect Appendix A rationale</span>
        </div>

        <div className="table-scroll-container">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 text-center">#</th>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-4">Candidate Vulnerability</th>
                <th className="py-3 px-2 text-center" title="Exploitability">E</th>
                <th className="py-3 px-2 text-center" title="Scope / Severity">S</th>
                <th className="py-3 px-2 text-center" title="Impact">I</th>
                <th className="py-3 px-3 text-right" title="Risk Score">R</th>
                <th className="py-3 px-4 min-w-[140px]">Risk Score Bar (0 - 25)</th>
                <th className="py-3 px-2 text-center" title="Detectability">D</th>
                <th className="py-3 px-2 text-center" title="Feasibility">F</th>
                <th className="py-3 px-4 text-center">Gate G2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {candidates.map((c) => {
                const isTarget = c.id === 'V2';
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`cursor-pointer transition-colors ${
                      isTarget
                        ? 'bg-brand-50/70 dark:bg-brand-950/40 hover:bg-brand-100/70 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {c.rank}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs ${
                          isTarget
                            ? 'bg-brand-600 text-white shadow-soft-sm'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {c.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={isTarget ? 'text-brand-900 dark:text-brand-200 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                          {c.name}
                        </span>
                        {isTarget && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-brand-200 text-brand-900 dark:bg-brand-900 dark:text-brand-200 rounded-full">
                            Research Target
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono">{c.E}</td>
                    <td className="py-3 px-2 text-center font-mono">{c.S}</td>
                    <td className="py-3 px-2 text-center font-mono">{c.I}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                      {c.R.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {/* Bar of R (scale 0 to 25) */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTarget
                              ? 'bg-gradient-to-r from-brand-600 to-sky-500 shadow-sm'
                              : 'bg-slate-400 dark:bg-slate-600'
                          }`}
                          style={{ width: `${(c.R / 25) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      <span className={c.D >= 4 ? 'text-emerald-600 font-extrabold' : ''}>{c.D}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      <span className={c.F >= 4 ? 'text-emerald-600 font-extrabold' : ''}>{c.F}</span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {getGateBadge(c.gate_g2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal / Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-mono font-extrabold text-base border border-brand-200 dark:border-brand-800">
                {selectedCandidate.id}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedCandidate.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Rank #{selectedCandidate.rank} • Gate G2: {selectedCandidate.gate_g2}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                Appendix A Assessment Rationale:
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedCandidate.reason}
              </p>
            </div>

            {/* Evidence Grades Breakdown (E, S, I, D, F) */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Evidence Grade per Score (Appendix A):
              </p>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">E</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                    {selectedCandidate.E}
                  </span>
                  <div className="mt-1">{getGradePill(selectedCandidate.evidence_grades.E)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">S</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                    {selectedCandidate.S}
                  </span>
                  <div className="mt-1">{getGradePill(selectedCandidate.evidence_grades.S)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">I</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                    {selectedCandidate.I}
                  </span>
                  <div className="mt-1">{getGradePill(selectedCandidate.evidence_grades.I)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">D</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                    {selectedCandidate.D}
                  </span>
                  <div className="mt-1">{getGradePill(selectedCandidate.evidence_grades.D)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">F</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                    {selectedCandidate.F}
                  </span>
                  <div className="mt-1">{getGradePill(selectedCandidate.evidence_grades.F)}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
