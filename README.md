# POSGuard: Real-Time DHCP Threat Detection & Cyber SOC for Merchant POS Networks

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Security Engine](https://img.shields.io/badge/Detection%20Rules-R1%E2%80%93R9-emerald.svg)]()

**POSGuard** is a lightweight, pure in-memory DHCP intrusion detection and security monitoring platform designed specifically for merchant Point-of-Sale (POS) local area networks. Under flat, unsegmented access environments (**Scenario C1 Testbed**), POS terminals are acutely vulnerable to rogue DHCP servers racing malicious leases, DNS poisoning, and gateway diversion attacks.

POSGuard provides sub-millisecond DHCP packet analysis, automated threat triage, Option 121 (TunnelVision / CVE-2024-3661) mitigation, and an interactive Cyber SOC Command Center.

---

## 🛡️ Core Capabilities

- **R1–R9 Detection Engine**: Pure in-memory deterministic rule engine operating with $O(1)$ packet evaluation and sub-millisecond detection latency.
- **Option 121 (TunnelVision / CVE-2024-3661) Defense**: Detects unauthorized Classless Static Route pushes aimed at circumventing VPNs and perimeter gateways.
- **Rogue Server Contention Detection (R2)**: Identifies conflicting `DHCPOFFER` frames for identical transaction identifiers (`XID`).
- **Interactive Network Topology Lab**: Full-width interactive network tree visualization depicting WAN Uplink, Perimeter Gateway, Core & Edge Switches, POS registers, and rogue insertion beacons.
- **Live SOC Telemetry & Traffic Waves**: Dual-curve bandwidth monitoring (Download/Upload) alongside real-time radial DHCP address pool exhaustion indicators.
- **Risk Ranking & Prioritization Matrix**: Multi-vector threat scoring (Table 6.1) weighting severity, weaponization confidence, and business impact.
- **Comprehensive Evaluation Metrics**: Live Confusion Matrix (TP, FP, TN, FN), Precision, Recall, F1-Score, and latency benchmarking.

---

## 📋 Active Detection Rules (R1–R9 Matrix)

| Rule | Detection Name | Threat Mechanism & Description |
| :---: | :--- | :--- |
| **R1** | **Untrusted DHCP Server** | Flags any `DHCPOFFER` or `DHCPACK` originating from an unapproved server IP. |
| **R2** | **Server Contention** | Multiple competing DHCP servers respond to a single `DHCPDISCOVER` transaction ID (`XID`). |
| **R3** | **Gateway Divergence** | Offered default router does not match the authorized merchant gateway (`192.0.2.1`). |
| **R4** | **DNS Resolver Hijack** | Offered DNS resolver diverges from trusted servers (`8.8.8.8`, `1.1.1.1`). |
| **R5** | **Subnet Mask Mismatch** | Lease offers an abnormal subnet mask outside expected merchant CIDR range. |
| **R6** | **Abnormal Lease Duration** | Abnormally short (< 300s) or extended lease time indicative of malicious lease churn. |
| **R7** | **Option 121 Static Routes (TunnelVision)**| Malicious RFC 3442 Classless Static Routes injected to route POS traffic through rogue hops. |
| **R8** | **DHCP Starvation Flood** | Rapid burst of `DHCPDISCOVER` frames with randomized MAC addresses to exhaust pool. |
| **R9** | **Gateway MAC Alteration** | ARP / Layer 2 MAC address change detected for the gateway following an offer. |

---

## 🏗️ System Architecture

```text
                            [ 🌐 Internet / WAN ]
                                      │
                         [ 🛡️ Perimeter Firewall / Gateway ]
                                  (192.0.2.1)
                                      │
          ┌───────────────────────────┴───────────────────────────┐
          │                                                       │
   [ Switch-01 ]                                           [ Switch-02 ]
  (Merchant Access)                                       (Core Services)
          │                                                       │
    ┌─────┴─────┐                                           ┌─────┴─────┐
    │           │                                           │           │
 [POS-01]  [Receipt Printer]                    [Authorized DHCP]  [POSGuard Sensor]
(192.0.2.11) (192.0.2.15)                         (192.0.2.10)       (192.0.2.20)
                                                                        ▲
                                                                  Layer 2 Sniffer
                                                                 (Promiscuous Mode)
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/posguard-dhcp-security.git
cd posguard-dhcp-security
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open your browser at `http://localhost:4100` to interact with the POSGuard SOC dashboard.

---

## 🧪 Simulation Controls

From the global simulation bar, security researchers can trigger:
- **Normal Lease**: Legitimate 4-way DORA handshake with authorized anchor.
- **Rogue Offer**: High-speed race condition triggering **R1**, **R2**, **R3**, and **R4**.
- **Starvation Burst**: Rapid DISCOVER flood triggering **R8**.
- **TunnelVision**: RFC 3442 Option 121 injection and Gateway MAC alteration triggering **R7** and **R9**.

---

## 📄 License

Academic and Research License - Developed for POS Network Security Research.
