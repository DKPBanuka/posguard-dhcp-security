export type RouteId = 'overview' | 'scoring' | 'monitor' | 'alerts' | 'eval' | 'guide' | 'backend' | 'lab';

export type DhcpMessageType = 'DISCOVER' | 'OFFER' | 'REQUEST' | 'ACK';

export interface DhcpEvent {
  id: string;
  run_id: string;
  t: number; // seconds
  type: DhcpMessageType;
  xid: string;
  mac: string;
  server_id: string; // IP or '-'
  offered_gateway?: string;
  offered_dns?: string;
  offered_ip?: string;
  offered_subnet?: string;
  lease_time?: number;
  option_121?: string; // Classless static route e.g. "10.0.0.0/8 via 10.10.10.1" (TunnelVision)
  gateway_mac?: string; // Hardware MAC of gateway
  label: 'normal' | 'attack';
  flagged?: boolean;
  rule?: string;
  rule_code?: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';
  details?: string;
  timestampStr?: string;
  device?: string;
}

export interface DhcpAlert {
  id: string;
  event_id: string;
  t: number;
  rule: string;
  rule_code?: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  created_at: string;
  suspected_server?: string;
  affected_device?: string;
  status: 'new' | 'investigating' | 'resolved';
  xid?: string;
  type?: DhcpMessageType;
  evidence?: string[];
  observed_config?: {
    dhcp_server: string;
    gateway: string;
    dns: string;
  };
  expected_config?: {
    dhcp_server: string;
    gateway: string;
    dns: string;
  };
}

export interface CandidateVulnerability {
  rank: number;
  id: string;
  name: string;
  E: number;
  S: number;
  I: number;
  R: number;
  D: number;
  F: number;
  gate_g2: 'pass' | 'fragile pass' | 'fail';
  isTarget?: boolean;
  R_lo: number;
  R_hi: number;
  reason: string;
  evidence_grades: {
    E: 'A' | 'B' | 'C';
    S: 'A' | 'B' | 'C';
    I: 'A' | 'B' | 'C';
    D: 'A' | 'B' | 'C';
    F: 'A' | 'B' | 'C';
  };
}

export interface EvaluationMetrics {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  precision: number;
  recall: number;
  f1: number;
  totalEvents: number;
  totalAlerts: number;
}

