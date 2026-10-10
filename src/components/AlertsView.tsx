import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { SecurityAlert, SeverityLevel } from '../types/ids';

interface AlertsViewProps {
  alerts: SecurityAlert[];
  onViewAlert: (alert: SecurityAlert) => void;
  onBlockIp: (ip: string, reason: string) => void;
  onDismissAlert: (id: string) => void;
  onClearAllAlerts: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onViewAlert,
  onBlockIp,
  onDismissAlert,
  onClearAllAlerts,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'All' || alert.severity === filterSeverity;
    const matchesSearch =
      alert.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.destinationIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border border-red-300 font-bold';
      case 'High':
        return 'bg-rose-100 text-rose-700 border border-rose-200 font-semibold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border border-amber-200 font-semibold';
      case 'Low':
        return 'bg-blue-100 text-blue-700 border border-blue-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time security events flagged by machine learning models and packet inspection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search IP or Attack Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
            />
          </div>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {alerts.length > 0 && (
            <button
              onClick={onClearAllAlerts}
              className="text-xs text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors"
              title="Acknowledge all alerts"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Alerts Table matching Screenshot 5 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Destination IP</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No alerts matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. # */}
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    {/* 2. Time */}
                    <td className="py-3.5 px-4 font-sans text-slate-600 whitespace-nowrap">
                      {item.time}
                    </td>

                    {/* 3. Source IP */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {item.sourceIp}
                    </td>

                    {/* 4. Destination IP */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.destinationIp}
                    </td>

                    {/* 5. Type */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.type}
                    </td>

                    {/* 6. Severity */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>

                    {/* 7. Action: View matching screenshot */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-3">
                        <button
                          onClick={() => onViewAlert(item)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onBlockIp(item.sourceIp, `Security Incident: ${item.type}`)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer text-[11px] font-medium"
                          title="Block in firewall"
                        >
                          Block
                        </button>
                      </div>
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
