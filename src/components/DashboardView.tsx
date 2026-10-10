import React, { useState } from 'react';
import { 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  Percent, 
  TrendingUp, 
  Zap, 
  Clock, 
  Radio, 
  ShieldAlert,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { NetworkPacket } from '../types/ids';

interface DashboardViewProps {
  userName: string;
  userRole?: string;
  totalPackets: number;
  normalPackets: number;
  intrusionPackets: number;
  alertRate: number;
  recentPackets: NetworkPacket[];
  isStreaming: boolean;
  onSimulateAttack: (type: 'Port Scan' | 'DDoS' | 'SQL Injection' | 'Brute Force') => void;
  onBlockIp: (ip: string, reason: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  userRole,
  totalPackets,
  normalPackets,
  intrusionPackets,
  alertRate,
  recentPackets,
  isStreaming,
  onSimulateAttack,
  onBlockIp,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; normal: number; intrusion: number; x: number; y: number } | null>(null);

  // Time series points for Traffic Overview line chart (matching screenshot time labels)
  const timeLabels = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'];
  
  // Base line data matching the visual curve in the screenshot
  const linePoints = [
    { time: '10:00', normal: 75, intrusion: 22 },
    { time: '10:05', normal: 160, intrusion: 38 },
    { time: '10:10', normal: 85, intrusion: 20 },
    { time: '10:15', normal: 145, intrusion: 48 },
    { time: '10:20', normal: 135, intrusion: 32 },
    { time: '10:25', normal: 155, intrusion: 36 },
    { time: '10:30', normal: 120, intrusion: 28 },
  ];

  // SVG Chart bounds
  const chartWidth = 560;
  const chartHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const maxVal = 200; // Y-axis max

  const getCoordinates = (index: number, value: number) => {
    const x = paddingLeft + (index / (linePoints.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (value / maxVal) * innerHeight;
    return { x, y };
  };

  // Build SVG path for smooth curves
  const buildSmoothPath = (values: number[]) => {
    const coords = values.map((val, idx) => getCoordinates(idx, val));
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const normalPath = buildSmoothPath(linePoints.map(p => p.normal));
  const intrusionPath = buildSmoothPath(linePoints.map(p => p.intrusion));

  // Donut chart calculations
  const normalPercentage = totalPackets > 0 ? (normalPackets / totalPackets) * 100 : 88.3;
  const intrusionPercentage = totalPackets > 0 ? (intrusionPackets / totalPackets) * 100 : 11.7;

  // SVG Donut calculation
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const normalStrokeDash = (normalPercentage / 100) * donutCircumference;
  const intrusionStrokeDash = (intrusionPercentage / 100) * donutCircumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar matching Screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
              Active Node #1
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Welcome, {userName || 'Deepika'}
            </span>
            {userRole && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {userRole}
              </span>
            )}
            <span className="text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">
              AI Driven Intrusion Detection System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>25 Oct 2026 &nbsp;|&nbsp; 10:24 AM</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSimulateAttack('DDoS')}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-1 transition-colors"
              title="Test real-time IDS alert pipeline with sudden attack burst"
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Simulate Attack</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards matching Screenshot 2. Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Packets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center space-x-4 transition-all hover:border-blue-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Network className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Packets</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalPackets.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+4.2% from last hour</span>
            </div>
          </div>
        </div>

        {/* Card 2: Normal Traffic */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center space-x-4 transition-all hover:border-emerald-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Normal Traffic</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {normalPackets.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <span>Verified benign flows</span>
            </div>
          </div>
        </div>

        {/* Card 3: Intrusions Detected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center space-x-4 transition-all hover:border-red-300">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Intrusions Detected</div>
            <div className="text-2xl font-bold text-red-600 tracking-tight">
              {intrusionPackets.toLocaleString()}
            </div>
            <div className="text-[11px] text-red-500 font-medium flex items-center gap-0.5 mt-0.5">
              <span>{intrusionPackets > 0 ? 'Requires attention' : 'No active threats'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Alert Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center space-x-4 transition-all hover:border-purple-300">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Percent className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Alert Rate</div>
            <div className="text-2xl font-bold text-purple-700 tracking-tight">
              {alertRate.toFixed(1)}%
            </div>
            <div className="text-[11px] text-purple-600 font-medium flex items-center gap-0.5 mt-0.5">
              <span>Threat threshold &lt; 15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Traffic Overview & Traffic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart: Traffic Overview (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Traffic Overview</h2>
              <p className="text-xs text-slate-400">Packets processed per 5-minute sampling interval</p>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Normal</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-slate-600">Intrusion</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 sm:h-64"
            >
              {/* Horizontal Grid lines & Y Axis labels */}
              {[0, 50, 100, 150, 200].map((val) => {
                const y = paddingTop + innerHeight - (val / maxVal) * innerHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {timeLabels.map((time, idx) => {
                const x = paddingLeft + (idx / (timeLabels.length - 1)) * innerWidth;
                return (
                  <text
                    key={time}
                    x={x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {time}
                  </text>
                );
              })}

              {/* Normal Traffic Smooth Curve (Emerald Green) */}
              <path
                d={normalPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Intrusion Traffic Smooth Curve (Crimson Red) */}
              <path
                d={intrusionPath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points on curves */}
              {linePoints.map((pt, idx) => {
                const normCoord = getCoordinates(idx, pt.normal);
                const intCoord = getCoordinates(idx, pt.intrusion);
                return (
                  <g key={idx}>
                    {/* Normal Point */}
                    <circle
                      cx={normCoord.x}
                      cy={normCoord.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#10B981"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() => setHoveredPoint({ ...pt, x: normCoord.x, y: normCoord.y })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Intrusion Point */}
                    <circle
                      cx={intCoord.x}
                      cy={intCoord.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#EF4444"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() => setHoveredPoint({ ...pt, x: intCoord.x, y: intCoord.y })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip on hover */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 pointer-events-none bg-slate-900 text-white p-2 rounded-md shadow-lg text-[11px] transform -translate-x-1/2 -translate-y-full border border-slate-700"
                style={{ left: `${(hoveredPoint.x / chartWidth) * 100}%`, top: '40%' }}
              >
                <div className="font-bold text-slate-300">{hoveredPoint.time}</div>
                <div className="text-emerald-400">Normal: {hoveredPoint.normal} packets</div>
                <div className="text-red-400">Intrusion: {hoveredPoint.intrusion} packets</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Traffic Distribution (Donut Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Traffic Distribution</h2>
            <p className="text-xs text-slate-400">Classification ratio breakdown</p>
          </div>

          <div className="flex flex-col items-center justify-center my-4 relative">
            <svg width="180" height="180" viewBox="0 0 160 160" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={donutRadius}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="24"
              />
              {/* Normal Traffic segment (Green) */}
              <circle
                cx="80"
                cy="80"
                r={donutRadius}
                fill="none"
                stroke="#10B981"
                strokeWidth="24"
                strokeDasharray={`${normalStrokeDash} ${donutCircumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Intrusion Traffic segment (Red) */}
              <circle
                cx="80"
                cy="80"
                r={donutRadius}
                fill="none"
                stroke="#EF4444"
                strokeWidth="24"
                strokeDasharray={`${intrusionStrokeDash} ${donutCircumference}`}
                strokeDashoffset={`-${normalStrokeDash}`}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Text matching the screenshot badges */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Normal
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                {normalPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Legend and breakdown matching Screenshot */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center space-x-6 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">Normal ({normalPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-700">Intrusion ({intrusionPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Packet Activity Stream Feed (Proves Real-Time Capabilities) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900">
              Live Real-Time Packet Feed
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              eth0 / 10.0.0.0/24
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Status:</span>
            <span className={`font-semibold ${isStreaming ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAMING PAUSED'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Destination IP</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {recentPackets.slice(0, 5).map((pkt) => {
                const isIntrusion = pkt.result === 'Intrusion';
                return (
                  <tr 
                    key={pkt.id} 
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isIntrusion ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-sans">
                      {pkt.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {pkt.sourceIp}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {pkt.destinationIp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {pkt.protocol}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {pkt.service}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isIntrusion
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isIntrusion ? pkt.attackType : 'Normal'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800 font-sans">
                      {pkt.confidence.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      {isIntrusion ? (
                        <button
                          onClick={() => onBlockIp(pkt.sourceIp, `Live threat: ${pkt.attackType}`)}
                          className="px-2 py-1 text-[11px] bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                        >
                          Block IP
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pass</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
