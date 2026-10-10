import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Plus, Trash2, Check, Download, AlertOctagon, Terminal } from 'lucide-react';
import { BlockedRule } from '../types/ids';

interface FirewallViewProps {
  blockedRules: BlockedRule[];
  onAddRule: (ip: string, reason: string) => void;
  onRemoveRule: (id: string) => void;
}

export const FirewallView: React.FC<FirewallViewProps> = ({
  blockedRules,
  onAddRule,
  onRemoveRule,
}) => {
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');
  const [showExport, setShowExport] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    onAddRule(newIp.trim(), newReason.trim() || 'Manual Administrator Block');
    setNewIp('');
    setNewReason('');
  };

  const iptablesRules = blockedRules
    .map((r) => `iptables -A INPUT -s ${r.ip} -j DROP # Reason: ${r.reason}`)
    .join('\n');

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            Firewall Rules & Active Blocks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time enforcement layer blocking identified malicious hosts and botnet probes.
          </p>
        </div>

        <button
          onClick={() => setShowExport(!showExport)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>{showExport ? 'Hide Iptables Rules' : 'Export Iptables Rules'}</span>
        </button>
      </div>

      {/* Export Shell Snippet */}
      {showExport && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between mb-2 text-slate-400">
            <span># Linux Kernel Netfilter (iptables) Enforcement Script</span>
            <span className="text-[10px] text-emerald-400">Ready to execute</span>
          </div>
          <pre className="overflow-x-auto p-2 bg-slate-900/60 rounded text-[11px] leading-relaxed text-amber-300">
            {iptablesRules || '# No IPs currently blocked in firewall table.'}
          </pre>
        </div>
      )}

      {/* Manual Add Rule Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-3">
          Add Custom Firewall Block Rule
        </h2>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              IP Address or CIDR
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 192.168.1.99 or 10.0.4.0/24"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Threat Vector
            </label>
            <input
              type="text"
              placeholder="e.g. Persistent Port Scanning"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Enforce Block</span>
            </button>
          </div>
        </form>
      </div>

      {/* Rules Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Active Blocklist ({blockedRules.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Blocked IP</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Policy</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {blockedRules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active firewall blocks. Perimeter is operating normally.
                  </td>
                </tr>
              ) : (
                blockedRules.map((rule, idx) => (
                  <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600 flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                      <span>{rule.ip}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{rule.reason}</td>
                    <td className="py-3.5 px-4 text-slate-500">{rule.blockedAt}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[10px]">
                        DROP ALL
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onRemoveRule(rule.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
