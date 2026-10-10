import React, { useState } from 'react';
import { 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Cpu, 
  FileCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { NetworkFeaturesForm, ProtocolType, AttackType, SeverityLevel } from '../types/ids';
import { evaluateNetworkFeatures, ATTACK_PRESETS } from '../services/idsEngine';

interface DetectViewProps {
  onAddDetectionResult: (result: {
    sourceIp: string;
    destinationIp: string;
    protocol: ProtocolType;
    result: 'Normal' | 'Intrusion';
    confidence: number;
    attackType: AttackType;
  }) => void;
  onBlockIp: (ip: string, reason: string) => void;
}

export const DetectView: React.FC<DetectViewProps> = ({
  onAddDetectionResult,
  onBlockIp,
}) => {
  // Form feature inputs matching screenshot
  const [duration, setDuration] = useState<number>(0);
  const [protocolType, setProtocolType] = useState<ProtocolType>('TCP');
  const [service, setService] = useState<string>('http');
  const [flag, setFlag] = useState<string>('SF');

  // Optional telemetry attributes
  const [sourceIp, setSourceIp] = useState<string>('192.168.1.105');
  const [destinationIp, setDestinationIp] = useState<string>('10.0.0.12');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [sourceBytes, setSourceBytes] = useState<number>(232);
  const [destinationBytes, setDestinationBytes] = useState<number>(8150);

  // Inference state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<{
    result: 'Normal' | 'Intrusion';
    attackType: AttackType;
    confidence: number;
    severity: SeverityLevel;
    explanation: string;
    indicators: string[];
  } | null>({
    // Default initial prediction matching screenshot: Normal Traffic, 96.32%
    result: 'Normal',
    attackType: 'Normal',
    confidence: 96.32,
    severity: 'Low',
    explanation: 'Standard network flow completing full TCP SYN-ACK-FIN handshake cycle. Payload sizes and round-trip delays match normal baseline profiles.',
    indicators: [
      'Flag SF confirms normal connection establishment and graceful termination',
      'Service HTTP follows standard RFC 7230 protocol specifications',
      'Traffic frequency within 1.2 standard deviations of normal operations'
    ]
  });

  const handleRunDetection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      const evaluation = evaluateNetworkFeatures({
        duration,
        protocolType,
        service,
        flag,
        sourceBytes,
        destinationBytes
      });

      setPrediction(evaluation);
      setIsAnalyzing(false);

      // Record this result in the central Results repository
      onAddDetectionResult({
        sourceIp: sourceIp || '192.168.1.100',
        destinationIp: destinationIp || '10.0.0.12',
        protocol: protocolType,
        result: evaluation.result,
        confidence: evaluation.confidence,
        attackType: evaluation.attackType
      });
    }, 450);
  };

  const handleApplyPreset = (preset: typeof ATTACK_PRESETS[0]) => {
    setDuration(preset.data.duration);
    setProtocolType(preset.data.protocolType);
    setService(preset.data.service);
    setFlag(preset.data.flag);
    setSourceIp(preset.data.sourceIp);
    setDestinationIp(preset.data.destinationIp);

    // Auto-run detection for instant feedback
    setIsAnalyzing(true);
    setTimeout(() => {
      const evaluation = evaluateNetworkFeatures(preset.data);
      setPrediction(evaluation);
      setIsAnalyzing(false);

      onAddDetectionResult({
        sourceIp: preset.data.sourceIp,
        destinationIp: preset.data.destinationIp,
        protocol: preset.data.protocolType,
        result: evaluation.result,
        confidence: evaluation.confidence,
        attackType: evaluation.attackType
      });
    }, 350);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            AI Detection
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inference using trained Random Forest & Deep Feature Classifier (CICIDS2017).
          </p>
        </div>

        {/* Quick Presets Pill Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Presets:
          </span>
          {ATTACK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all ${
                preset.category === 'Intrusion'
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top Feature Card matching Screenshot 4. Detection / Prediction Page */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Enter Network Features
        </h2>

        <form onSubmit={handleRunDetection} className="space-y-5">
          {/* 4 Feature Columns matching Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duration
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Connection lifetime in seconds</span>
            </div>

            {/* 2. Protocol Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Protocol Type
              </label>
              <select
                value={protocolType}
                onChange={(e) => setProtocolType(e.target.value as ProtocolType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Transport protocol layer</span>
            </div>

            {/* 3. Service */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="http">http</option>
                <option value="dns">dns</option>
                <option value="ssh">ssh</option>
                <option value="ftp">ftp</option>
                <option value="smtp">smtp</option>
                <option value="telnet">telnet</option>
                <option value="domain_u">domain_u</option>
                <option value="private">private</option>
                <option value="eco_i">eco_i</option>
                <option value="other">other</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Target network service/daemon</span>
            </div>

            {/* 4. Flag */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Flag
              </label>
              <select
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SF">SF (Normal Connection Established & Closed)</option>
                <option value="S0">S0 (SYN Sent, No ACK Received)</option>
                <option value="REJ">REJ (Connection Rejected by Host)</option>
                <option value="RSTO">RSTO (Reset Sent by Originator)</option>
                <option value="RSTR">RSTR (Reset Sent by Responder)</option>
                <option value="SH">SH (SYN Sent with Half-Open)</option>
                <option value="S1">S1 (SYN Acknowledged without Payload)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">TCP socket status flag</span>
            </div>
          </div>

          {/* Toggle Advanced Telemetry */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              <span>{showAdvanced ? 'Hide IP & Flow Details' : '+ Show IP & Flow Details'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Source IP</label>
                  <input
                    type="text"
                    value={sourceIp}
                    onChange={(e) => setSourceIp(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Destination IP</label>
                  <input
                    type="text"
                    value={destinationIp}
                    onChange={(e) => setDestinationIp(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Source Bytes</label>
                  <input
                    type="number"
                    value={sourceBytes}
                    onChange={(e) => setSourceBytes(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Destination Bytes</label>
                  <input
                    type="number"
                    value={destinationBytes}
                    onChange={(e) => setDestinationBytes(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Run Detection Button matching Screenshot */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <ScanLine className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Evaluating Signatures...' : 'Run Detection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Result Card matching Screenshot 4 */}
      {prediction && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            
            {/* Left Big Status Icon & Title matching Screenshot */}
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  prediction.result === 'Normal'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {prediction.result === 'Normal' ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <AlertTriangle className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Prediction Result
                </span>
                <div
                  className={`text-2xl font-bold tracking-tight mt-0.5 ${
                    prediction.result === 'Normal' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {prediction.result === 'Normal' ? 'Normal Traffic' : `Intrusion: ${prediction.attackType}`}
                </div>
                <div className="text-sm font-semibold text-slate-700 mt-1">
                  Confidence: <span className="font-mono">{prediction.confidence.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Right Detailed Explanations & Indicators */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Security Assessment:</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    prediction.severity === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : prediction.severity === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : prediction.severity === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {prediction.severity.toUpperCase()} RISK
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-sans">
                {prediction.explanation}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1.5">
                  Decision Tree Indicators:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {prediction.indicators.map((ind, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {prediction.result === 'Intrusion' && (
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onBlockIp(sourceIp, `AI Intrusion: ${prediction.attackType}`)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Block Source IP ({sourceIp})
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
