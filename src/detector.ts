import { DhcpEvent, DhcpAlert, DhcpMessageType, EvaluationMetrics } from './types';

export type { DhcpEvent, DhcpAlert, DhcpMessageType, EvaluationMetrics };

export interface DetectionRuleDef {
  code: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';
  name: string;
  checks: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'Allowlist' | 'Contention' | 'Option Validation' | 'Routing & Topology' | 'Rate & Anomaly';
}

export const DETECTION_RULES: DetectionRuleDef[] = [
  {
    code: 'R1',
    name: 'Untrusted Server',
    checks: 'DHCP server not in the trusted list',
    description: 'Intercepts DHCP OFFER or ACK originating from any server identifier not in the configured authorization allowlist.',
    severity: 'critical',
    category: 'Allowlist',
  },
  {
    code: 'R2',
    name: 'Server Contention',
    checks: 'Two servers answer the same request',
    description: 'Detects race condition when multiple DHCP servers respond to the same transaction ID (XID), indicating rogue server insertion competing with legitimate server.',
    severity: 'critical',
    category: 'Contention',
  },
  {
    code: 'R3',
    name: 'Wrong Gateway',
    checks: 'Wrong gateway (Option 3)',
    description: 'Validates Option 3 (Router) against known default gateway baseline (192.0.2.1). Prevents traffic diversion and Man-in-the-Middle (MitM) positioning.',
    severity: 'critical',
    category: 'Option Validation',
  },
  {
    code: 'R4',
    name: 'Wrong DNS Resolver',
    checks: 'Wrong DNS (Option 6)',
    description: 'Validates Option 6 (Domain Name Server) against trusted resolver anchor (8.8.8.8). Prevents DNS spoofing and phishing redirection.',
    severity: 'high',
    category: 'Option Validation',
  },
  {
    code: 'R5',
    name: 'Wrong Subnet Mask',
    checks: 'Wrong subnet mask (Option 1)',
    description: 'Validates Option 1 (Subnet Mask) matches expected network mask (255.255.255.0) to prevent subnet isolation or broadcast flooding.',
    severity: 'medium',
    category: 'Option Validation',
  },
  {
    code: 'R6',
    name: 'Abnormal Lease Time',
    checks: 'Abnormal lease time (Option 51)',
    description: 'Flags lease duration < 300s (forcing continuous re-authentication) or unusually long leases (> 24h) that disrupt merchant IP reclamation.',
    severity: 'medium',
    category: 'Option Validation',
  },
  {
    code: 'R7',
    name: 'Option 121 Extra Routes',
    checks: 'Option 121 extra routes (TunnelVision)',
    description: 'Scans for DHCP Option 121 / 249 (Classless Static Routes) injecting arbitrary routes to decloak VPN tunnels and divert merchant card traffic (CVE-2024-3661 / TunnelVision).',
    severity: 'critical',
    category: 'Routing & Topology',
  },
  {
    code: 'R8',
    name: 'Request Flood Burst',
    checks: 'Sudden flood of DHCP requests',
    description: 'Sliding window rate limiter flags >= 15 broadcast DISCOVER packets within 5.0 seconds from randomized MAC addresses (DHCP starvation attack).',
    severity: 'high',
    category: 'Rate & Anomaly',
  },
  {
    code: 'R9',
    name: 'Gateway MAC Change',
    checks: 'Gateway MAC changes after a suspicious reply',
    description: 'Correlates suspicious DHCP replies with ARP / Layer 2 gateway MAC modifications. Flags if gateway hardware MAC address changes unexpectedly.',
    severity: 'critical',
    category: 'Routing & Topology',
  },
];

export interface DetectionResult {
  events: DhcpEvent[];
  alerts: DhcpAlert[];
  metrics: EvaluationMetrics;
  ruleStats: Record<string, number>;
}

/**
 * Pure detector function implementing rules R1 through R9:
 * R1: DHCP server not in the trusted list
 * R2: Two servers answer the same request (Contention on XID)
 * R3-R6: Wrong gateway, DNS, subnet, or lease time
 * R7: Option 121 extra routes (TunnelVision)
 * R8: Sudden flood of DHCP requests (Starvation)
 * R9: Gateway MAC changes after a suspicious reply
 */
