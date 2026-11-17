import React from 'react';
import { Server, Terminal, Database, Code, CheckCircle2, FileUp, Cpu, Network } from 'lucide-react';

export const BackendProposalView: React.FC = () => {
  const pythonFastApiCode = `from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scapy.all import rdpcap, DHCP, BOOTP, IP, Ether, sniff
import sqlite3
import time

app = FastAPI(title="POSGuard Backend", version="2.0.0")

# SQLite persistence for events and alerts
conn = sqlite3.connect("posguard_research.db", check_same_thread=False)

def parse_dhcp_packet(packet, trusted_server: str):
    if not packet.haslayer(DHCP):
        return None
    
    # Extract DHCP Options
    options = dict(packet[DHCP].options)
    msg_type_code = options.get('message-type')
    types_map = {1: 'DISCOVER', 2: 'OFFER', 3: 'REQUEST', 4: 'DECLINE', 5: 'ACK', 6: 'NAK'}
    msg_type = types_map.get(msg_type_code, 'UNKNOWN')
    
    server_id = options.get('server_id', '-')
    offered_gateway = options.get('router', '-')
    offered_dns = options.get('name_server', '-')
    
    is_flagged = False
    rule_fired = None
    
    # Rule 1: Rogue DHCP Server
    if msg_type in ['OFFER', 'ACK'] and server_id != '-' and server_id != trusted_server:
        is_flagged = True
        rule_fired = "untrusted server"
        
    return {
        "xid": hex(packet[BOOTP].xid),
        "type": msg_type,
        "mac": packet[Ether].src,
        "server_id": str(server_id),
        "offered_gateway": str(offered_gateway),
        "offered_dns": str(offered_dns),
        "flagged": is_flagged,
        "rule": rule_fired
    }

@app.post("/api/pcap/upload")
async def analyze_pcap(file: UploadFile = File(...), trusted_server: str = "192.0.2.10"):
    contents = await file.read()
    with open("temp.pcap", "wb") as f:
        f.write(contents)
        
    packets = rdpcap("temp.pcap")
    events = []
    for pkt in packets:
        parsed = parse_dhcp_packet(pkt, trusted_server)
        if parsed:
            events.append(parsed)
            
    return {"status": "success", "total_packets": len(packets), "events": events}`;

  const sqliteSchema = `CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    scenario TEXT NOT NULL,
    seed INTEGER DEFAULT 42,
    trusted_server TEXT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    run_id TEXT REFERENCES runs(id),
    t REAL NOT NULL,
    type TEXT NOT NULL,
    xid TEXT NOT NULL,
    mac TEXT NOT NULL,
    server_id TEXT NOT NULL,
    offered_gateway TEXT,
    offered_dns TEXT,
    lease_time INTEGER,
    label TEXT CHECK(label IN ('normal', 'attack')),
    flagged BOOLEAN DEFAULT 0,
    rule TEXT
);

CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id),
    rule TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Backend Architecture Proposal (Phase 2)
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
            FastAPI + Scapy + SQLite
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specification for transitioning from browser in-memory simulation to physical PCAP analysis and live mirror-port interface sniffing (Section 8).
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-400 flex items-center justify-center mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">FastAPI High-Speed Async Engine</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Handles asynchronous file uploads for heavy multi-gigabyte PCAP traces and provides WebSocket endpoints for real-time telemetry streaming.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Scapy Low-Level Dissector</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep inspection of Layer 2/3/7 DHCP options (53, 54, 1, 3, 6) directly from Ethernet frames without socket privilege escalation.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400 flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">SQLite Relational Trace Store</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Relational tables storing runs, events, and alerts with foreign key integrity, allowing reproducible regression benchmarks.
          </p>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Python FastAPI */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono font-bold text-brand-400">api_server.py (FastAPI + Scapy)</span>
              <span className="text-[10px] text-slate-500 uppercase">Python 3.11</span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-96">
              {pythonFastApiCode}
            </pre>
          </div>
        </div>

        {/* SQLite Schema */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400">schema.sql (Data Model Section 5)</span>
              <span className="text-[10px] text-slate-500 uppercase">SQLite 3</span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-96">
              {sqliteSchema}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
