import { 
  NetworkPacket, 
  SecurityAlert, 
  DetectionResult, 
  UploadedDataset, 
  ModelMetrics, 
  NetworkFeaturesForm,
  AttackType,
  SeverityLevel,
  ProtocolType
} from '../types/ids';

// Initial Model Metrics matching screenshot
export const DEFAULT_MODEL_METRICS: ModelMetrics = {
  algorithm: 'Random Forest',
  accuracy: 96.8,
  trainedOn: 'CICIDS2017 Dataset',
  precision: 97.4,
  recall: 95.9,
  f1Score: 96.6,
  rocAuc: 99.1
};

// Initial Seed Alerts matching screenshot
export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'alt-1',
    time: '25 Oct 2026 09:45 AM',
    sourceIp: '192.168.1.45',
    destinationIp: '10.0.0.12',
    type: 'Port Scan',
    severity: 'High',
    protocol: 'TCP',
    confidence: 94.56,
    status: 'Active',
    details: {
      signature: 'ET SCAN Potential Nmap SYN Scan to multiple ports (80, 443, 8080, 22)',
      payloadSnippet: 'TCP [SYN] Seq=0 Win=1024 Len=0 MSS=1460 (Rapid sweep across 128 ports)',
      mitreTechnique: 'T1046 - Network Service Discovery',
      port: 8080,
      packetCount: 340
    }
  },
  {
    id: 'alt-2',
    time: '25 Oct 2026 08:32 AM',
    sourceIp: '192.168.1.23',
    destinationIp: '10.0.0.8',
    type: 'DDoS',
    severity: 'Critical',
    protocol: 'UDP',
    confidence: 98.42,
    status: 'Active',
    details: {
      signature: 'ET DOS High Rate UDP Flood (>15k pps)',
      payloadSnippet: 'UDP SrcPort=53 DstPort=80 Len=1400 [Amplified response payload]',
      mitreTechnique: 'T1498 - Network Denial of Service',
      port: 80,
      packetCount: 15200
    }
  },
  {
    id: 'alt-3',
    time: '24 Oct 2026 11:17 PM',
    sourceIp: '192.168.1.67',
    destinationIp: '10.0.0.5',
    type: 'Brute Force',
    severity: 'High',
    protocol: 'TCP',
    confidence: 93.80,
    status: 'Investigated',
    details: {
      signature: 'ET ATTACK_RESPONSE SSH Failed Password Authentication Spike',
      payloadSnippet: 'SSH-2.0-OpenSSH_8.2p1 User auth failed: root from 192.168.1.67 (45 attempts/min)',
      mitreTechnique: 'T1110 - Brute Force Authentication',
      port: 22,
      packetCount: 210
    }
  },
  {
    id: 'alt-4',
    time: '24 Oct 2026 07:40 PM',
    sourceIp: '192.168.1.90',
    destinationIp: '10.0.0.14',
    type: 'SQL Injection',
    severity: 'Medium',
    protocol: 'TCP',
    confidence: 89.65,
    status: 'Active',
    details: {
      signature: 'ET WEB_SERVER Possible SQL Injection Attempt in Query String',
      payloadSnippet: 'GET /api/v1/users?id=1%27%20UNION%20SELECT%20null,username,password_hash%20FROM%20users--',
      mitreTechnique: 'T1190 - Exploit Public-Facing Application',
      port: 443,
      packetCount: 12
    }
  },
  {
    id: 'alt-5',
    time: '23 Oct 2026 03:12 PM',
    sourceIp: '192.168.1.32',
    destinationIp: '10.0.0.10',
    type: 'Malware',
    severity: 'High',
    protocol: 'TCP',
    confidence: 95.12,
    status: 'Blocked',
    details: {
      signature: 'ET TROJAN Cobalt Strike Beacon Malleable C2 Traffic Detected',
      payloadSnippet: 'POST /submit.php HTTP/1.1 Cookie: user=a8f9c10... Encrypted metadata block',
      mitreTechnique: 'T1071 - Application Layer Protocol C2',
      port: 8443,
      packetCount: 88
    }
  }
];

