import { describe, it, expect } from 'vitest';
import { detectThreats, DhcpEvent } from './detector';

describe('DHCP Guard Threat Detector Acceptance Criteria (Section 7)', () => {
  const defaultTrusted = '192.168.1.1';

  it('Normal lease and renewal produce no alerts with the default trusted server', () => {
    // Normal Lease
    const normalLeaseEvents: DhcpEvent[] = [
      { id: '1', run_id: 'r1', t: 1.0, type: 'DISCOVER', xid: '0x1001', mac: '02:00:00:00:00:11', server_id: '-', label: 'normal' },
      { id: '2', run_id: 'r1', t: 1.1, type: 'OFFER', xid: '0x1001', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', offered_gateway: '192.168.1.1', label: 'normal' },
      { id: '3', run_id: 'r1', t: 1.2, type: 'REQUEST', xid: '0x1001', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', label: 'normal' },
      { id: '4', run_id: 'r1', t: 1.3, type: 'ACK', xid: '0x1001', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', label: 'normal' },
      // Renewal
      { id: '5', run_id: 'r1', t: 50.0, type: 'REQUEST', xid: '0x1002', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', label: 'normal' },
      { id: '6', run_id: 'r1', t: 50.1, type: 'ACK', xid: '0x1002', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', label: 'normal' }
    ];

    const result = detectThreats(normalLeaseEvents, defaultTrusted);
    expect(result.alerts.length).toBe(0);
    expect(result.events.every(e => !e.flagged)).toBe(true);
    expect(result.metrics.fp).toBe(0);
    expect(result.metrics.tp).toBe(0);
  });

  it('Rogue offer produces an ALERT on the rogue OFFER and its ACK, and no alert on the trusted OFFER', () => {
    // Rogue Offer Scenario: DISCOVER, OFFER from 192.168.1.77 (attack), OFFER from trusted, ACK from rogue (attack)
    const rogueScenario: DhcpEvent[] = [
      { id: 'r1', run_id: 'r1', t: 10.0, type: 'DISCOVER', xid: '0x2001', mac: '02:00:00:00:00:22', server_id: '-', label: 'normal' },
      { id: 'r2', run_id: 'r1', t: 10.1, type: 'OFFER', xid: '0x2001', mac: '02:00:00:00:00:22', server_id: '192.168.1.77', offered_gateway: '192.168.1.77', label: 'attack' },
      { id: 'r3', run_id: 'r1', t: 10.2, type: 'OFFER', xid: '0x2001', mac: '02:00:00:00:00:22', server_id: '192.168.1.1', offered_gateway: '192.168.1.1', label: 'normal' },
      { id: 'r4', run_id: 'r1', t: 10.3, type: 'REQUEST', xid: '0x2001', mac: '02:00:00:00:00:22', server_id: '192.168.1.77', label: 'normal' },
      { id: 'r5', run_id: 'r1', t: 10.4, type: 'ACK', xid: '0x2001', mac: '02:00:00:00:00:22', server_id: '192.168.1.77', label: 'attack' }
    ];

    const result = detectThreats(rogueScenario, defaultTrusted);

    // Event r2 (rogue OFFER) should be flagged
    const rogueOffer = result.events.find(e => e.id === 'r2');
    expect(rogueOffer?.flagged).toBe(true);

    // Event r3 (trusted OFFER) should NOT be flagged
    const trustedOffer = result.events.find(e => e.id === 'r3');
    expect(trustedOffer?.flagged).toBe(false);

    // Event r5 (rogue ACK) should be flagged
    const rogueAck = result.events.find(e => e.id === 'r5');
    expect(rogueAck?.flagged).toBe(true);

    // 2 alerts generated
    expect(result.alerts.length).toBe(2);
    expect(result.metrics.tp).toBe(2);
    expect(result.metrics.fp).toBe(0);
    expect(result.metrics.precision).toBe(1.0);
  });

  it('Starvation burst produces alerts only from the 15th DISCOVER onward', () => {
    // 25 DISCOVERs, 0.1s apart
    const starvationEvents: DhcpEvent[] = [];
    for (let i = 1; i <= 25; i++) {
      starvationEvents.push({
        id: `s${i}`,
        run_id: 'burst1',
        t: +(16.0 + i * 0.1).toFixed(2),
        type: 'DISCOVER',
        xid: `0x${(1000 + i).toString(16)}`,
        mac: `02:00:00:00:00:${i.toString(16).padStart(2, '0')}`,
        server_id: '-',
        label: 'attack'
      });
    }

    const result = detectThreats(starvationEvents, defaultTrusted);

    // 1st through 14th DISCOVERs should NOT be flagged
    for (let i = 1; i <= 14; i++) {
      const ev = result.events.find(e => e.id === `s${i}`);
      expect(ev?.flagged).toBe(false);
    }

    // 15th through 25th DISCOVERs MUST be flagged
    for (let i = 15; i <= 25; i++) {
      const ev = result.events.find(e => e.id === `s${i}`);
      expect(ev?.flagged).toBe(true);
      expect(ev?.rule).toContain('DISCOVER burst');
    }

    // Exactly 11 alerts (25 - 14 = 11)
    expect(result.alerts.length).toBe(11);
    expect(result.metrics.tp).toBe(11);
    expect(result.metrics.fn).toBe(14); // the first 14 are false negatives before threshold
    expect(result.metrics.precision).toBe(1.0);
  });

  it('Changing the trusted server address changes which offers are flagged', () => {
    const offerEvent: DhcpEvent[] = [
      { id: 'chk1', run_id: 'c1', t: 1.0, type: 'OFFER', xid: '0x3001', mac: '02:00:00:00:00:11', server_id: '192.168.1.1', label: 'normal' }
    ];

    // When trusted is 192.168.1.1 -> not flagged
    const res1 = detectThreats(offerEvent, '192.168.1.1');
    expect(res1.events[0].flagged).toBe(false);

    // When trusted is changed to 10.0.0.1 -> flagged!
    const res2 = detectThreats(offerEvent, '10.0.0.1');
    expect(res2.events[0].flagged).toBe(true);
  });

  it('Reset returns all counters to zero', () => {
    const result = detectThreats([], defaultTrusted);
    expect(result.events.length).toBe(0);
    expect(result.alerts.length).toBe(0);
    expect(result.metrics.totalEvents).toBe(0);
    expect(result.metrics.totalAlerts).toBe(0);
    expect(result.metrics.tp).toBe(0);
    expect(result.metrics.fp).toBe(0);
    expect(result.metrics.fn).toBe(0);
    expect(result.metrics.tn).toBe(0);
    expect(result.metrics.precision).toBe(0);
    expect(result.metrics.recall).toBe(0);
    expect(result.metrics.f1).toBe(0);
  });
});
