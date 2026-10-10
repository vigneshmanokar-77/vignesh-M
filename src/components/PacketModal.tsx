import React from 'react';
import { X, ShieldAlert, ShieldCheck, Terminal, AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { SecurityAlert, UploadedDataset } from '../types/ids';

interface PacketModalProps {
  alert?: SecurityAlert | null;
  dataset?: UploadedDataset | null;
  onClose: () => void;
  onBlockIp?: (ip: string, reason: string) => void;
}

export const PacketModal: React.FC<PacketModalProps> = ({
  alert,
  dataset,
  onClose,
  onBlockIp,
}) => {
  if (!alert && !dataset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {alert ? (
              <>
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span className="font-bold text-sm tracking-tight">
                  Incident Forensic Details: {alert.type}
                </span>
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm tracking-tight">
                  Dataset Inspection: {dataset?.fileName}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {alert && (
            <>
              {/* Top Summary Banner */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 text-sm">
                    {alert.type} ({alert.severity} Severity)
                  </h3>
                  <p className="text-red-700 mt-1 leading-relaxed">
                    Flagged at {alert.time}. Confidence score of {alert.confidence.toFixed(2)}% based on CICIDS2017 feature signature.
                  </p>
                </div>
              </div>

              {/* Grid of Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Source IP</span>
                  <span className="font-bold text-slate-900">{alert.sourceIp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Destination IP</span>
                  <span className="font-bold text-slate-900">{alert.destinationIp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Protocol</span>
                  <span className="font-bold text-slate-900">{alert.protocol}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Target Port</span>
                  <span className="font-bold text-slate-900">{alert.details?.port || 80}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">Status</span>
                  <span className="font-bold text-amber-600">{alert.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">MITRE ATT&CK</span>
                  <span className="font-bold text-blue-600 truncate block">
                    {alert.details?.mitreTechnique || 'T1046'}
                  </span>
                </div>
              </div>

              {/* Payload Snippet */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1.5">
                  Packet Raw Payload & Signature Trace:
                </span>
                <div className="bg-slate-950 text-slate-200 p-3.5 rounded-lg font-mono text-[11px] leading-relaxed border border-slate-800 break-all select-text">
                  <code>{alert.details?.signature || 'TCP [SYN] probe matched anomaly heuristic'}</code>
                  <div className="mt-2 text-emerald-400 border-t border-slate-800 pt-2">
                    {alert.details?.payloadSnippet || '00 1a 2b 3c 4d 5e 08 00 45 00 00 3c 1c 46 40 00 40 06'}
                  </div>
                </div>
              </div>

              {/* Mitigation suggestion */}
              <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg text-blue-900">
                <span className="font-bold block mb-1">Recommended Response:</span>
                <p className="text-blue-800 leading-relaxed">
                  Isolate origin IP <span className="font-mono font-semibold">{alert.sourceIp}</span> at perimeter edge, drop stateful sessions, and check ingress rate limits.
                </p>
              </div>
            </>
          )}

          {dataset && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{dataset.fileName}</h3>
                  <p className="text-slate-500">
                    {dataset.rowCount} Rows &bull; Size: {dataset.size} &bull; Uploaded {dataset.uploadedOn}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-[11px]">
                    {dataset.normalCount} Normal
                  </span>
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-semibold rounded-full text-[11px]">
                    {dataset.intrusionCount} Intrusion
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-2">
                  Dataset Sample Records (First 5 Rows):
                </span>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-50 text-slate-500 font-sans border-b border-slate-200">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Source IP</th>
                        <th className="p-2">Dest IP</th>
                        <th className="p-2">Proto</th>
                        <th className="p-2">Service</th>
                        <th className="p-2">Flag</th>
                        <th className="p-2">Classification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dataset.rows?.map((row) => (
                        <tr key={row.id}>
                          <td className="p-2 text-slate-400 font-sans">{row.id}</td>
                          <td className="p-2 font-semibold text-slate-800">{row.sourceIp}</td>
                          <td className="p-2 text-slate-600">{row.destinationIp}</td>
                          <td className="p-2">{row.protocol}</td>
                          <td className="p-2">{row.service}</td>
                          <td className="p-2">{row.flag}</td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold ${
                                row.result === 'Intrusion'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {row.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {alert && onBlockIp && (
            <button
              onClick={() => {
                onBlockIp(alert.sourceIp, `Incident: ${alert.type}`);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Block Source IP in Firewall
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