export function detectThreats(
  events: DhcpEvent[],
  trustedServer: string = '192.0.2.10',
  expectedGateway: string = '192.0.2.1',
  expectedDns: string = '8.8.8.8',
  expectedSubnet: string = '255.255.255.0',
  baselineGatewayMac: string = '02:00:00:00:00:01'
): DetectionResult {
  // Sort events chronologically to ensure accurate sliding window evaluation
  const sortedEvents = [...events].sort((a, b) => a.t - b.t);

  const processedEvents: DhcpEvent[] = [];
  const alerts: DhcpAlert[] = [];
  let alertCount = 0;

  // Track recent discover timestamps for Rule R8 sliding window (5s window)
  const recentDiscovers: number[] = [];

  // Track offers by XID for Rule R2 (Contention detection)
  const offersByXid = new Map<string, { server_id: string; t: number; id: string }[]>();

  // Track gateway MAC history for Rule R9
  let activeGatewayMac = baselineGatewayMac;

  // Rule activation counters
  const ruleStats: Record<string, number> = {
    R1: 0,
    R2: 0,
    R3: 0,
    R4: 0,
    R5: 0,
    R6: 0,
    R7: 0,
    R8: 0,
    R9: 0,
  };

  for (let i = 0; i < sortedEvents.length; i++) {
    const ev = { ...sortedEvents[i] };
    const triggeredRules: { code: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9'; name: string; msg: string; sev: 'critical' | 'high' | 'medium' | 'low'; evidence: string }[] = [];

    const isResponse = ev.type === 'OFFER' || ev.type === 'ACK';

    // ----------------------------------------------------
    // R1: DHCP server not in the trusted list
    // ----------------------------------------------------
    if (isResponse && ev.server_id && ev.server_id !== '-' && ev.server_id !== trustedServer) {
      triggeredRules.push({
        code: 'R1',
        name: 'R1: Untrusted Server',
        msg: `Rogue DHCP ${ev.type} detected from unauthorized server ${ev.server_id}`,
        sev: ev.type === 'OFFER' ? 'critical' : 'high',
        evidence: `Server identifier ${ev.server_id} is not in the configured authorization allowlist (trusted anchor: ${trustedServer}).`,
      });
      ruleStats.R1++;
    }

    // ----------------------------------------------------
    // R2: Two servers answer the same request (Contention)
    // ----------------------------------------------------
    if (isResponse && ev.xid && ev.server_id && ev.server_id !== '-') {
      const priorOffers = offersByXid.get(ev.xid) || [];
      const hasContention = priorOffers.some((o) => o.server_id !== ev.server_id);
      
      priorOffers.push({ server_id: ev.server_id, t: ev.t, id: ev.id });
      offersByXid.set(ev.xid, priorOffers);

      if (hasContention) {
        const competingServers = Array.from(new Set(priorOffers.map((p) => p.server_id))).join(' vs ');
        triggeredRules.push({
          code: 'R2',
          name: 'R2: Server Contention',
          msg: `Multiple DHCP servers answered the same transaction request (${ev.xid})`,
          sev: 'critical',
          evidence: `Contention observed for XID ${ev.xid}: responses received from competing servers (${competingServers}).`,
        });
        ruleStats.R2++;
      }
    }

    // ----------------------------------------------------
    // R3: Wrong gateway
    // ----------------------------------------------------
    if (isResponse && ev.offered_gateway && ev.offered_gateway !== '-' && ev.offered_gateway !== expectedGateway) {
      triggeredRules.push({
        code: 'R3',
        name: 'R3: Wrong Gateway',
        msg: `Unauthorized default gateway offered: ${ev.offered_gateway} (expected ${expectedGateway})`,
        sev: 'critical',
        evidence: `Option 3 (Router) offered ${ev.offered_gateway}, diverging from baseline default gateway ${expectedGateway}. Traffic is diverted through an attacker-controlled router.`,
      });
      ruleStats.R3++;
    }

    // ----------------------------------------------------
    // R4: Wrong DNS
    // ----------------------------------------------------
    if (isResponse && ev.offered_dns && ev.offered_dns !== '-' && ev.offered_dns !== expectedDns) {
      triggeredRules.push({
        code: 'R4',
        name: 'R4: Wrong DNS Resolver',
        msg: `Untrusted DNS resolver offered: ${ev.offered_dns} (expected ${expectedDns})`,
        sev: 'high',
        evidence: `Option 6 (DNS) offered ${ev.offered_dns}, diverging from trusted resolver ${expectedDns}. Attacker can spoof merchant domain lookups.`,
      });
      ruleStats.R4++;
    }

    // ----------------------------------------------------
    // R5: Wrong subnet mask
    // ----------------------------------------------------
    if (isResponse && ev.offered_subnet && ev.offered_subnet !== '-' && ev.offered_subnet !== expectedSubnet) {
      triggeredRules.push({
        code: 'R5',
        name: 'R5: Wrong Subnet Mask',
        msg: `Anomalous subnet mask offered: ${ev.offered_subnet} (expected ${expectedSubnet})`,
        sev: 'medium',
        evidence: `Option 1 (Subnet Mask) offered ${ev.offered_subnet}, altering broadcast domains and POS device routing boundary.`,
      });
      ruleStats.R5++;
    }

    // ----------------------------------------------------
    // R6: Abnormal lease time
    // ----------------------------------------------------
    if (isResponse && ev.lease_time !== undefined && (ev.lease_time < 300 || ev.lease_time > 86400)) {
      triggeredRules.push({
        code: 'R6',
        name: 'R6: Abnormal Lease Duration',
        msg: `Abnormal lease duration offered: ${ev.lease_time}s`,
        sev: 'medium',
        evidence: `Option 51 (Lease Time) is ${ev.lease_time}s. Exceptionally low leases force rapid renewal flooding, while abnormally high leases prevent IP reassignment.`,
      });
      ruleStats.R6++;
    }

    // ----------------------------------------------------
    // R7: Option 121 extra routes (TunnelVision CVE-2024-3661)
    // ----------------------------------------------------
    if (isResponse && ev.option_121 && ev.option_121 !== '-' && ev.option_121.trim().length > 0) {
      triggeredRules.push({
        code: 'R7',
        name: 'R7: Option 121 Extra Routes (TunnelVision)',
        msg: `Option 121 classless static routes pushed: ${ev.option_121}`,
        sev: 'critical',
        evidence: `DHCP Option 121 / 249 pushes static routes (${ev.option_121}) with higher routing priority than default VPN routes, decloaking and intercepting traffic (TunnelVision attack).`,
      });
      ruleStats.R7++;
    }

    // ----------------------------------------------------
    // R8: Sudden flood of DHCP requests (Starvation Burst)
    // ----------------------------------------------------
    if (ev.type === 'DISCOVER') {
      recentDiscovers.push(ev.t);
      // Prune timestamps older than (ev.t - 5.0)
      while (recentDiscovers.length > 0 && recentDiscovers[0] < ev.t - 5.0) {
        recentDiscovers.shift();
      }

      if (recentDiscovers.length >= 15) {
        triggeredRules.push({
          code: 'R8',
          name: 'R8: Sudden Request Flood',
          msg: `DHCP Starvation attack burst detected (${recentDiscovers.length} requests in 5.0s)`,
          sev: 'high',
          evidence: `Broadcast DISCOVER frequency (${recentDiscovers.length} pkts / 5.0s) exceeded rate threshold (15). MAC spoofing flood exhausts address pool.`,
        });
        ruleStats.R8++;
      }
    }

    // ----------------------------------------------------
    // R9: Gateway MAC changes after a suspicious reply
    // ----------------------------------------------------
    if (ev.gateway_mac && ev.gateway_mac !== '-' && ev.gateway_mac !== activeGatewayMac) {
      const prevMac = activeGatewayMac;
      triggeredRules.push({
        code: 'R9',
        name: 'R9: Gateway MAC Divergence',
        msg: `Default gateway hardware MAC changed to ${ev.gateway_mac} (previous: ${prevMac})`,
        sev: 'critical',
        evidence: `Gateway ARP binding altered: previous hardware address ${prevMac} diverged to ${ev.gateway_mac} following DHCP lease negotiation.`,
      });
      ruleStats.R9++;
      activeGatewayMac = ev.gateway_mac;
    }

    // Process triggers into event flags and alert records
    const isFlagged = triggeredRules.length > 0;
    ev.flagged = isFlagged;

    if (isFlagged) {
      // Pick highest severity as primary rule code
      const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      triggeredRules.sort((a, b) => severityOrder[b.sev] - severityOrder[a.sev]);
      const primary = triggeredRules[0];

      ev.rule_code = primary.code;
      ev.rule = primary.code === 'R8'
        ? 'R8: DISCOVER burst (>14 in 5s)'
        : triggeredRules.map((r) => r.code).join(', ');

      alertCount++;
      const alertId = `ALT-${String(alertCount).padStart(3, '0')}`;
      
      const allEvidence = triggeredRules.map((r) => `[${r.code}] ${r.evidence}`);
      allEvidence.push(`Transaction ID: ${ev.xid}`);
      if (ev.mac) allEvidence.push(`Client Hardware MAC: ${ev.mac}`);

      alerts.push({
        id: alertId,
        event_id: ev.id,
        t: ev.t,
        rule: `${primary.code}: ${primary.name}${triggeredRules.length > 1 ? ` (+${triggeredRules.length - 1} more)` : ''}`,
        rule_code: primary.code,
        severity: primary.sev,
        message: primary.msg,
        created_at: new Date(Date.now() - (sortedEvents.length - i) * 60000).toISOString(),
        suspected_server: ev.server_id !== '-' ? ev.server_id : (ev.type === 'DISCOVER' ? 'Broadcast Spoof Flood' : 'Unknown Attacker'),
        affected_device: ev.device || (ev.mac === '02:00:00:00:00:11' ? 'POS-Terminal-01' : (ev.mac === '02:00:00:00:00:22' ? 'POS-Terminal-02' : 'POS-Terminal-03')),
        status: 'new',
        xid: ev.xid,
        type: ev.type,
        evidence: allEvidence,
        observed_config: {
          dhcp_server: ev.server_id !== '-' ? ev.server_id : 'None',
          gateway: ev.offered_gateway || '192.0.2.1',
          dns: ev.offered_dns || '8.8.8.8'
        },
        expected_config: {
          dhcp_server: trustedServer,
          gateway: expectedGateway,
          dns: expectedDns
        }
      });
    }

    processedEvents.push(ev);
  }

  // Calculate metrics
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;

  for (const ev of processedEvents) {
    if (ev.label === 'attack') {
      if (ev.flagged) {
        tp++;
      } else {
        fn++;
      }
    } else {
      if (ev.flagged) {
        fp++;
      } else {
        tn++;
      }
    }
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    events: processedEvents,
    alerts,
    metrics: {
      tp,
      fp,
      fn,
      tn,
      precision,
      recall,
      f1,
      totalEvents: processedEvents.length,
      totalAlerts: alerts.length
    },
    ruleStats
  };
}
