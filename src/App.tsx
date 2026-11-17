import React, { useState, useEffect, useMemo } from 'react';
import { RouteId, DhcpEvent, DhcpAlert } from './types';
import { detectThreats, EvaluationMetrics } from './detector';
import { INITIAL_EVENTS, INITIAL_TRUSTED_SERVER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SimulationControls } from './components/SimulationControls';
import { OverviewView } from './views/OverviewView';
import { RiskRankingView } from './views/RiskRankingView';
import { DhcpMonitorView } from './views/DhcpMonitorView';
import { ThreatAlertsView } from './views/ThreatAlertsView';
import { EvaluationView } from './views/EvaluationView';
import { UserGuideView } from './views/UserGuideView';
import { BackendProposalView } from './views/BackendProposalView';
import { NetworkLabView } from './views/NetworkLabView';

export const App: React.FC = () => {
  // Theme state: defaults to light theme (user requested soft modern light theme!)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('posguard_theme') === 'dark';
  });

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active hash route state
  const [currentRoute, setCurrentRoute] = useState<RouteId>('overview');

  // Simulation state
  const [trustedServer, setTrustedServer] = useState<string>(INITIAL_TRUSTED_SERVER);
  const [events, setEvents] = useState<DhcpEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<DhcpEvent | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<DhcpAlert | null>(null);

  // Sync hash route with browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as RouteId;
      const validRoutes: RouteId[] = [
        'overview',
        'scoring',
        'monitor',
        'alerts',
        'eval',
        'guide',
        'backend',
        'lab',
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      } else {
        window.location.hash = '#overview';
        setCurrentRoute('overview');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('posguard_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('posguard_theme', 'light');
    }
  }, [isDarkMode]);

  // Pure detector execution: run whenever events or trusted server updates
  const detectionResult = useMemo(() => {
    return detectThreats(events, trustedServer);
  }, [events, trustedServer]);

  const activeEvents = detectionResult.events;
  const activeAlerts = detectionResult.alerts;
  const metrics: EvaluationMetrics = detectionResult.metrics;
  const ruleStats = detectionResult.ruleStats;

  const navigateTo = (route: RouteId) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
  };

  // Simulation actions matching Section 5 & 7 of the PDF spec
  const handleTriggerNormalLease = () => {
    const tBase = events.length > 0 ? Math.max(...events.map((e) => e.t)) + 2.0 : 1.0;
    const xid = `0x${Math.floor(10000 + Math.random() * 90000).toString(16)}`;
    const clientMac = '02:00:00:00:00:11';
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newLease: DhcpEvent[] = [
      {
        id: `evt-norm-${Date.now()}-1`,
        run_id: 'run-live',
        t: +(tBase + 0.1).toFixed(2),
        type: 'DISCOVER',
        xid,
        mac: clientMac,
        server_id: '-',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-norm-${Date.now()}-2`,
        run_id: 'run-live',
        t: +(tBase + 0.2).toFixed(2),
        type: 'OFFER',
        xid,
        mac: clientMac,
        server_id: trustedServer,
        offered_ip: '192.0.2.105',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-norm-${Date.now()}-3`,
        run_id: 'run-live',
        t: +(tBase + 0.3).toFixed(2),
        type: 'REQUEST',
        xid,
        mac: clientMac,
        server_id: trustedServer,
        offered_ip: '192.0.2.105',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-norm-${Date.now()}-4`,
        run_id: 'run-live',
        t: +(tBase + 0.4).toFixed(2),
        type: 'ACK',
        xid,
        mac: clientMac,
        server_id: trustedServer,
        offered_ip: '192.0.2.105',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
    ];

    setEvents((prev) => [...prev, ...newLease]);
  };

  const handleTriggerRenewal = () => {
    const tBase = events.length > 0 ? Math.max(...events.map((e) => e.t)) + 2.0 : 1.0;
    const xid = `0x${Math.floor(10000 + Math.random() * 90000).toString(16)}`;
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const renewalEvents: DhcpEvent[] = [
      {
        id: `evt-renew-${Date.now()}-1`,
        run_id: 'run-live',
        t: +(tBase + 0.1).toFixed(2),
        type: 'REQUEST',
        xid,
        mac: '02:00:00:00:00:11',
        server_id: trustedServer,
        offered_ip: '192.0.2.100',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-renew-${Date.now()}-2`,
        run_id: 'run-live',
        t: +(tBase + 0.2).toFixed(2),
        type: 'ACK',
        xid,
        mac: '02:00:00:00:00:11',
        server_id: trustedServer,
        offered_ip: '192.0.2.100',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        device: 'POS-Terminal-01',
        label: 'normal',
        timestampStr: nowStr,
      },
    ];

    setEvents((prev) => [...prev, ...renewalEvents]);
  };

  const handleTriggerRogueOffer = () => {
    const tBase = events.length > 0 ? Math.max(...events.map((e) => e.t)) + 2.0 : 1.0;
    const xid = `0x${Math.floor(20000 + Math.random() * 70000).toString(16)}`;
    const clientMac = '02:00:00:00:00:22';
    const rogueIp = '192.0.2.99';
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Rogue scenario from PDF spec:
    // DISCOVER, OFFER from 192.0.2.99 (attack), OFFER from trusted, ACK from rogue (attack)
    const rogueEvents: DhcpEvent[] = [
      {
        id: `evt-rogue-${Date.now()}-1`,
        run_id: 'run-live',
        t: +(tBase + 0.1).toFixed(2),
        type: 'DISCOVER',
        xid,
        mac: clientMac,
        server_id: '-',
        device: 'POS-Terminal-02',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-rogue-${Date.now()}-2`,
        run_id: 'run-live',
        t: +(tBase + 0.2).toFixed(2),
        type: 'OFFER',
        xid,
        mac: clientMac,
        server_id: rogueIp,
        offered_ip: '192.0.2.155',
        offered_gateway: '192.0.2.254',
        offered_dns: '1.1.1.1',
        device: 'POS-Terminal-02',
        label: 'attack',
        timestampStr: nowStr,
      },
      {
        id: `evt-rogue-${Date.now()}-3`,
        run_id: 'run-live',
        t: +(tBase + 0.25).toFixed(2),
        type: 'OFFER',
        xid,
        mac: clientMac,
        server_id: trustedServer,
        offered_ip: '192.0.2.102',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        device: 'POS-Terminal-02',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-rogue-${Date.now()}-4`,
        run_id: 'run-live',
        t: +(tBase + 0.35).toFixed(2),
        type: 'ACK',
        xid,
        mac: clientMac,
        server_id: rogueIp,
        offered_ip: '192.0.2.155',
        offered_gateway: '192.0.2.254',
        offered_dns: '1.1.1.1',
        device: 'POS-Terminal-02',
        label: 'attack',
        timestampStr: nowStr,
      },
    ];

    setEvents((prev) => [...prev, ...rogueEvents]);
  };

  const handleTriggerStarvationBurst = () => {
    const tBase = events.length > 0 ? Math.max(...events.map((e) => e.t)) + 2.0 : 1.0;
    const burstEvents: DhcpEvent[] = [];
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 25 DISCOVERs, 0.1s apart from distinct MACs (PDF Section 5 & 6)
    for (let i = 1; i <= 25; i++) {
      burstEvents.push({
        id: `evt-starv-${Date.now()}-${i}`,
        run_id: 'run-starv',
        t: +(tBase + i * 0.1).toFixed(2),
        type: 'DISCOVER',
        xid: `0x${(3000 + i).toString(16)}`,
        mac: `02:00:00:00:${Math.floor(i / 16).toString(16)}:${(i % 16).toString(16).padStart(2, '0')}`,
        server_id: '-',
        device: 'POS-Terminal-03',
        label: 'attack',
        timestampStr: nowStr,
      });
    }

    setEvents((prev) => [...prev, ...burstEvents]);
  };

  const handleTriggerTunnelVision = () => {
    const tBase = events.length > 0 ? Math.max(...events.map((e) => e.t)) + 2.0 : 1.0;
    const xid = `0x${Math.floor(30000 + Math.random() * 60000).toString(16)}`;
    const clientMac = '02:00:00:00:00:33';
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const tunnelEvents: DhcpEvent[] = [
      {
        id: `evt-tunnel-${Date.now()}-1`,
        run_id: 'run-live',
        t: +(tBase + 0.1).toFixed(2),
        type: 'DISCOVER',
        xid,
        mac: clientMac,
        server_id: '-',
        device: 'POS-Terminal-03',
        label: 'normal',
        timestampStr: nowStr,
      },
      {
        id: `evt-tunnel-${Date.now()}-2`,
        run_id: 'run-live',
        t: +(tBase + 0.2).toFixed(2),
        type: 'OFFER',
        xid,
        mac: clientMac,
        server_id: '10.10.10.50',
        offered_ip: '192.0.2.180',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        option_121: '10.0.0.0/8 via 10.10.10.1',
        gateway_mac: '02:00:00:00:00:99',
        device: 'POS-Terminal-03',
        label: 'attack',
        timestampStr: nowStr,
      },
      {
        id: `evt-tunnel-${Date.now()}-3`,
        run_id: 'run-live',
        t: +(tBase + 0.3).toFixed(2),
        type: 'ACK',
        xid,
        mac: clientMac,
        server_id: '10.10.10.50',
        offered_ip: '192.0.2.180',
        offered_gateway: '192.0.2.1',
        offered_dns: '8.8.8.8',
        option_121: '10.0.0.0/8 via 10.10.10.1',
        gateway_mac: '02:00:00:00:00:99',
        device: 'POS-Terminal-03',
        label: 'attack',
        timestampStr: nowStr,
      },
    ];

    setEvents((prev) => [...prev, ...tunnelEvents]);
  };

  const handleReset = () => {
    setEvents([]);
    setSelectedEvent(null);
    setSelectedAlert(null);
  };

  const handleSeedDemo = () => {
    setEvents(INITIAL_EVENTS);
    setSelectedEvent(null);
    setSelectedAlert(null);
  };

  const handleUpdateAlertStatus = (
    alertId: string,
    status: 'new' | 'investigating' | 'resolved'
  ) => {
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        totalAlerts={activeAlerts.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleMobileMenu={() => setMobileMenuOpen(true)}
        onReset={handleReset}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          totalAlerts={activeAlerts.length}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Universal Simulation Controls Bar */}
          <SimulationControls
            trustedServer={trustedServer}
            onUpdateTrustedServer={setTrustedServer}
            onTriggerNormalLease={handleTriggerNormalLease}
            onTriggerRenewal={handleTriggerRenewal}
            onTriggerRogueOffer={handleTriggerRogueOffer}
            onTriggerStarvationBurst={handleTriggerStarvationBurst}
            onTriggerTunnelVision={handleTriggerTunnelVision}
            onReset={handleReset}
            onSeedDemo={handleSeedDemo}
          />

          {/* Route Views */}
          {currentRoute === 'overview' && (
            <OverviewView
              events={activeEvents}
              alerts={activeAlerts}
              trustedServer={trustedServer}
              onSelectEvent={setSelectedEvent}
              onSelectAlert={setSelectedAlert}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'scoring' && <RiskRankingView />}

          {currentRoute === 'monitor' && (
            <DhcpMonitorView
              events={activeEvents}
              trustedServer={trustedServer}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          )}

          {currentRoute === 'alerts' && (
            <ThreatAlertsView
              alerts={activeAlerts}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              selectedAlert={selectedAlert}
              onSelectAlert={setSelectedAlert}
              ruleStats={ruleStats}
            />
          )}

          {currentRoute === 'eval' && <EvaluationView metrics={metrics} />}

          {currentRoute === 'guide' && (
            <UserGuideView
              onTriggerReset={handleReset}
              onTriggerNormalLease={handleTriggerNormalLease}
              onTriggerRenewal={handleTriggerRenewal}
              onTriggerRogueOffer={handleTriggerRogueOffer}
              onTriggerStarvationBurst={handleTriggerStarvationBurst}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'backend' && <BackendProposalView />}

          {currentRoute === 'lab' && (
            <NetworkLabView
              trustedServer={trustedServer}
              hasAlerts={activeAlerts.length > 0}
              onTriggerNormalLease={handleTriggerNormalLease}
              onTriggerRogueOffer={handleTriggerRogueOffer}
              onTriggerStarvationBurst={handleTriggerStarvationBurst}
              onTriggerTunnelVision={handleTriggerTunnelVision}
            />
          )}
        </main>
      </div>
    </div>
  );
};
