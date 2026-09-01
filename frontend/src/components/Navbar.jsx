import React from 'react';
import { 
  Shield, 
  Scan, 
  FileText, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { officer, logoutOfficer, activePage, setActivePage, reviewQueue, identityAlerts, t } = useApp();

  if (!officer?.isLoggedIn || activePage === 'login') return null;

  const navItems = [
    { 
      id: 'dashboard', 
      label: t('kioskTab'), 
      icon: Scan,
      badge: reviewQueue.length > 0 ? reviewQueue.length : null,
      badgeColor: 'bg-amber-600 text-white'
    },
    { 
      id: 'audit', 
      label: t('auditTab'), 
      icon: FileText,
      badge: identityAlerts.length > 0 ? identityAlerts.length : null,
      badgeColor: 'bg-red-700 text-white'
    },
    { id: 'settings', label: t('settingsTab'), icon: Settings }
  ];

  return (
    <header className="bg-[#0F172A] text-white border-b-2 border-amber-600 shadow-sm sticky top-0 z-40">
      {/* Formal Indian Government Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-amber-500 uppercase font-serif text-sm">
            <Shield className="w-5 h-5 text-amber-500" />
            <span>SENTINEL-ID</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200 font-semibold">Ministry of Home Affairs (MHA)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Sashastra Seema Bal (SSB)</span>
        </div>

        {/* Right side: Clean Logout button only (Circled pills removed) */}
        <div className="flex items-center gap-3">
          <button
            onClick={logoutOfficer}
            className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1 rounded border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
            title="Logout session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Clean Government Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || 
            (item.id === 'dashboard' && (activePage === 'capture' || activePage === 'processing' || activePage === 'result' || activePage === 'review')) ||
            (item.id === 'audit' && (activePage === 'alerts' || activePage === 'analytics'));

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-xs transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-amber-500 bg-slate-800 text-amber-400 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