// Initial Seed Results matching screenshot
export const INITIAL_RESULTS: DetectionResult[] = [
  {
    id: 'res-1',
    timestamp: '25 Oct 2026 09:45 AM',
    sourceIp: '192.168.1.45',
    destinationIp: '10.0.0.12',
    protocol: 'TCP',
    result: 'Intrusion',
    confidence: 94.56,
    attackType: 'Port Scan'
  },
  {
    id: 'res-2',
    timestamp: '25 Oct 2026 09:30 AM',
    sourceIp: '192.168.1.23',
    destinationIp: '10.0.0.8',
    protocol: 'UDP',
    result: 'Normal',
    confidence: 98.73,
    attackType: 'Normal'
  },
  {
    id: 'res-3',
    timestamp: '25 Oct 2026 09:12 AM',
    sourceIp: '192.168.1.67',
    destinationIp: '10.0.0.5',
    protocol: 'TCP',
    result: 'Normal',
    confidence: 97.20,
    attackType: 'Normal'
  },
  {
    id: 'res-4',
    timestamp: '25 Oct 2026 08:50 AM',
    sourceIp: '192.168.1.90',
    destinationIp: '10.0.0.14',
    protocol: 'ICMP',
    result: 'Intrusion',
    confidence: 92.11,
    attackType: 'DDoS'
  },
  {
    id: 'res-5',
    timestamp: '25 Oct 2026 08:20 AM',
    sourceIp: '192.168.1.32',
    destinationIp: '10.0.0.10',
    protocol: 'TCP',
    result: 'Normal',
    confidence: 96.45,
    attackType: 'Normal'
  }
];

// Initial Uploaded Datasets matching screenshot
export const INITIAL_UPLOADS: UploadedDataset[] = [
  {
    id: 'up-1',
    fileName: 'network_data.csv',
    size: '245 KB',
    uploadedOn: '25 Oct 2026, 09:12 AM',
    rowCount: 2450,
    status: 'Ready',
    normalCount: 2190,
    intrusionCount: 260,
    rows: [
      { id: 1, sourceIp: '192.168.1.45', destinationIp: '10.0.0.12', protocol: 'TCP', service: 'http', flag: 'SF', result: 'Normal', confidence: 96.8 },
      { id: 2, sourceIp: '192.168.1.88', destinationIp: '10.0.0.5', protocol: 'TCP', service: 'ssh', flag: 'S0', result: 'Intrusion', confidence: 94.2 },
      { id: 3, sourceIp: '192.168.1.102', destinationIp: '10.0.0.1', protocol: 'UDP', service: 'dns', flag: 'SF', result: 'Normal', confidence: 99.1 },
      { id: 4, sourceIp: '192.168.1.205', destinationIp: '10.0.0.14', protocol: 'ICMP', service: 'eco_i', flag: 'SF', result: 'Intrusion', confidence: 91.5 },
      { id: 5, sourceIp: '192.168.1.15', destinationIp: '10.0.0.8', protocol: 'TCP', service: 'http', flag: 'SF', result: 'Normal', confidence: 98.4 }
    ]
  },
  {
    id: 'up-2',
    fileName: 'test_data.csv',
    size: '180 KB',
    uploadedOn: '24 Oct 2026, 06:45 PM',
    rowCount: 1800,
    status: 'Ready',
    normalCount: 1610,
    intrusionCount: 190,
    rows: [
      { id: 1, sourceIp: '192.168.2.14', destinationIp: '10.0.0.2', protocol: 'TCP', service: 'ftp', flag: 'SF', result: 'Normal', confidence: 95.3 },
      { id: 2, sourceIp: '192.168.2.99', destinationIp: '10.0.0.7', protocol: 'TCP', service: 'telnet', flag: 'RSTO', result: 'Intrusion', confidence: 93.7 },
      { id: 3, sourceIp: '192.168.2.10', destinationIp: '10.0.0.4', protocol: 'UDP', service: 'ntp', flag: 'SF', result: 'Normal', confidence: 98.9 }
    ]
  },
  {
    id: 'up-3',
    fileName: 'sample.csv',
    size: '120 KB',
    uploadedOn: '23 Oct 2026, 03:22 PM',
    rowCount: 1200,
    status: 'Ready',
    normalCount: 1080,
    intrusionCount: 120,
    rows: [
      { id: 1, sourceIp: '192.168.1.50', destinationIp: '10.0.0.3', protocol: 'TCP', service: 'smtp', flag: 'SF', result: 'Normal', confidence: 97.4 },
      { id: 2, sourceIp: '192.168.1.66', destinationIp: '10.0.0.9', protocol: 'TCP', service: 'http', flag: 'REJ', result: 'Intrusion', confidence: 92.8 }
    ]
  }
];

