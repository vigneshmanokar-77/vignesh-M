import React from 'react';
import { Shield, Bell, Volume2, VolumeX, Play, Pause, User, Radio } from 'lucide-react';

interface NavbarProps {
  userName: string;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeAlertCount: number;
  onNavigateToAlerts: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  isStreaming,
  onToggleStreaming,
  soundEnabled,
  onToggleSound,
  activeAlertCount,
  onNavigateToAlerts,
  onLogout,
}) => {
  return (
    <header className="h-14 bg-[#0B1528] text-white border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 select-none sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
          <Shield className="w-5 h-5 fill-blue-500/30 text-blue-400" />
        </div>
        <span className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
          AI Intrusion Detection
          <span className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-blue-900/60 text-blue-300 rounded border border-blue-700/50">
            v2.4
          </span>
        </span>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Real-time traffic simulation status */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-full px-2.5 py-1 text-xs">
          <button
            onClick={onToggleStreaming}
            title={isStreaming ? 'Pause live packet stream' : 'Resume live packet stream'}
            className="flex items-center gap-1.5 font-medium hover:text-blue-400 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              {isStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-300 hidden sm:inline">
              {isStreaming ? 'Live Capture: ON' : 'Live Capture: PAUSED'}
            </span>
            {isStreaming ? (
              <Pause className="w-3 h-3 text-slate-400 ml-1" />
            ) : (
              <Play className="w-3 h-3 text-emerald-400 ml-1" />
            )}
          </button>
        </div>

        {/* Audio Alert Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute intrusion audio alarm' : 'Enable intrusion audio alarm'}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-blue-950/60 border-blue-800/80 text-blue-400 hover:bg-blue-900/60'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onNavigateToAlerts}
          title="View Intrusion Alerts"
          className="relative p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {activeAlertCount > 9 ? '9+' : activeAlertCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-medium text-slate-200 hidden md:block">
            {userName}
          </span>
          <button
            onClick={onLogout}
            title="Log out to Login/Sign Up page"
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors ml-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-red-950/30 border border-slate-800 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
