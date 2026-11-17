import { DhcpEvent } from '../types';

export const INITIAL_TRUSTED_SERVER = '192.0.2.10';

export const INITIAL_EVENTS: DhcpEvent[] = [
  // Normal lease for POS-Terminal-01
  {
    id: 'evt-20250428-001',
    run_id: 'run-init',
    t: 1.0,
    type: 'DISCOVER',
    xid: '0x3a70',
    mac: '02:00:00:00:00:11',
    server_id: '-',
    device: 'POS-Terminal-01',
    label: 'normal',
    timestampStr: '2025-04-28 14:32:11'
  },
  {
    id: 'evt-20250428-002',
    run_id: 'run-init',
    t: 1.1,
    type: 'OFFER',
    xid: '0x3a70',
    mac: '02:00:00:00:00:11',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.100',
    offered_gateway: '192.0.2.1',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-01',
    label: 'normal',
    timestampStr: '2025-04-28 14:32:15'
  },
  {
    id: 'evt-20250428-003',
    run_id: 'run-init',
    t: 1.2,
    type: 'REQUEST',
    xid: '0x3a70',
    mac: '02:00:00:00:00:11',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.100',
    device: 'POS-Terminal-01',
    label: 'normal',
    timestampStr: '2025-04-28 14:32:18'
  },
  {
    id: 'evt-20250428-004',
    run_id: 'run-init',
    t: 1.3,
    type: 'ACK',
    xid: '0x3a70',
    mac: '02:00:00:00:00:11',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.100',
    offered_gateway: '192.0.2.1',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-01',
    label: 'normal',
    timestampStr: '2025-04-28 14:32:21'
  },

  // Rogue offer scenario for POS-Terminal-02
  {
    id: 'evt-20250428-005',
    run_id: 'run-init',
    t: 10.0,
    type: 'OFFER',
    xid: '0x3a71',
    mac: '02:00:00:00:00:22',
    server_id: '10.10.10.50',
    offered_ip: '10.10.10.101',
    offered_gateway: '10.10.10.1',
    offered_dns: '1.1.1.1',
    offered_subnet: '255.255.0.0',
    lease_time: 120,
    device: 'POS-Terminal-02',
    label: 'attack',
    timestampStr: '2025-04-28 14:33:02'
  },
  {
    id: 'evt-20250428-006',
    run_id: 'run-init',
    t: 10.1,
    type: 'OFFER',
    xid: '0x3a71',
    mac: '02:00:00:00:00:22',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.102',
    offered_gateway: '192.0.2.1',
    offered_dns: '8.8.8.8',
    offered_subnet: '255.255.255.0',
    lease_time: 86400,
    device: 'POS-Terminal-02',
    label: 'normal',
    timestampStr: '2025-04-28 14:33:04'
  },
  {
    id: 'evt-20250428-007',
    run_id: 'run-init',
    t: 10.2,
    type: 'REQUEST',
    xid: '0x3a71',
    mac: '02:00:00:00:00:22',
    server_id: '10.10.10.50',
    device: 'POS-Terminal-02',
    label: 'normal',
    timestampStr: '2025-04-28 14:33:08'
  },
  {
    id: 'evt-20250428-008',
    run_id: 'run-init',
    t: 10.3,
    type: 'ACK',
    xid: '0x3a71',
    mac: '02:00:00:00:00:22',
    server_id: '10.10.10.50',
    offered_ip: '10.10.10.101',
    offered_gateway: '10.10.10.1',
    offered_dns: '1.1.1.1',
    gateway_mac: '02:00:00:00:00:99',
    device: 'POS-Terminal-02',
    label: 'attack',
    timestampStr: '2025-04-28 14:33:12'
  },

  // Second rogue incident (192.0.2.99)
  {
    id: 'evt-20250428-009',
    run_id: 'run-init',
    t: 14.0,
    type: 'OFFER',
    xid: '0x3a72',
    mac: '02:00:00:00:00:11',
    server_id: '192.0.2.99',
    offered_ip: '192.0.2.150',
    offered_gateway: '192.0.2.254',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-01',
    label: 'attack',
    timestampStr: '2025-04-28 14:32:11'
  },
  {
    id: 'evt-20250428-010',
    run_id: 'run-init',
    t: 14.2,
    type: 'ACK',
    xid: '0x3a72',
    mac: '02:00:00:00:00:11',
    server_id: '192.0.2.99',
    offered_ip: '192.0.2.150',
    offered_gateway: '192.0.2.254',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-01',
    label: 'attack',
    timestampStr: '2025-04-28 14:32:14'
  },

  // Third rogue incident (TunnelVision Option 121 injection)
  {
    id: 'evt-20250428-011',
    run_id: 'run-init',
    t: 18.0,
    type: 'OFFER',
    xid: '0x3a73',
    mac: '02:00:00:00:00:33',
    server_id: '192.0.2.210',
    offered_ip: '192.0.2.220',
    offered_gateway: '192.0.2.254',
    offered_dns: '1.1.1.1',
    option_121: '10.0.0.0/8 via 10.10.10.1',
    device: 'POS-Terminal-03',
    label: 'attack',
    timestampStr: '2025-04-28 14:20:03'
  },

  // Additional normal lease
  {
    id: 'evt-20250428-012',
    run_id: 'run-init',
    t: 22.0,
    type: 'DISCOVER',
    xid: '0x3a74',
    mac: '02:00:00:00:00:33',
    server_id: '-',
    device: 'POS-Terminal-03',
    label: 'normal',
    timestampStr: '2025-04-28 14:35:47'
  },
  {
    id: 'evt-20250428-013',
    run_id: 'run-init',
    t: 22.1,
    type: 'OFFER',
    xid: '0x3a74',
    mac: '02:00:00:00:00:33',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.150',
    offered_gateway: '192.0.2.1',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-03',
    label: 'normal',
    timestampStr: '2025-04-28 14:35:50'
  },
  {
    id: 'evt-20250428-014',
    run_id: 'run-init',
    t: 22.2,
    type: 'REQUEST',
    xid: '0x3a74',
    mac: '02:00:00:00:00:33',
    server_id: '192.0.2.10',
    device: 'POS-Terminal-03',
    label: 'normal',
    timestampStr: '2025-04-28 14:35:54'
  },
  {
    id: 'evt-20250428-015',
    run_id: 'run-init',
    t: 22.3,
    type: 'ACK',
    xid: '0x3a74',
    mac: '02:00:00:00:00:33',
    server_id: '192.0.2.10',
    offered_ip: '192.0.2.150',
    offered_gateway: '192.0.2.1',
    offered_dns: '8.8.8.8',
    device: 'POS-Terminal-03',
    label: 'normal',
    timestampStr: '2025-04-28 14:35:58'
  }
];
