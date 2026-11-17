import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ListTree,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { DhcpEvent, DhcpMessageType } from '../types';

interface DhcpMonitorViewProps {
  events: DhcpEvent[];
  trustedServer: string;
  selectedEvent: DhcpEvent | null;
  onSelectEvent: (event: DhcpEvent | null) => void;
}

export const DhcpMonitorView: React.FC<DhcpMonitorViewProps> = ({
  events,
  trustedServer,
  selectedEvent,
  onSelectEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [deviceFilter, setDeviceFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'related'>('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Counts for cards
  const discoverCount = events.filter((e) => e.type === 'DISCOVER').length;
  const offerCount = events.filter((e) => e.type === 'OFFER').length;
  const requestCount = events.filter((e) => e.type === 'REQUEST').length;
  const ackCount = events.filter((e) => e.type === 'ACK').length;
  const suspiciousCount = events.filter((e) => e.flagged || e.label === 'attack').length;

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (typeFilter !== 'All' && e.type !== typeFilter) return false;
      if (classFilter === 'Normal' && (e.flagged || e.label === 'attack')) return false;
      if (classFilter === 'Suspicious' && !e.flagged && e.label !== 'attack') return false;
      if (deviceFilter !== 'All' && e.device !== deviceFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMac = e.mac.toLowerCase().includes(q);
        const matchesServer = e.server_id.toLowerCase().includes(q);
        const matchesXid = e.xid.toLowerCase().includes(q);
        const matchesIp = (e.offered_ip || '').toLowerCase().includes(q);
        const matchesType = e.type.toLowerCase().includes(q);
        if (!matchesMac && !matchesServer && !matchesXid && !matchesIp && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }, [events, searchQuery, typeFilter, classFilter, deviceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setClassFilter('All');
    setDeviceFilter('All');
    setCurrentPage(1);
  };

  const activeEvent = selectedEvent || (filteredEvents.length > 0 ? filteredEvents[0] : null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              DHCP Monitor
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Live Inspection
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor and analyse DHCP network events from the simulated POS environment.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Trusted Server: <span className="font-bold text-brand-600">{trustedServer}</span>
        </div>
      </div>

      {/* Top 5 Stat Cards matching Screenshot 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">DHCP Discover</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{discoverCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">↑ 12%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">DHCP Offer</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{offerCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">↑ 8%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">DHCP Request</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{requestCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">↑ 5%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">DHCP ACK</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{ackCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">↑ 3%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/60 rounded-2xl p-4 shadow-soft">
          <p className="text-[11px] font-semibold text-rose-500 uppercase">Suspicious Events</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{suspiciousCount}</span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">↑ 40%</span>
          </div>
        </div>
      </div>

      {/* Filter Bar matching Screenshot 2 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-soft flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by MAC, IP, server or transaction ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Message Type dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="DISCOVER">DISCOVER</option>
            <option value="OFFER">OFFER</option>
            <option value="REQUEST">REQUEST</option>
            <option value="ACK">ACK</option>
          </select>
        </div>

        {/* Classification dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Classification:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Normal">Normal</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>

        {/* Device dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Device:</span>
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Devices</option>
            <option value="POS-Terminal-01">POS-Terminal-01</option>
            <option value="POS-Terminal-02">POS-Terminal-02</option>
            <option value="POS-Terminal-03">POS-Terminal-03</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Main Split Content: Events Table (Left) + Details Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Table (7 Cols on desktop) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">DHCP Events</h3>
              <span className="text-xs text-slate-400 font-mono">
                {filteredEvents.length} events logged
              </span>
            </div>

            <div className="table-scroll-container">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Message Type</th>
                    <th className="py-2.5 px-3">Client MAC</th>
                    <th className="py-2.5 px-3">Server</th>
                    <th className="py-2.5 px-3">Offered IP</th>
                    <th className="py-2.5 px-3">Gateway</th>
                    <th className="py-2.5 px-3">DNS</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {paginatedEvents.map((evt) => {
                    const isSelected = activeEvent?.id === evt.id;
                    const isRogue = evt.flagged || (evt.server_id !== '-' && evt.server_id !== trustedServer);
                    return (
                      <tr
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-brand-50/80 dark:bg-brand-950/60'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                        }`}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {evt.timestampStr?.slice(11) || `t=${evt.t.toFixed(1)}s`}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              evt.type === 'OFFER'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                                : evt.type === 'DISCOVER'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                : evt.type === 'REQUEST'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {evt.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {evt.mac}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium">
                          <span className={isRogue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                            {evt.server_id}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {evt.offered_ip || '-'}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {evt.offered_gateway || '-'}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {evt.offered_dns || '-'}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isRogue
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            }`}
                          >
                            {isRogue ? 'Suspicious' : 'Normal'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-sans">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(evt);
                            }}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 underline decoration-brand-300"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredEvents.length)} -{' '}
              {Math.min(currentPage * pageSize, filteredEvents.length)} of {filteredEvents.length} events
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
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
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

        {/* Right Details Panel (5 Cols on desktop - matching Screenshot 2) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft flex flex-col justify-between">
          {activeEvent ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      activeEvent.flagged || activeEvent.server_id !== trustedServer
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {activeEvent.flagged || activeEvent.server_id !== trustedServer
                        ? `Suspicious DHCP ${activeEvent.type}`
                        : `Authorized DHCP ${activeEvent.type}`}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {activeEvent.timestampStr || `t=${activeEvent.t.toFixed(1)}s`} • Event ID: {activeEvent.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    activeEvent.flagged || activeEvent.server_id !== trustedServer
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {activeEvent.flagged || activeEvent.server_id !== trustedServer ? 'Suspicious' : 'Normal'}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200/80 dark:border-slate-800 pb-1 text-xs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'raw'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Raw Packet
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'related'
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Related Events
                </button>
              </div>

              {/* Tab 1: Overview matching Screenshot 2 */}
              {activeTab === 'overview' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs py-1">
                    <span className="text-slate-400">Message Type:</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                      {activeEvent.type}
                    </span>

                    <span className="text-slate-400">Client MAC:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {activeEvent.mac}
                    </span>

                    <span className="text-slate-400">Server Identifier:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {activeEvent.server_id}
                      </span>
                      {activeEvent.server_id !== '-' && activeEvent.server_id !== trustedServer && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                          ! Not in allowlist
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400">Offered IP:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {activeEvent.offered_ip || '-'}
                    </span>

                    <span className="text-slate-400">Gateway:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span>{activeEvent.offered_gateway || '-'}</span>
                      {activeEvent.offered_gateway && activeEvent.offered_gateway !== '192.0.2.1' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                          ⚠ Unexpected gateway
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400">DNS Servers:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span>{activeEvent.offered_dns || '-'}</span>
                      {activeEvent.offered_dns && activeEvent.offered_dns !== '8.8.8.8' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                          ⚠ Unexpected DNS
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {activeEvent.xid}
                    </span>

                    <span className="text-slate-400">Rule Triggered:</span>
                    <span className="font-mono font-bold text-brand-600">
                      {activeEvent.rule || 'None (Normal Lease Flow)'}
                    </span>

                    <span className="text-slate-400">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono">0.87</span>
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-600 h-full rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Interception Evidence:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      {activeEvent.server_id !== '-' && activeEvent.server_id !== trustedServer ? (
                        <>
                          <li>Server identifier {activeEvent.server_id} not in configured allowlist</li>
                          <li>Offered gateway does not match expected default gateway (192.0.2.1)</li>
                          <li>DNS server divergent from baseline resolver (8.8.8.8)</li>
                        </>
                      ) : activeEvent.rule?.includes('burst') ? (
                        <>
                          <li>Rapid DISCOVER packet flood exceeds 15 packets / 5s threshold</li>
                          <li>MAC spoofing detected across sequential transactions</li>
                        </>
                      ) : (
                        <>
                          <li>Packet headers and options comply with RFC 2131 baseline</li>
                          <li>Originating server matches authorized DHCP anchor</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Raw Packet */}
              {activeTab === 'raw' && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] space-y-2 overflow-x-auto max-h-64">
                  <p className="text-slate-400">// Ethernet II + IP + UDP (Ports 67 to 68)</p>
                  <p>OP: 2 (BOOTREPLY) | HTYPE: 1 (Ethernet) | HLEN: 6 | HOPS: 0</p>
                  <p>XID: {activeEvent.xid} | SECS: 0 | FLAGS: 0x0000</p>
                  <p>CIADDR: 0.0.0.0 | YIADDR: {activeEvent.offered_ip || '192.0.2.100'}</p>
                  <p>SIADDR: {activeEvent.server_id} | GIADDR: 0.0.0.0</p>
                  <p>CHADDR: {activeEvent.mac}</p>
                  <p className="text-amber-400 mt-2">// DHCP Options:</p>
                  <p>Option 53 (DHCP Message Type): {activeEvent.type}</p>
                  <p>Option 54 (Server Identifier): {activeEvent.server_id}</p>
                  <p>Option 1 (Subnet Mask): 255.255.255.0</p>
                  <p>Option 3 (Router): {activeEvent.offered_gateway || '192.0.2.1'}</p>
                  <p>Option 6 (DNS Servers): {activeEvent.offered_dns || '8.8.8.8'}</p>
                </div>
              )}

              {/* Tab 3: Related Events */}
              {activeTab === 'related' && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-400 text-[11px]">Events sharing XID {activeEvent.xid} or MAC:</p>
                  {events
                    .filter((e) => e.xid === activeEvent.xid && e.id !== activeEvent.id)
                    .map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectEvent(rel)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-bold text-brand-600">{rel.type}</span>
                        <span className="font-mono text-slate-500">{rel.server_id}</span>
                        <span className="text-[10px] text-slate-400">{rel.timestampStr?.slice(11)}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Bottom notice matching Screenshot 2 */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 italic">
                  Note: This is a simulated event for research and demonstration purposes only. Not a real network capture.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an event from the table to view dissection details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