// AI Classification inference function
export function evaluateNetworkFeatures(features: NetworkFeaturesForm): {
  result: 'Normal' | 'Intrusion';
  attackType: AttackType;
  confidence: number;
  severity: SeverityLevel;
  explanation: string;
  indicators: string[];
} {
  const { protocolType, service, flag, duration } = features;

  // Anomaly heuristics based on standard NSL-KDD / CICIDS2017 features
  const isS0Flag = flag === 'S0';
  const isREJFlag = flag === 'REJ';
  const isRSTO = flag === 'RSTO' || flag === 'RSTR';
  const isSF = flag === 'SF';

  // Port Scan detection: SYN packets without completion, rapid attempts
  if (isS0Flag && (service === 'private' || service === 'other' || service === 'finger' || duration === 0)) {
    return {
      result: 'Intrusion',
      attackType: 'Port Scan',
      confidence: 95.42,
      severity: 'High',
      explanation: 'Rapid SYN probe detected without ACK handshakes. Consistent with Nmap stealth reconnaissance scanning open TCP ports.',
      indicators: [
        'Connection Flag S0 indicates incomplete TCP 3-way handshake',
        'Duration = 0 ms with connection reset request',
        'Target port frequency deviates from baseline distribution'
      ]
    };
  }

  // DDoS / Flood detection: S0 or REJ with ICMP or UDP or High duration
  if (isS0Flag || isREJFlag) {
    if (protocolType === 'ICMP' || protocolType === 'UDP') {
      return {
        result: 'Intrusion',
        attackType: 'DDoS',
        confidence: 98.40,
        severity: 'Critical',
        explanation: 'Volumetric packet flood detected overwhelming socket buffer. Flag state indicates target system dropped or rejected incoming bursts.',
        indicators: [
          `Protocol ${protocolType} flooded without established connection state`,
          `Flag ${flag} triggered buffer saturation threshold`,
          'Source IP pattern matches botnet command relay'
        ]
      };
    }
  }

  // SSH / Telnet Brute Force
  if ((service === 'ssh' || service === 'telnet') && (isRSTO || isREJFlag || isS0Flag)) {
    return {
      result: 'Intrusion',
      attackType: 'Brute Force',
      confidence: 93.85,
      severity: 'High',
      explanation: 'Repeated authentication handshake failures across administrative service port within tight timing window.',
      indicators: [
        `Service ${service.toUpperCase()} received anomalous connection tear-down sequence`,
        'High frequency of connection rejections (REJ/RSTO)',
        'Authentication entropy exceeds normal human keystroke interval'
      ]
    };
  }

  // SQL Injection / Web Attack
  if ((service === 'http' || service === 'https') && isRSTO) {
    return {
      result: 'Intrusion',
      attackType: 'SQL Injection',
      confidence: 91.20,
      severity: 'Medium',
      explanation: 'Web application layer reset triggered by Web Application Firewall (WAF) or backend query parsing exception.',
      indicators: [
        'HTTP request terminated abnormally with RSTO flag',
        'Payload contains suspicious syntax operators',
        'Abnormal ratio of response body size to query length'
      ]
    };
  }

  // Malware C2
  if (service === 'IRC' || (service === 'other' && isRSTO)) {
    return {
      result: 'Intrusion',
      attackType: 'Malware',
      confidence: 94.10,
      severity: 'High',
      explanation: 'Beaconing signature detected communicating with unverified external ASN. Flag sequence matches automated C2 heartbeat.',
      indicators: [
        'Known trojan beacon timing jitter pattern detected',
        'Non-standard outbound port utilization',
        'Encrypted payload headers lacking standard TLS handshake SNI'
      ]
    };
  }

  // Normal Traffic (matches 96.32% in screenshot when SF flag + http + duration 0)
  if (isSF) {
    return {
      result: 'Normal',
      attackType: 'Normal',
      confidence: 96.32,
      severity: 'Low',
      explanation: 'Standard network flow completing full TCP SYN-ACK-FIN handshake cycle. Payload sizes and round-trip delays match normal baseline profiles.',
      indicators: [
        'Flag SF confirms normal connection establishment and graceful termination',
        `Service ${service.toUpperCase()} follows RFC protocol specifications`,
        'Traffic frequency within 1.2 standard deviations of normal operations'
      ]
    };
  }

  // Default fallback calculation based on flag
  if (flag === 'SH' || flag === 'RSTR') {
    return {
      result: 'Intrusion',
      attackType: 'SYN Flood',
      confidence: 92.50,
      severity: 'High',
      explanation: 'Anomalous SYN packet half-open states accumulating on listening backlog.',
      indicators: [
        `Flag ${flag} indicates half-open socket starvation`,
        'Target server TCP SYN cookies invoked'
      ]
    };
  }

  return {
    result: 'Normal',
    attackType: 'Normal',
    confidence: 94.80,
    severity: 'Low',
    explanation: 'Network packet features evaluated as non-malicious standard telemetric exchange.',
    indicators: [
      'No anomalous heuristics detected',
      'Protocol headers verified compliant'
    ]
  };
}

