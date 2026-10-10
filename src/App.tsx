import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { NetworkDataView } from './components/NetworkDataView';
import { DetectView } from './components/DetectView';
import { AlertsView } from './components/AlertsView';
import { ResultsView } from './components/ResultsView';
import { FirewallView } from './components/FirewallView';
import { PacketModal } from './components/PacketModal';

import { 
  NetworkPacket, 
  SecurityAlert, 
  DetectionResult, 
  UploadedDataset, 
  BlockedRule,
  ProtocolType,
  AttackType,
  SeverityLevel
} from './types/ids';

import { 
  INITIAL_ALERTS, 
  INITIAL_RESULTS, 
  INITIAL_UPLOADS, 
  DEFAULT_MODEL_METRICS,
  playAlertSound,
  evaluateNetworkFeatures
} from './services/idsEngine';

export default function App() {
  // Authentication State (defaults to false so user sees Login and Sign Up page)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ids_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    try {
      return sessionStorage.getItem('ids_user_name') || 'Deepika';
    } catch {
      return 'Deepika';
    }
  });
  const [currentUserRole, setCurrentUserRole] = useState<string>(() => {
    try {
      return sessionStorage.getItem('ids_user_role') || 'Lead Security Analyst';
    } catch {
      return 'Lead Security Analyst';
    }
  });

  const handleLoginSuccess = (user: { name: string; role: string }) => {
    setCurrentUser(user.name);
    setCurrentUserRole(user.role);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('ids_auth', 'true');
      sessionStorage.setItem('ids_user_name', user.name);
      sessionStorage.setItem('ids_user_role', user.role);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('ids_auth');
    } catch {
      // ignore
    }
  };

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Statistics matching initial screenshot state
  const [totalPackets, setTotalPackets] = useState<number>(1248);
  const [normalPackets, setNormalPackets] = useState<number>(1102);
  const [intrusionPackets, setIntrusionPackets] = useState<number>(146);

  // Real-Time Streaming State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [recentPackets, setRecentPackets] = useState<NetworkPacket[]>([
    {
      id: 'pkt-init-1',
      timestamp: '10:24:02 AM',
      sourceIp: '192.168.1.45',
      destinationIp: '10.0.0.12',
      protocol: 'TCP',
      service: 'http',
      flag: 'S0',
      duration: 0,
      result: 'Intrusion',
      attackType: 'Port Scan',
      confidence: 94.56,
      severity: 'High'
    },
    {
      id: 'pkt-init-2',
      timestamp: '10:23:58 AM',
      sourceIp: '192.168.1.102',
      destinationIp: '10.0.0.1',
      protocol: 'UDP',
      service: 'dns',
      flag: 'SF',
      duration: 0,
      result: 'Normal',
      attackType: 'Normal',
      confidence: 98.73,
      severity: 'Low'
    },
    {
      id: 'pkt-init-3',
      timestamp: '10:23:51 AM',
      sourceIp: '192.168.1.67',
      destinationIp: '10.0.0.5',
      protocol: 'TCP',
      service: 'http',
      flag: 'SF',
      duration: 1,
      result: 'Normal',
      attackType: 'Normal',
      confidence: 97.20,
      severity: 'Low'
    },
    {
      id: 'pkt-init-4',
      timestamp: '10:23:42 AM',
      sourceIp: '192.168.1.90',
      destinationIp: '10.0.0.14',
      protocol: 'ICMP',
      service: 'eco_i',
      flag: 'REJ',
      duration: 0,
      result: 'Intrusion',
      attackType: 'DDoS',
      confidence: 92.11,
      severity: 'Critical'
    },
    {
      id: 'pkt-init-5',
      timestamp: '10:23:35 AM',
      sourceIp: '192.168.1.32',
      destinationIp: '10.0.0.10',
      protocol: 'TCP',
      service: 'http',
      flag: 'SF',
      duration: 0,
      result: 'Normal',
      attackType: 'Normal',
      confidence: 96.45,
      severity: 'Low'
    }
  ]);

  // Data Collections
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [results, setResults] = useState<DetectionResult[]>(INITIAL_RESULTS);
  const [datasets, setDatasets] = useState<UploadedDataset[]>(INITIAL_UPLOADS);
  const [blockedRules, setBlockedRules] = useState<BlockedRule[]>([
    {
      id: 'blk-1',
      ip: '192.168.1.32',
      reason: 'Malware C2 Beaconing signature detected',
      blockedAt: '23 Oct 2026, 03:15 PM',
      blockedBy: 'Auto-IDS Rule'
    }
  ]);

  // Modals
  const [inspectedAlert, setInspectedAlert] = useState<SecurityAlert | null>(null);
  const [inspectedDataset, setInspectedDataset] = useState<UploadedDataset | null>(null);

  // Derived Alert Rate
  const alertRate = totalPackets > 0 ? (intrusionPackets / totalPackets) * 100 : 11.7;

  // Real-time packet generator loop
  useEffect(() => {
    if (!isStreaming || !isAuthenticated) return;

    const interval = setInterval(() => {
      // 85% normal traffic, 15% intrusion traffic simulation
      const isThreat = Math.random() < 0.15;
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });

      const normalIps = ['192.168.1.15', '192.168.1.52', '192.168.1.84', '192.168.1.110', '192.168.1.144'];
      const threatIps = ['192.168.1.201', '192.168.1.215', '192.168.1.230', '192.168.1.244'];
      const targetIps = ['10.0.0.2', '10.0.0.5', '10.0.0.8', '10.0.0.12', '10.0.0.15'];

      const protocols: ProtocolType[] = ['TCP', 'UDP', 'ICMP'];
      const services = ['http', 'dns', 'ssh', 'ftp', 'smtp'];

      const srcIp = isThreat 
        ? threatIps[Math.floor(Math.random() * threatIps.length)]
        : normalIps[Math.floor(Math.random() * normalIps.length)];
      
      const dstIp = targetIps[Math.floor(Math.random() * targetIps.length)];
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const srv = isThreat ? (Math.random() > 0.5 ? 'ssh' : 'http') : services[Math.floor(Math.random() * services.length)];
      const flag = isThreat ? (Math.random() > 0.5 ? 'S0' : 'REJ') : 'SF';

      const evaluation = evaluateNetworkFeatures({
        duration: isThreat ? 0 : Math.floor(Math.random() * 3),
        protocolType: proto,
        service: srv,
        flag: flag
      });

      const newPacket: NetworkPacket = {
        id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        sourceIp: srcIp,
        destinationIp: dstIp,
        protocol: proto,
        service: srv,
        flag: flag,
        duration: isThreat ? 0 : 1,
        result: evaluation.result,
        attackType: evaluation.attackType,
        confidence: evaluation.confidence,
        severity: evaluation.severity
      };

      // Check if blocked in firewall
      const isBlocked = blockedRules.some(r => r.ip === srcIp);
      if (isBlocked) {
        // Drop packet silently
        return;
      }

      // Update counters
      setTotalPackets(prev => prev + 1);
      if (evaluation.result === 'Normal') {
        setNormalPackets(prev => prev + 1);
      } else {
        setIntrusionPackets(prev => prev + 1);
        if (soundEnabled) {
          playAlertSound();
        }

        // Add to active alerts table
        const newAlert: SecurityAlert = {
          id: `alt-${Date.now()}`,
          time: new Date().toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          sourceIp: srcIp,
          destinationIp: dstIp,
          type: evaluation.attackType,
          severity: evaluation.severity,
          protocol: proto,
          confidence: evaluation.confidence,
          status: 'Active',
          details: {
            signature: `Real-time Anomaly Detected: ${evaluation.explanation}`,
            payloadSnippet: `Proto=${proto} Flag=${flag} Target=${dstIp} Conf=${evaluation.confidence.toFixed(1)}%`,
            mitreTechnique: evaluation.attackType === 'Port Scan' ? 'T1046' : evaluation.attackType === 'DDoS' ? 'T1498' : 'T1110',
            port: 80,
            packetCount: 1
          }
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      }

      // Add to recent packets
      setRecentPackets(prev => [newPacket, ...prev.slice(0, 9)]);

      // Add to results table
      setResults(prev => [
        {
          id: `res-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          sourceIp: srcIp,
          destinationIp: dstIp,
          protocol: proto,
          result: evaluation.result,
          confidence: evaluation.confidence,
          attackType: evaluation.attackType
        },
        ...prev.slice(0, 49)
      ]);

    }, 2800); // 2.8s interval for smooth natural real-time streaming

    return () => clearInterval(interval);
  }, [isStreaming, isAuthenticated, soundEnabled, blockedRules]);

  // Handler for simulating sudden attack burst
  const handleSimulateAttack = (type: 'Port Scan' | 'DDoS' | 'SQL Injection' | 'Brute Force') => {
    const attackSrc = `192.168.1.${Math.floor(Math.random() * 80) + 150}`;
    const target = '10.0.0.12';
    const proto: ProtocolType = type === 'DDoS' ? 'UDP' : 'TCP';
    const sev: SeverityLevel = type === 'DDoS' ? 'Critical' : 'High';

    if (soundEnabled) {
      playAlertSound();
    }

    setTotalPackets(prev => prev + 12);
    setIntrusionPackets(prev => prev + 12);

    const newAlert: SecurityAlert = {
      id: `alt-sim-${Date.now()}`,
      time: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      sourceIp: attackSrc,
      destinationIp: target,
      type: type,
      severity: sev,
      protocol: proto,
      confidence: 97.8,
      status: 'Active',
      details: {
        signature: `CRITICAL INTRUSION BURST: ${type} attack vectors detected across interface`,
        payloadSnippet: `Burst simulation trigger: 12 malicious frames identified from ${attackSrc}`,
        mitreTechnique: type === 'DDoS' ? 'T1498' : type === 'Port Scan' ? 'T1046' : 'T1190',
        port: 80,
        packetCount: 12
      }
    };

    setAlerts(prev => [newAlert, ...prev]);

    setRecentPackets(prev => [
      {
        id: `pkt-sim-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: true }),
        sourceIp: attackSrc,
        destinationIp: target,
        protocol: proto,
        service: 'http',
        flag: 'S0',
        duration: 0,
        result: 'Intrusion',
        attackType: type,
        confidence: 97.8,
        severity: sev
      },
      ...prev.slice(0, 9)
    ]);

    setResults(prev => [
      {
        id: `res-sim-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        sourceIp: attackSrc,
        destinationIp: target,
        protocol: proto,
        result: 'Intrusion',
        confidence: 97.8,
        attackType: type
      },
      ...prev
    ]);
  };

  // Firewall actions
  const handleBlockIp = (ip: string, reason: string) => {
    if (blockedRules.some(r => r.ip === ip)) return;
    const newRule: BlockedRule = {
      id: `blk-${Date.now()}`,
      ip,
      reason: reason || 'Detected by AI Intrusion Classifier',
      blockedAt: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      blockedBy: currentUser || 'Deepika'
    };
    setBlockedRules(prev => [newRule, ...prev]);
    // Also update alert status
    setAlerts(prev => prev.map(a => a.sourceIp === ip ? { ...a, status: 'Blocked' } : a));
  };

  const handleUnblockRule = (id: string) => {
    setBlockedRules(prev => prev.filter(r => r.id !== id));
  };

  // Manual Network Data submit
  const handleManualSubmit = (data: { sourceIp: string; destinationIp: string; protocol: ProtocolType }) => {
    const evaluation = evaluateNetworkFeatures({
      duration: 0,
      protocolType: data.protocol,
      service: 'http',
      flag: 'SF'
    });

    setTotalPackets(prev => prev + 1);
    if (evaluation.result === 'Normal') {
      setNormalPackets(prev => prev + 1);
    } else {
      setIntrusionPackets(prev => prev + 1);
    }

    setResults(prev => [
      {
        id: `res-man-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        sourceIp: data.sourceIp,
        destinationIp: data.destinationIp,
        protocol: data.protocol,
        result: evaluation.result,
        confidence: evaluation.confidence,
        attackType: evaluation.attackType
      },
      ...prev
    ]);
  };

  // Add detection result from Detect view
  const handleAddDetectionResult = (item: {
    sourceIp: string;
    destinationIp: string;
    protocol: ProtocolType;
    result: 'Normal' | 'Intrusion';
    confidence: number;
    attackType: AttackType;
  }) => {
    setTotalPackets(prev => prev + 1);
    if (item.result === 'Normal') {
      setNormalPackets(prev => prev + 1);
    } else {
      setIntrusionPackets(prev => prev + 1);
      if (soundEnabled) {
        playAlertSound();
      }

      // Add to alerts
      const newAlert: SecurityAlert = {
        id: `alt-det-${Date.now()}`,
        time: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        sourceIp: item.sourceIp,
        destinationIp: item.destinationIp,
        type: item.attackType,
        severity: item.attackType === 'DDoS' ? 'Critical' : 'High',
        protocol: item.protocol,
        confidence: item.confidence,
        status: 'Active',
        details: {
          signature: `Manual AI Feature Inspection identified ${item.attackType}`,
          payloadSnippet: `Protocol: ${item.protocol} evaluated against Random Forest model`,
          mitreTechnique: 'T1046',
          port: 80,
          packetCount: 1
        }
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    setResults(prev => [
      {
        id: `res-det-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        sourceIp: item.sourceIp,
        destinationIp: item.destinationIp,
        protocol: item.protocol,
        result: item.result,
        confidence: item.confidence,
        attackType: item.attackType
      },
      ...prev
    ]);
  };

  // Uploaded dataset actions
  const handleUploadDataset = (ds: UploadedDataset) => {
    setDatasets(prev => [ds, ...prev]);
    setTotalPackets(prev => prev + ds.rowCount);
    setNormalPackets(prev => prev + ds.normalCount);
    setIntrusionPackets(prev => prev + ds.intrusionCount);
  };

  const handleDeleteDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
  };

  // If not logged in, render Login & Sign Up View
  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        userName={currentUser}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeAlertCount={alerts.filter(a => a.status === 'Active').length}
        onNavigateToAlerts={() => setActiveTab('alerts')}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={alerts.filter(a => a.status === 'Active').length}
          blockedCount={blockedRules.length}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                userName={currentUser}
                userRole={currentUserRole}
                totalPackets={totalPackets}
                normalPackets={normalPackets}
                intrusionPackets={intrusionPackets}
                alertRate={alertRate}
                recentPackets={recentPackets}
                isStreaming={isStreaming}
                onSimulateAttack={handleSimulateAttack}
                onBlockIp={handleBlockIp}
              />
            )}

            {activeTab === 'network-data' && (
              <NetworkDataView
                datasets={datasets}
                onUploadDataset={handleUploadDataset}
                onDeleteDataset={handleDeleteDataset}
                onManualSubmit={handleManualSubmit}
                onViewDataset={(ds) => setInspectedDataset(ds)}
              />
            )}

            {activeTab === 'detect' && (
              <DetectView
                onAddDetectionResult={handleAddDetectionResult}
                onBlockIp={handleBlockIp}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onViewAlert={(alt) => setInspectedAlert(alt)}
                onBlockIp={handleBlockIp}
                onDismissAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
                onClearAllAlerts={() => setAlerts([])}
              />
            )}

            {activeTab === 'results' && (
              <ResultsView
                results={results}
                modelMetrics={DEFAULT_MODEL_METRICS}
              />
            )}

            {activeTab === 'firewall' && (
              <FirewallView
                blockedRules={blockedRules}
                onAddRule={handleBlockIp}
                onRemoveRule={handleUnblockRule}
              />
            )}
          </div>
        </main>
      </div>

      {/* Forensic Inspection Modal for Alerts or Datasets */}
      <PacketModal
        alert={inspectedAlert}
        dataset={inspectedDataset}
        onClose={() => {
          setInspectedAlert(null);
          setInspectedDataset(null);
        }}
        onBlockIp={handleBlockIp}
      />
    </div>
  );
}
