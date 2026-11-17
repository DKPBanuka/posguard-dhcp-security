import React from 'react';
import {
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { DhcpEvent, DhcpAlert } from '../types';
import { StatCard } from '../components/StatCard';
import { TrafficChart } from '../components/TrafficChart';
import { SeverityDonut } from '../components/SeverityDonut';
import { NetworkLabDiagram } from '../components/NetworkLabDiagram';

interface OverviewViewProps {
  events: DhcpEvent[];
  alerts: DhcpAlert[];
  trustedServer: string;
  onSelectEvent: (event: DhcpEvent) => void;
  onSelectAlert: (alert: DhcpAlert) => void;
  onNavigate: (route: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  events,
  alerts,
  trustedServer,
  onSelectEvent,
  onSelectAlert,
  onNavigate,
}) => {
  const normalEventsCount = events.filter((e) => e.label === 'normal').length;
  const attackEventsCount = events.filter((e) => e.label === 'attack').length;
  const suspiciousCount = events.filter((e) => e.flagged).length;

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const highAlerts = alerts.filter((a) => a.severity === 'high').length;
  const mediumAlerts = alerts.filter((a) => a.severity === 'medium').length;
  const lowAlerts = alerts.filter((a) => a.severity === 'low').length;

  // Latest 6 events
  const latestEvents = [...events].reverse().slice(0, 6);
  // Latest 5 alerts
  const recentAlerts = [...alerts].reverse().slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Overview Dashboard
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              Lab V1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor network activity, DHCP events and security alerts from the simulated POS environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-soft-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Timeframe: Last 24 hours</span>
          </div>
        </div>
      </div>

      {/* Mandatory Simulation Context Banner from PDF spec */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/50 flex items-start gap-3 text-xs shadow-soft-sm">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-300">
            Research Context & Simulation Note
          </p>
          <p className="text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
            Scenario C1: a standalone POS terminal on a shared, unseparated merchant LAN or Wi-Fi, with an attacker on the merchant side.
            Candidate V2 (rogue DHCP server, unauthenticated network configuration) was selected as the research detection-phase target due to high detectability (D=5) and feasibility (F=4). 
            <span className="font-bold underline ml-1">Notice:</span> V2 is the highest-priority research target, not the highest-risk threat. All data is simulated in an isolated lab environment; no real payment cards, customer data, or live merchant networks are used.
          </p>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Events"
          value={events.length}
          trend="+12%"
          trendDirection="up"
          subtitle="vs. previous 24h"
          icon={Activity}
          colorScheme="blue"
        />
        <StatCard
          title="DHCP Events"
          value={events.length}
          trend="+18%"
          trendDirection="up"
          subtitle="DORA exchanges"
          icon={Layers}
          colorScheme="indigo"
        />
        <StatCard
          title="Normal Events"
          value={normalEventsCount}
          trend="+8%"
          trendDirection="up"
          subtitle="Authorized leases"
          icon={ShieldCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Suspicious Events"
          value={suspiciousCount}
          trend={suspiciousCount > 0 ? "+50%" : "0%"}
          trendDirection={suspiciousCount > 0 ? "down" : "neutral"}
          subtitle="Flagged by rules"
          icon={AlertTriangle}
          colorScheme="rose"
        />
        <StatCard
          title="Unclassified"
          value={Math.max(0, attackEventsCount - suspiciousCount)}
          trend="-33%"
          trendDirection="down"
          subtitle="Pending evaluation"
          icon={HelpCircle}
          colorScheme="slate"
        />
      </div>

      {/* Middle Row: Network Traffic Chart + Donut + Lab Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div className="lg:col-span-1">
          <SeverityDonut
            criticalCount={criticalAlerts}
            highCount={highAlerts}
            mediumCount={mediumAlerts}
            lowCount={lowAlerts}
          />
        </div>
      </div>

      {/* Lab Simulation Status */}
      <NetworkLabDiagram
        hasAlerts={alerts.length > 0}
        trustedServer={trustedServer}
      />

      {/* Active Rules Matrix Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Detection Matrix (R1 – R9)</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                9 Rules Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              R1 (Untrusted Server) • R2 (Contention) • R3–R6 (Gateway/DNS/Subnet/Lease) • R7 (TunnelVision) • R8 (Flood) • R9 (Gateway MAC)
            </p>
          </div>
        </div>
        <a
          href="#alerts"
          onClick={() => onNavigate('alerts')}
          className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900/60 dark:text-brand-300 text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>View Rules Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Bottom Row: Latest DHCP Events Table & Recent Detections List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Latest Events Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Latest DHCP Events
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Real-time packet captures from the simulated POS network
              </p>
            </div>
            <a
              href="#monitor"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="table-scroll-container">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Client MAC</th>
                  <th className="py-2.5 px-3">Server IP</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                {latestEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {evt.timestampStr || `t=${evt.t.toFixed(1)}s`}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          evt.type === 'OFFER'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                            : evt.type === 'DISCOVER'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                            : evt.type === 'REQUEST'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {evt.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {evt.mac}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium">
                      <span
                        className={
                          evt.server_id !== '-' && evt.server_id !== trustedServer
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }
                      >
                        {evt.server_id}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          evt.flagged || evt.label === 'attack'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300'
                        }`}
                      >
                        {evt.flagged ? 'Suspicious' : 'Normal'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap font-sans">
                      <button
                        onClick={() => {
                          onSelectEvent(evt);
                          onNavigate('monitor');
                        }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400 underline decoration-brand-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Detections List (1 Col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Recent Detections
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Security rules fired by detector
                </p>
              </div>
              <a
                href="#alerts"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2.5">
              {recentAlerts.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active detections in session. Run a rogue offer or starvation burst.
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      onSelectAlert(alert);
                      onNavigate('alerts');
                    }}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : alert.severity === 'high'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 transition-colors">
                          {alert.message}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          {alert.created_at.slice(0, 19).replace('T', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                            : alert.severity === 'high'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Detector: Pure Function (Rule 1 & 2)</span>
            <span className="font-semibold text-emerald-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
