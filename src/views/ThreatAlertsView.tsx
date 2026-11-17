import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  FileDown,
  Layers
} from 'lucide-react';
import { DhcpAlert } from '../types';
import { DetectionRulesTable } from '../components/DetectionRulesTable';

interface ThreatAlertsViewProps {
  alerts: DhcpAlert[];
  onUpdateAlertStatus: (alertId: string, status: 'new' | 'investigating' | 'resolved') => void;
  selectedAlert: DhcpAlert | null;
  onSelectAlert: (alert: DhcpAlert | null) => void;
  ruleStats?: Record<string, number>;
}

export const ThreatAlertsView: React.FC<ThreatAlertsViewProps> = ({
  alerts,
  onUpdateAlertStatus,
  selectedAlert,
  onSelectAlert,
  ruleStats = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [ruleFilter, setRuleFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'related' | 'timeline'>('overview');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Counts for top cards (matching Image 4)
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const mediumCount = alerts.filter((a) => a.severity === 'medium').length;
  const lowCount = alerts.filter((a) => a.severity === 'low').length;
  const totalCount = alerts.length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
      if (severityFilter !== 'All' && a.severity !== severityFilter.toLowerCase()) return false;
      if (ruleFilter !== 'All') {
        const matchesCode = a.rule_code === ruleFilter;
        const matchesRule = a.rule.toLowerCase().includes(ruleFilter.toLowerCase());
        if (!matchesCode && !matchesRule) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = a.id.toLowerCase().includes(q);
        const matchesMsg = a.message.toLowerCase().includes(q);
        const matchesServer = (a.suspected_server || '').toLowerCase().includes(q);
        const matchesDevice = (a.affected_device || '').toLowerCase().includes(q);
        const matchesRule = a.rule.toLowerCase().includes(q);
        if (!matchesId && !matchesMsg && !matchesServer && !matchesDevice && !matchesRule) {
          return false;
        }
      }
      return true;
    });
  }, [alerts, searchQuery, statusFilter, severityFilter, ruleFilter]);

  const totalPages = Math.ceil(filteredAlerts.length / pageSize) || 1;
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeAlert = selectedAlert || (filteredAlerts.length > 0 ? filteredAlerts[0] : null);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedAlerts.map((a) => a.id));
    }
  };

  const toggleSelectId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSeverityFilter('All');
    setRuleFilter('All');
    setCurrentPage(1);
  };

  const exportAlertsCsv = () => {
    const headers = ['Alert ID', 'Timestamp', 'Rule', 'Severity', 'Status', 'Suspected Server', 'Affected Device'];
    const rows = filteredAlerts.map((a) => [
      a.id,
      a.created_at,
      `"${a.rule}"`,
      a.severity,
      a.status,
      a.suspected_server || '',
      a.affected_device || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `threat_alerts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Threat Alerts
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/80">
              {totalCount} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and manage security alerts detected in the simulated POS network environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAlertsCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-soft-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-soft-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last 24 hours</span>
          </div>
        </div>
      </div>

      {/* 5 Stat Cards matching Image 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Critical Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Critical</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{criticalCount}</span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.5 rounded">↑ 100%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">vs. previous 24h</p>
        </div>

        {/* High Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">High</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{highCount}</span>
            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-300 px-1.5 py-0.5 rounded">↑ 100%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">vs. previous 24h</p>
        </div>

        {/* Medium Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Medium</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{mediumCount}</span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.5 rounded">↑ 50%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">vs. previous 24h</p>
        </div>

        {/* Low Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Low</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{lowCount}</span>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-1.5 py-0.5 rounded">→ 0%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">vs. previous 24h</p>
        </div>

        {/* Total Alerts Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300 px-1.5 py-0.5 rounded">↑ 75%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">vs. previous 24h</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-soft flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by alert ID, device, server IP or rule..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Rule:</span>
          <select
            value={ruleFilter}
            onChange={(e) => setRuleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Rules (R1–R9)</option>
            <option value="R1">R1: Untrusted Server</option>
            <option value="R2">R2: Server Contention</option>
            <option value="R3">R3: Wrong Gateway</option>
            <option value="R4">R4: Wrong DNS Resolver</option>
            <option value="R5">R5: Wrong Subnet Mask</option>
            <option value="R6">R6: Abnormal Lease Time</option>
            <option value="R7">R7: Option 121 (TunnelVision)</option>
            <option value="R8">R8: Sudden Request Flood</option>
            <option value="R9">R9: Gateway MAC Divergence</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Main Split: Threat Alerts List (Left) + Alert Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Threat Alerts List
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {filteredAlerts.length} detections logged
              </span>
            </div>

            <div className="table-scroll-container">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedAlerts.length && paginatedAlerts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Alert ID</th>
                    <th className="py-2.5 px-3">Suspected Server</th>
                    <th className="py-2.5 px-3">Affected Device</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Triggered Rule</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {paginatedAlerts.map((alt) => {
                    const isSelected = activeAlert?.id === alt.id;
                    const isChecked = selectedIds.includes(alt.id);
                    return (
                      <tr
                        key={alt.id}
                        onClick={() => onSelectAlert(alt)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-brand-50/80 dark:bg-brand-950/60'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                        }`}
                      >
                        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectId(alt.id)}
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono">
                          {alt.created_at.slice(0, 19).replace('T', ' ')}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                          {alt.id}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-semibold text-rose-600">
                          {alt.suspected_server}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300 font-sans">
                          {alt.affected_device}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              alt.severity === 'critical'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                : alt.severity === 'high'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
                                : alt.severity === 'medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              alt.status === 'resolved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : alt.status === 'investigating'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                            }`}
                          >
                            {alt.status === 'investigating' ? 'Investigating' : alt.status === 'resolved' ? 'Resolved' : 'New'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md font-mono font-extrabold text-[10px] bg-brand-600 text-white shadow-soft-sm">
                              {alt.rule_code || (alt.rule.includes('burst') ? 'R8' : 'R1')}
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {alt.rule.split(':')[1]?.split('(')[0]?.trim() || alt.rule}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-sans">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAlert(alt);
                              }}
                              className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
                            >
                              View
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-600">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAlerts.length)} -{' '}
              {Math.min(currentPage * pageSize, filteredAlerts.length)} of {filteredAlerts.length} alerts
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs ${
                    currentPage === idx + 1
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Panel matching Image 4 (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between">
          {activeAlert ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950 dark:text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {activeAlert.message}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {activeAlert.id} • {activeAlert.created_at.slice(0, 19).replace('T', ' ')}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    activeAlert.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                      : activeAlert.severity === 'high'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800'
                      : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                  }`}
                >
                  {activeAlert.severity}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-xs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'evidence'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Evidence
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'related'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Related Events
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Timeline
                </button>
              </div>

              {/* Tab Content: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-y-2 text-xs py-1">
                    <span className="text-slate-400">Suspected DHCP Server:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-rose-600 dark:text-rose-400">{activeAlert.suspected_server}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                        ! Not in allowlist
                      </span>
                    </div>

                    <span className="text-slate-400">Affected Device:</span>
                    <span className="font-sans font-medium text-slate-800 dark:text-slate-200">
                      {activeAlert.affected_device}
                    </span>

                    <span className="text-slate-400">Triggered Rule:</span>
                    <div className="flex items-center gap-2 font-mono font-bold text-brand-600 dark:text-brand-400">
                      <span className="px-2 py-0.5 rounded-md text-xs bg-brand-600 text-white font-mono font-extrabold shadow-soft-sm">
                        {activeAlert.rule_code || 'R1'}
                      </span>
                      <span className="text-xs text-slate-800 dark:text-slate-200">{activeAlert.rule}</span>
                    </div>

                    <span className="text-slate-400">Severity:</span>
                    <span className="font-bold uppercase text-rose-600 dark:text-rose-400">{activeAlert.severity}</span>

                    <span className="text-slate-400">Investigation Status:</span>
                    <span
                      className={`font-semibold capitalize px-2 py-0.5 rounded-full inline-block text-[10px] w-fit ${
                        activeAlert.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : activeAlert.status === 'investigating'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {activeAlert.status}
                    </span>
                  </div>

                  {/* Observed vs Expected Configuration Table (matching Image 3 & 4) */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-2">
                      DHCP Configuration (Observed vs Expected)
                    </p>
                    <table className="w-full text-[11px] font-mono">
                      <thead>
                        <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-200 dark:border-slate-700 pb-1">
                          <th className="text-left font-semibold pb-1">Setting</th>
                          <th className="text-left font-semibold pb-1">Expected</th>
                          <th className="text-right font-semibold pb-1">Observed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        <tr>
                          <td className="py-1 text-slate-500 dark:text-slate-400">DHCP Server</td>
                          <td className="py-1 text-emerald-600 dark:text-emerald-400 font-bold">192.0.2.10</td>
                          <td className="py-1 text-right text-rose-600 dark:text-rose-400 font-bold">{activeAlert.suspected_server}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-500 dark:text-slate-400">Gateway</td>
                          <td className="py-1 text-emerald-600 dark:text-emerald-400 font-bold">192.0.2.1</td>
                          <td className="py-1 text-right text-rose-600 dark:text-rose-400 font-bold">10.10.10.1</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-slate-500 dark:text-slate-400">DNS Server</td>
                          <td className="py-1 text-emerald-600 dark:text-emerald-400 font-bold">8.8.8.8</td>
                          <td className="py-1 text-right text-rose-600 dark:text-rose-400 font-bold">1.1.1.1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Evidence Bullets */}
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Evidence:</p>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                      <li>Server identifier {activeAlert.suspected_server} not in configured allowlist</li>
                      <li>Offered gateway 10.10.10.1 does not match expected 192.0.2.1</li>
                      <li>DNS server 1.1.1.1 does not match expected 8.8.8.8</li>
                      <li>Transaction ID: {activeAlert.xid || '0x3a71'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Evidence */}
              {activeTab === 'evidence' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Rule Trigger Match Rationale:</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Detector verified packet Option 54 (Server Identifier) against baseline allowlist. 
                    Target IP diverged from trusted anchor, triggering immediate severity escalation to protect POS transaction traffic from unauthenticated rogue gateway diversion.
                  </p>
                </div>
              )}

              {/* Tab 3: Related Events */}
              {activeTab === 'related' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 dark:text-slate-400">{activeAlert.created_at.slice(0, 19)}</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">DHCP Offer</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{activeAlert.id}</span>
                  </div>
                </div>
              )}

              {/* Tab 4: Timeline */}
              {activeTab === 'timeline' && (
                <div className="p-3 text-xs space-y-2">
                  <div className="flex gap-2">
                    <div className="w-1.5 bg-rose-500 rounded-full" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Alert Created</p>
                      <p className="text-[10px] text-slate-400">{activeAlert.created_at.slice(0, 19)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons matching Image 4 */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <select
                    value={activeAlert.status}
                    onChange={(e) => onUpdateAlertStatus(activeAlert.id, e.target.value as any)}
                    className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {activeAlert.status !== 'investigating' && (
                    <button
                      onClick={() => onUpdateAlertStatus(activeAlert.id, 'investigating')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                    >
                      Mark Investigating
                    </button>
                  )}
                  {activeAlert.status !== 'resolved' ? (
                    <button
                      onClick={() => onUpdateAlertStatus(activeAlert.id, 'resolved')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an alert from the table to view investigation details.
            </div>
          )}
        </div>
      </div>

      {/* Detection Rules Matrix Reference (R1 - R9) */}
      <DetectionRulesTable ruleStats={ruleStats} onSelectRuleFilter={setRuleFilter} />
    </div>
  );
};
