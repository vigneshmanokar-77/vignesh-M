export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'DNS' | 'SSH';

export type AttackType = 
  | 'Normal'
  | 'Port Scan'
  | 'DDoS'
  | 'Brute Force'
  | 'SQL Injection'
  | 'Malware'
  | 'SYN Flood'
  | 'ICMP Flood'
  | 'DNS Amplification'
  | 'XSS Attack';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: ProtocolType;
  service: string;
  flag: string;
  duration: number;
  sourceBytes?: number;
  destinationBytes?: number;
  result: 'Normal' | 'Intrusion';
  attackType: AttackType;
  confidence: number;
  severity?: SeverityLevel;
}

export interface SecurityAlert {
  id: string;
  time: string;
  sourceIp: string;
  destinationIp: string;
  type: AttackType;
  severity: SeverityLevel;
  protocol: ProtocolType;
  confidence: number;
  status: 'Active' | 'Investigated' | 'Blocked';
  details?: {
    signature?: string;
    payloadSnippet?: string;
    mitreTechnique?: string;
    port?: number;
    packetCount?: number;
  };
}

export interface UploadedDataset {
  id: string;
  fileName: string;
  size: string;
  uploadedOn: string;
  rowCount: number;
  status: 'Ready' | 'Processing';
  normalCount: number;
  intrusionCount: number;
  rows?: Array<{
    id: number;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    service: string;
    flag: string;
    result: 'Normal' | 'Intrusion';
    confidence: number;
  }>;
}

export interface DetectionResult {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: ProtocolType;
  result: 'Normal' | 'Intrusion';
  confidence: number;
  attackType?: AttackType;
}

export interface NetworkFeaturesForm {
  duration: number;
  protocolType: ProtocolType;
  service: string;
  flag: string;
  sourceIp?: string;
  destinationIp?: string;
  sourceBytes?: number;
  destinationBytes?: number;
  count?: number;
  srvCount?: number;
}

export interface ModelMetrics {
  algorithm: string;
  accuracy: number;
  trainedOn: string;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface BlockedRule {
  id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
}
