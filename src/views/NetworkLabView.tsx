import React, { useState, useMemo } from 'react';
import {
  Laptop,
  Server,
  Router,
  Monitor,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Globe,
  Flame,
  Search,
  HardDrive,
  Printer,
  Smartphone,
  Network,
  Home,
  Activity,
  MoveHorizontal,
  Info,
} from 'lucide-react';

interface NetworkLabViewProps {
  trustedServer: string;
  hasAlerts: boolean;
  onTriggerNormalLease?: () => void;
  onTriggerRogueOffer?: () => void;
  onTriggerStarvationBurst?: () => void;
  onTriggerTunnelVision?: () => void;
}

export type NodeKey =
  | 'internet'
  | 'firewall'
  | 'switch1'
  | 'switch2'
  | 'switch3'
  | 'terminal'
  | 'printer'
  | 'mobile'
  | 'pos02'
  | 'server'
  | 'monitor'
  | 'pos03'
  | 'rogue'
  | 'guest';

export const NetworkLabView: React.FC<NetworkLabViewProps> = ({
  trustedServer,
  hasAlerts,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeKey>('terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('Last 24 Hours');

  // Node telemetry details matching Scenario C1 specification & mockup
  const nodeDetails: Record<NodeKey, {
    name: string;
    ip: string;
    mac: string;
    os: string;
    role: string;
    status: string;
    statusType: 'online' | 'warning' | 'alert' | 'trusted';
  }> = {
    internet: {
      name: 'Card Payment Acquiring Network / WAN',
      ip: '198.51.100.1 (WAN Uplink)',
      mac: '00:1A:2B:3C:4D:00',
      os: 'Public WAN / Acquiring Bank Gateway',
      role: 'Secure TLS transaction clearing host reached via default gateway 192.0.2.1 over untrusted external merchant connection.',
      status: 'Connected',
      statusType: 'online',
    },
    firewall: {
      name: 'Merchant Perimeter Firewall / Gateway',
      ip: '192.0.2.1',
      mac: '02:00:00:00:00:01',
      os: 'Stateful POS Gateway / iptables',
      role: 'Default gateway providing egress to card payment acquiring network. Target of rogue gateway spoofing and TunnelVision bypass attacks.',
      status: 'Online • Protected Egress',
      statusType: 'warning',
    },
    switch1: {
      name: 'Merchant Access Switch (Switch-01)',
      ip: '192.0.2.2',
      mac: '02:00:00:00:00:02',
      os: 'Unmanaged 802.3 Access Switch',
      role: 'Broadcasts DHCP frames to all access ports without 802.1Q VLAN separation or DHCP snooping enabled. Root cause of rogue insertion vulnerability.',
      status: 'Operational • Unsegmented',
      statusType: 'warning',
    },
    switch2: {
      name: 'Core Infrastructure Switch (Switch-02)',
      ip: '192.0.2.3',
      mac: '02:00:00:00:00:03',
      os: 'Core Merchant Switch',
      role: 'Hosts legitimate DHCP server, POSGuard detection sensor probe, and service desk terminal with unmanaged broadcast domain.',
      status: 'Online • Core Authority',
      statusType: 'online',
    },
    switch3: {
      name: 'Perimeter & Edge Switch (Switch-03)',
      ip: '192.0.2.4',
      mac: '02:00:00:00:00:04',
      os: 'Unmanaged Edge Switch',
      role: 'Untrusted boundary switch where Rogue Attacker was inserted into the flat merchant LAN to race DHCPOFFERs.',
      status: hasAlerts ? 'Alert • Hostile Activity' : 'Online • Monitored',
      statusType: hasAlerts ? 'alert' : 'warning',
    },
    terminal: {
      name: 'POS Terminal 01 (Checkout Register)',
      ip: '192.0.2.11',
      mac: '02:00:00:00:00:11',
      os: 'Embedded Linux 5.15 / Android POS Terminal',
      role: 'Transaction terminal broadcasting DHCPDISCOVER frames upon boot or lease renewal. Vulnerable to rogue DHCP offer diversion under unseparated Scenario C1.',
      status: 'Online • Active Lease',
      statusType: 'online',
    },
    printer: {
      name: 'Merchant Receipt Printer',
      ip: '192.0.2.15',
      mac: '02:00:00:00:00:15',
      os: 'Embedded RTOS / Thermal Printer',
      role: 'Fiscal receipt printer leasing static reservation from legitimate DHCP on Merchant LAN.',
      status: 'Online',
      statusType: 'online',
    },
    mobile: {
      name: 'Wireless Mobile POS (Mobile-01)',
      ip: '192.0.2.16',
      mac: '02:00:00:00:00:16',
      os: 'Android 12 Enterprise POS',
      role: 'Handheld roaming POS terminal connected via 802.11ax access point to Switch-01.',
      status: 'Online • Wireless',
      statusType: 'online',
    },
    pos02: {
      name: 'POS Terminal 02 (Service Desk)',
      ip: '192.0.2.12',
      mac: '02:00:00:00:00:22',
      os: 'Windows 10 IoT Enterprise',
      role: 'Service desk register connected to core Switch-02 handling returns and customer card transactions.',
      status: 'Online',
      statusType: 'online',
    },
    server: {
      name: 'Authorized DHCP Server & Authority',
      ip: trustedServer,
      mac: '02:00:00:00:00:10',
      os: 'Merchant Gateway / Kea DHCP 2.4 / Linux',
      role: 'Legitimate network authority leasing subnet 192.0.2.0/24 with default gateway 192.0.2.1 and DNS resolver 8.8.8.8.',
      status: 'Trusted Anchor',
      statusType: 'trusted',
    },
    monitor: {
      name: 'POSGuard Lightweight Sensor Probe',
      ip: '192.0.2.20',
      mac: '02:00:00:00:00:20',
      os: 'POSGuard Daemon / Pure In-Memory Engine',
      role: 'Passive sensor analyzing Layer 2 broadcast DHCP frames against R1–R9 threat detection rules in real-time with sub-millisecond overhead.',
      status: 'Listening (100% Precision)',
      statusType: 'online',
    },
    pos03: {
      name: 'POS Terminal 03 (Drive-thru / Express)',
      ip: '192.0.2.33',
      mac: '02:00:00:00:00:33',
      os: 'Embedded Linux 5.15 / POS Terminal',
      role: 'Express checkout terminal on Switch-03 vulnerable to contention and starvation floods.',
      status: 'Online',
      statusType: 'online',
    },
    rogue: {
      name: 'Rogue DHCP Attacker Node',
      ip: '10.10.10.50 (Spoofed Rogue IP)',
      mac: '02:00:00:00:00:99',
      os: 'Kali Linux / dhcpstarv / yersinia',
      role: 'Infiltrates unseparated LAN to race fast DHCPOFFERs with malicious gateway (10.10.10.1) and option 121 route pushes to MitM POS transactions.',
      status: hasAlerts ? 'Active Attack Detected' : 'Dormant Threat Actor',
      statusType: 'alert',
    },
    guest: {
      name: 'Unmanaged Workstation / Guest Device',
      ip: '192.0.2.88',
      mac: '02:00:00:00:00:88',
      os: 'Windows 11 Home',
      role: 'Unmanaged laptop on merchant network sharing broadcast domain without 802.1X port security.',
      status: 'Online • Unmanaged',
      statusType: 'warning',
    },
  };

  const curr = nodeDetails[selectedNode] || nodeDetails.terminal;

  // Connected devices inventory matching topology nodes
  const devicesList = [
    { id: 1, name: 'POS-Terminal-01', ip: '192.0.2.11', mac: '02:00:00:00:00:11', type: 'POS Terminal', status: 'Online', connected: 'Nov 16, 13:50', key: 'terminal' as NodeKey },
    { id: 2, name: 'Receipt-Printer-01', ip: '192.0.2.15', mac: '02:00:00:00:00:15', type: 'Printer', status: 'Online', connected: 'Nov 16, 12:45', key: 'printer' as NodeKey },
    { id: 3, name: 'Wireless-POS-Mobile', ip: '192.0.2.16', mac: '02:00:00:00:00:16', type: 'Mobile POS', status: 'Online', connected: 'Nov 16, 13:10', key: 'mobile' as NodeKey },
    { id: 4, name: 'POS-Terminal-02', ip: '192.0.2.12', mac: '02:00:00:00:00:22', type: 'POS Terminal', status: 'Online', connected: 'Nov 16, 13:52', key: 'pos02' as NodeKey },
    { id: 5, name: 'Authorized-DHCP-Server', ip: trustedServer, mac: '02:00:00:00:00:10', type: 'Server', status: 'Trusted', connected: 'Nov 16, 12:00', key: 'server' as NodeKey },
    { id: 6, name: 'POSGuard-Sensor-01', ip: '192.0.2.20', mac: '02:00:00:00:00:20', type: 'Sensor', status: 'Online', connected: 'Nov 16, 12:00', key: 'monitor' as NodeKey },
    { id: 7, name: 'POS-Terminal-03', ip: '192.0.2.33', mac: '02:00:00:00:00:33', type: 'POS Terminal', status: 'Online', connected: 'Nov 16, 13:55', key: 'pos03' as NodeKey },
    { id: 8, name: 'Rogue-Attacker-99', ip: '10.10.10.50', mac: '02:00:00:00:00:99', type: 'Rogue Attacker', status: hasAlerts ? 'Alert' : 'Dormant', connected: 'Nov 16, 14:10', key: 'rogue' as NodeKey },
    { id: 9, name: 'Guest-Workstation-01', ip: '192.0.2.88', mac: '02:00:00:00:00:88', type: 'Workstation', status: 'Warning', connected: 'Nov 16, 14:02', key: 'guest' as NodeKey },
    { id: 10, name: 'Merchant-Switch-01', ip: '192.0.2.2', mac: '02:00:00:00:00:02', type: 'Switch', status: 'Online', connected: 'Nov 16, 12:30', key: 'switch1' as NodeKey },
    { id: 11, name: 'Core-Switch-02', ip: '192.0.2.3', mac: '02:00:00:00:00:03', type: 'Switch', status: 'Online', connected: 'Nov 16, 12:30', key: 'switch2' as NodeKey },
    { id: 12, name: 'Edge-Switch-03', ip: '192.0.2.4', mac: '02:00:00:00:00:04', type: 'Switch', status: 'Online', connected: 'Nov 16, 12:30', key: 'switch3' as NodeKey },
  ];

  const filteredDevices = useMemo(() => {
    return devicesList.filter((d) => {
      if (typeFilter !== 'All' && d.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.ip.toLowerCase().includes(q) ||
          d.mac.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, typeFilter, hasAlerts, trustedServer]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
            <Network className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Network Lab
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 shadow-sm">
                Scenario C1 Testbed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor and analyze your network infrastructure and rogue server insertion
            </p>
          </div>
        </div>

        {/* Right Breadcrumb only */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 self-start sm:self-auto">
          <Home className="w-3.5 h-3.5 text-cyan-500" />
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">Network Lab</span>
        </div>
      </div>

      {/* Top 4 Cyber KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Devices */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-cyan-500/25 p-5 shadow-soft transition-all hover:border-cyan-500/50 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Devices
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">24</span>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded">
                  ↑ 2%
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center shadow-md shadow-cyan-500/10">
              <Router className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M0 30 Q 30 35, 60 20 T 120 18 T 160 8 T 200 12"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
              <path
                d="M0 30 Q 30 35, 60 20 T 120 18 T 160 8 T 200 12 L 200 40 L 0 40 Z"
                fill="url(#sparkline-cyan)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="sparkline-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 2: Online Devices */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-emerald-500/25 p-5 shadow-soft transition-all hover:border-emerald-500/50 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Online Devices
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">22</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  ↑ 0%
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M0 25 Q 40 15, 80 25 T 140 10 T 200 14"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <path
                d="M0 25 Q 40 15, 80 25 T 140 10 T 200 14 L 200 40 L 0 40 Z"
                fill="url(#sparkline-emerald)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="sparkline-emerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 3: Offline / Threat Alert Devices */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-amber-500/25 p-5 shadow-soft transition-all hover:border-amber-500/50 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Offline Devices
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">2</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  ↓ 1%
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shadow-md shadow-amber-500/10">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M0 20 Q 50 35, 100 15 T 160 25 T 200 20"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              <path
                d="M0 20 Q 50 35, 100 15 T 160 25 T 200 20 L 200 40 L 0 40 Z"
                fill="url(#sparkline-amber)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="sparkline-amber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 4: Active Servers */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-purple-500/25 p-5 shadow-soft transition-all hover:border-purple-500/50 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Servers
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">5</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
                  ↑ 0%
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center shadow-md shadow-purple-500/10">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 h-10 w-full overflow-hidden">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M0 32 Q 40 28, 90 20 T 150 12 T 200 8"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              <path
                d="M0 32 Q 40 28, 90 20 T 150 12 T 200 8 L 200 40 L 0 40 Z"
                fill="url(#sparkline-purple)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="sparkline-purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FULL-WIDTH NETWORK TOPOLOGY CARD (Grand Cyber SOC View & Mobile-Ready) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-cyan-500/25 rounded-2xl p-5 sm:p-6 shadow-soft relative overflow-hidden">
        {/* Subtle Cyber Grid & Radar Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] dark:opacity-15 opacity-5 [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topology Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center shadow-sm">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white tracking-tight">
                  Network Topology Visualizer
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Full Topology
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Scenario C1: Unseparated merchant POS LAN hierarchy & rogue attacker placement
              </p>
            </div>
          </div>

          {/* Status Legend, Mobile Scroll Hint & Live View badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Warning
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Offline / Threat
              </span>
            </div>

            {/* Mobile swipe hint */}
            <div className="flex lg:hidden items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <MoveHorizontal className="w-3.5 h-3.5 animate-pulse" />
              <span>Pan topology</span>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live Interactive View
            </span>
          </div>
        </div>

        {/* 
          TRUE HIERARCHICAL TREE TOPOLOGY (Full Screen Responsive Canvas)
          Wrapped in mobile-friendly overflow-x-auto with min-width to ensure crisp rendering on all viewports
        */}
        <div className="relative z-10 w-full overflow-x-auto pb-4 pt-1 scrollbar-thin">
          <div className="relative min-w-[760px] sm:min-w-[880px] lg:min-w-0 w-full h-[440px]">
            {/* SVG Conduits & Branching Wiring */}
            <svg
              viewBox="0 0 1000 440"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* 1. Vertical Line: Internet to Firewall */}
              <line
                x1="500"
                y1="64"
                x2="500"
                y2="96"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-90"
              />
              <circle cx="500" cy="80" r="3" fill="#06b6d4" className="drop-shadow-[0_0_4px_#06b6d4]" />

              {/* 2. Vertical Trunk: Firewall to Main Horizontal Switch Bus */}
              <line
                x1="500"
                y1="156"
                x2="500"
                y2="188"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* 3. Main Horizontal Bus across the 3 Switches */}
              <line
                x1="166.7"
                y1="188"
                x2="833.3"
                y2="188"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* Junction Dots on Main Switch Bus */}
              <circle cx="166.7" cy="188" r="4" fill="#06b6d4" className="drop-shadow-[0_0_5px_#06b6d4]" />
              <circle cx="500.0" cy="188" r="4" fill="#06b6d4" className="drop-shadow-[0_0_5px_#06b6d4]" />
              <circle cx="833.3" cy="188" r="4" fill="#06b6d4" className="drop-shadow-[0_0_5px_#06b6d4]" />

              {/* Vertical Drop Lines to Switches */}
              <line x1="166.7" y1="188" x2="166.7" y2="216" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="500.0" y1="188" x2="500.0" y2="216" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="833.3" y1="188" x2="833.3" y2="216" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />

              {/* 
                SUB-BRANCH 1: Under Switch-01 (Merchant LAN Cluster)
                Center = 166.7. Leaf X coordinates: 75, 166.7, 258.
              */}
              <line x1="166.7" y1="280" x2="166.7" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="75" y1="308" x2="258" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="75" y1="308" x2="75" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="166.7" y1="308" x2="166.7" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="258" y1="308" x2="258" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <circle cx="166.7" cy="308" r="3.5" fill="#06b6d4" />
              <circle cx="75" cy="308" r="3" fill="#06b6d4" />
              <circle cx="258" cy="308" r="3" fill="#06b6d4" />

              {/* 
                SUB-BRANCH 2: Under Switch-02 (Core Infrastructure Cluster)
                Center = 500. Leaf X coordinates: 408, 500, 592.
              */}
              <line x1="500.0" y1="280" x2="500.0" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="408" y1="308" x2="592" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="408" y1="308" x2="408" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="500.0" y1="308" x2="500.0" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="592" y1="308" x2="592" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <circle cx="500.0" cy="308" r="3.5" fill="#06b6d4" />
              <circle cx="408" cy="308" r="3" fill="#06b6d4" />
              <circle cx="592" cy="308" r="3" fill="#06b6d4" />

              {/* 
                SUB-BRANCH 3: Under Switch-03 (Perimeter / Threat Cluster)
                Center = 833.3. Leaf X coordinates: 742, 833.3, 925.
              */}
              <line x1="833.3" y1="280" x2="833.3" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="742" y1="308" x2="925" y2="308" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="742" y1="308" x2="742" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="833.3" y1="308" x2="833.3" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="925" y1="308" x2="925" y2="334" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <circle cx="833.3" cy="308" r="3.5" fill="#06b6d4" />
              <circle cx="742" cy="308" r="3" fill="#06b6d4" />
              <circle cx="925" cy="308" r="3" fill="#06b6d4" />
            </svg>

            {/* TIER 1: INTERNET NODE (Centered at top) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[6px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('internet')}
                className={`group w-28 sm:w-32 flex flex-col items-center py-2 px-3 rounded-2xl border transition-all ${
                  selectedNode === 'internet'
                    ? 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight">Internet</span>
                <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400">WAN Uplink</span>
              </button>
            </div>

            {/* TIER 2: FIREWALL NODE (Centered below Internet) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[96px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('firewall')}
                className={`group w-28 sm:w-32 flex flex-col items-center py-2 px-3 rounded-2xl border transition-all ${
                  selectedNode === 'firewall'
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight">Firewall</span>
                <span className="text-[9px] font-mono text-slate-400">192.0.2.1</span>
              </button>
            </div>

            {/* TIER 3: DISTRIBUTION SWITCHES (Switch-01, Switch-02, Switch-03) */}
            {/* Switch-01 (16.67%) */}
            <div className="absolute left-[16.67%] -translate-x-1/2 top-[216px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('switch1')}
                className={`group w-28 sm:w-32 flex flex-col items-center py-2 px-3 rounded-2xl border transition-all ${
                  selectedNode === 'switch1'
                    ? 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Router className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight">Switch-01</span>
                <span className="text-[9px] font-mono text-slate-400">Merchant LAN</span>
              </button>
            </div>

            {/* Switch-02 (50.00%) */}
            <div className="absolute left-[50.00%] -translate-x-1/2 top-[216px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('switch2')}
                className={`group w-28 sm:w-32 flex flex-col items-center py-2 px-3 rounded-2xl border transition-all ${
                  selectedNode === 'switch2'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Router className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight">Switch-02</span>
                <span className="text-[9px] font-mono text-slate-400">Core Auth</span>
              </button>
            </div>

            {/* Switch-03 (83.33%) */}
            <div className="absolute left-[83.33%] -translate-x-1/2 top-[216px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('switch3')}
                className={`group w-28 sm:w-32 flex flex-col items-center py-2 px-3 rounded-2xl border transition-all ${
                  selectedNode === 'switch3'
                    ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/30 shadow-md shadow-purple-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Router className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-tight">Switch-03</span>
                <span className="text-[9px] font-mono text-slate-400">Edge / Threat</span>
              </button>
            </div>

            {/* 
              TIER 4: CONNECTED CLIENT DEVICES
              With full width card, each device has generous room (w-20 sm:w-24),
              showing icon, name, and full IP address without collision!
            */}

            {/* CLUSTER 1: under Switch-01 */}
            {/* POS-01 (7.5%) */}
            <div className="absolute left-[7.5%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('terminal')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'terminal'
                    ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">POS-01</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.11</span>
              </button>
            </div>

            {/* Receipt Printer (16.67%) */}
            <div className="absolute left-[16.67%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('printer')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'printer'
                    ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">Printer</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.15</span>
              </button>
            </div>

            {/* Mobile POS (25.8%) */}
            <div className="absolute left-[25.8%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('mobile')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'mobile'
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">Mobile POS</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.16</span>
              </button>
            </div>

            {/* CLUSTER 2: under Switch-02 */}
            {/* POS-02 (40.8%) */}
            <div className="absolute left-[40.8%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('pos02')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'pos02'
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">POS-02</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.12</span>
              </button>
            </div>

            {/* Authorized DHCP Server (50.0%) */}
            <div className="absolute left-[50.0%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('server')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'server'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-emerald-200 dark:border-emerald-800/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Server className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-1 truncate w-full">Auth DHCP</span>
                <span className="text-[8.5px] font-mono text-emerald-600 dark:text-emerald-400 truncate w-full">
                  {trustedServer}
                </span>
              </button>
            </div>

            {/* POSGuard Sensor (59.2%) */}
            <div className="absolute left-[59.2%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('monitor')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'monitor'
                    ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Monitor className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">Sensor Probe</span>
                <span className="text-[8.5px] font-mono text-cyan-600 dark:text-cyan-400 truncate w-full">192.0.2.20</span>
              </button>
            </div>

            {/* CLUSTER 3: under Switch-03 */}
            {/* POS-03 (74.2%) */}
            <div className="absolute left-[74.2%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('pos03')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'pos03'
                    ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 ring-2 ring-purple-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">POS-03</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.33</span>
              </button>
            </div>

            {/* Rogue DHCP Attacker (83.33%) */}
            <div className="absolute left-[83.33%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('rogue')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'rogue'
                    ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/30'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-rose-300 dark:border-rose-900/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center animate-pulse shadow-md shadow-rose-500/40 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 truncate w-full">Rogue Attacker</span>
                <span className="text-[8.5px] font-mono text-rose-500 truncate w-full">10.10.10.50</span>
              </button>
            </div>

            {/* Unmanaged Workstation (92.5%) */}
            <div className="absolute left-[92.5%] -translate-x-1/2 top-[334px] flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('guest')}
                className={`group w-20 sm:w-24 flex flex-col items-center py-1.5 px-1.5 rounded-xl border text-center transition-all ${
                  selectedNode === 'guest'
                    ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-850/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Monitor className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate w-full">Workstation</span>
                <span className="text-[8.5px] font-mono text-slate-400 truncate w-full">192.0.2.88</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Node Telemetry Inspector (Full-Width Dashboard Style) */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-850/90 border border-slate-200/90 dark:border-slate-750 relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                {curr.name}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">• Telemetry Inspector</span>
            </div>
            <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-bold border ${
              curr.statusType === 'alert'
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                : curr.statusType === 'warning'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
            }`}>
              {curr.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">IP Address</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{curr.ip}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Hardware MAC</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{curr.mac}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 sm:col-span-2 lg:col-span-1">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Operating System / Stack</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block truncate">{curr.os}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans pt-1 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">Scenario C1 Vulnerability Role: </strong>
            {curr.role}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE NETWORK TRAFFIC & DHCP INFORMATION (Placed Below Topology)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card A: Live Network Traffic Wave Chart (7 Cols on desktop, full width on mobile) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-cyan-500/25 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Live Network Traffic
              </h4>
            </div>

            {/* Timeframe selector dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] focus:outline-none"
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 6 Hours">Last 6 Hours</option>
                <option value="Realtime 1h">Realtime 1h</option>
              </select>
            </div>
          </div>

          {/* Legend & Peak metrics matching mockup */}
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Download</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Upload</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
              <span className="text-cyan-600 dark:text-cyan-400">↓ 120 MB</span>
              <span className="text-purple-600 dark:text-purple-400">↑ 85 MB</span>
            </div>
          </div>

          {/* Glowing Dual-Curve Area Wave Chart */}
          <div className="h-44 sm:h-48 w-full relative">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Horizontal gridlines */}
              {[0, 50, 100, 150].map((val) => {
                const y = 140 - (val / 150) * 110;
                return (
                  <g key={val}>
                    <line x1="30" y1={y} x2="490" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                    <text x="25" y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">{val}M</text>
                  </g>
                );
              })}

              {/* Upload Curve (Purple gradient fill) */}
              <path
                d="M 30 135 C 90 120, 150 90, 210 110 C 270 125, 330 70, 390 85 C 440 95, 470 105, 490 120 L 490 140 L 30 140 Z"
                fill="url(#traffic-purple)"
              />
              <path
                d="M 30 135 C 90 120, 150 90, 210 110 C 270 125, 330 70, 390 85 C 440 95, 470 105, 490 120"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />

              {/* Download Curve (Cyan gradient fill) */}
              <path
                d="M 30 120 C 80 80, 140 105, 200 65 C 260 40, 320 85, 380 50 C 430 45, 465 75, 490 90 L 490 140 L 30 140 Z"
                fill="url(#traffic-cyan)"
              />
              <path
                d="M 30 120 C 80 80, 140 105, 200 65 C 260 40, 320 85, 380 50 C 430 45, 465 75, 490 90"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="traffic-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="traffic-purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Time Ticks */}
              {['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'].map((t, idx) => {
                const x = 30 + idx * 90;
                return (
                  <text key={t} x={x} y="155" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                    {t}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Card B: DHCP Information & Circular Pool Gauge (5 Cols on desktop, full width on mobile) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-cyan-500/25 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                DHCP Information
              </h4>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="9"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="9"
                  strokeDasharray={`${0.96 * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">96%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Pool Usage</span>
              </div>
            </div>

            {/* Data points */}
            <div className="flex-1 w-full space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-xs">IP Range:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                  192.0.2.100 - 192.0.2.200
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-xs">Leased IPs:</span>
                <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">192</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-xs">Available IPs:</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">8</span>
              </div>

              <div className="pt-2">
                <a
                  href="#monitor"
                  className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all active:scale-98"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONNECTED DEVICES INVENTORY TABLE (Full Width)                          */}
      {/* ========================================================================= */}
      <div className="w-full bg-white dark:bg-[#0c1527] border border-slate-200/80 dark:border-cyan-500/25 rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Connected Devices
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {filteredDevices.length} network interfaces registered on merchant LAN
              </p>
            </div>
          </div>

          {/* Search bar and Filter dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 w-full sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
              >
                <option value="All">Filter: All</option>
                <option value="POS Terminal">POS Terminal</option>
                <option value="Switch">Switch</option>
                <option value="Server">Server</option>
                <option value="Rogue Attacker">Rogue Attacker</option>
                <option value="Sensor">Sensor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-scroll-container">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-4">Device Name</th>
                <th className="py-3 px-3.5">IP Address</th>
                <th className="py-3 px-3.5">MAC Address</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3.5">Connected Since</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredDevices.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => setSelectedNode(dev.key)}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/50 cursor-pointer transition-colors ${
                    selectedNode === dev.key ? 'bg-cyan-50/50 dark:bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3.5 text-center font-mono text-[11px] text-slate-400">
                    {dev.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span>{dev.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                    {dev.ip}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {dev.mac}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      dev.type === 'POS Terminal'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : dev.type === 'Switch'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : dev.type === 'Server'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : dev.type === 'Rogue Attacker'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {dev.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${
                        dev.status === 'Alert'
                          ? 'bg-rose-500 animate-pulse'
                          : dev.status === 'Warning' || dev.status === 'Dormant'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`} />
                      {dev.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                    {dev.connected}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(dev.key);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