// Preset test scenarios for quick testing
export const ATTACK_PRESETS = [
  {
    name: 'Normal Web Traffic',
    category: 'Normal',
    data: {
      duration: 0,
      protocolType: 'TCP' as ProtocolType,
      service: 'http',
      flag: 'SF',
      sourceIp: '192.168.1.105',
      destinationIp: '10.0.0.12'
    }
  },
  {
    name: 'Nmap Port Scan',
    category: 'Intrusion',
    data: {
      duration: 0,
      protocolType: 'TCP' as ProtocolType,
      service: 'private',
      flag: 'S0',
      sourceIp: '192.168.1.45',
      destinationIp: '10.0.0.12'
    }
  },
  {
    name: 'UDP / ICMP DDoS Flood',
    category: 'Intrusion',
    data: {
      duration: 0,
      protocolType: 'UDP' as ProtocolType,
      service: 'domain_u',
      flag: 'S0',
      sourceIp: '192.168.1.23',
      destinationIp: '10.0.0.8'
    }
  },
  {
    name: 'SSH Brute Force',
    category: 'Intrusion',
    data: {
      duration: 2,
      protocolType: 'TCP' as ProtocolType,
      service: 'ssh',
      flag: 'REJ',
      sourceIp: '192.168.1.67',
      destinationIp: '10.0.0.5'
    }
  },
  {
    name: 'SQL Injection Attack',
    category: 'Intrusion',
    data: {
      duration: 1,
      protocolType: 'TCP' as ProtocolType,
      service: 'http',
      flag: 'RSTO',
      sourceIp: '192.168.1.90',
      destinationIp: '10.0.0.14'
    }
  },
  {
    name: 'Normal DNS Query',
    category: 'Normal',
    data: {
      duration: 0,
      protocolType: 'UDP' as ProtocolType,
      service: 'dns',
      flag: 'SF',
      sourceIp: '192.168.1.18',
      destinationIp: '10.0.0.1'
    }
  }
];

// Sound Synthesizer via Web Audio API (graceful, no assets required)
export function playAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play subtle dual tone warning
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc2.frequency.setValueAtTime(1174, ctx.currentTime); // D6
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio permission or context restrictions
  }
}
