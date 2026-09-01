import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ConnectivityIndicator() {
  const { isOnline, setIsOnline } = useApp();

  return (
    <button 
      onClick={() => setIsOnline(!isOnline)}
      title="Click to toggle Online/Offline edge simulation"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
        isOnline 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
          : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
      }`}
    >
      {isOnline ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Wifi className="w-3.5 h-3.5" />
          <span>Online / Live Sync</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-700" />
          <span>Offline Edge (3 Queued)</span>
          <RefreshCw className="w-3 h-3 animate-spin text-amber-700 ml-1" />
        </>
      )}
    </button>
  );
}
