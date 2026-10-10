import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  ScanLine, 
  AlertTriangle, 
  BarChart3, 
  ShieldCheck, 
  LogOut,
  Radio
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'network-data' | 'detect' | 'alerts' | 'results' | 'firewall';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  alertCount: number;
  blockedCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  alertCount,
  blockedCount,
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'network-data' as ActiveTab,
      label: 'Network Data',
      icon: Database,
    },
    {
      id: 'detect' as ActiveTab,
      label: 'Detect',
      icon: ScanLine,
    },
    {
      id: 'alerts' as ActiveTab,
      label: 'Alerts',
      icon: AlertTriangle,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'results' as ActiveTab,
      label: 'Results',
      icon: BarChart3,
    },
    {
      id: 'firewall' as ActiveTab,
      label: 'Firewall Rules',
      icon: ShieldCheck,
      badge: blockedCount > 0 ? `${blockedCount} BLOCKED` : null,
      badgeColor: 'bg-amber-600 text-white',
    },
  ];

  return (
    <aside className="w-56 shrink-0 bg-[#0F1C34] text-slate-300 flex flex-col justify-between border-r border-slate-800 min-h-[calc(100vh-3.5rem)] select-none">
      {/* Top Menu Items */}
      <div className="py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
