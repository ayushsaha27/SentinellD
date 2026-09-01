import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Capture from './pages/Capture';
import Processing from './pages/Processing';
import Result from './pages/Result';
import ReviewQueue from './pages/ReviewQueue';
import AuditTrail from './pages/AuditTrail';
import IdentityAlerts from './pages/IdentityAlerts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

function MainLayout() {
  const { activePage, officer, notification } = useApp();

  if (!officer?.isLoggedIn || activePage === 'login') {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'capture':
        return <Capture />;
      case 'processing':
        return <Processing />;
      case 'result':
        return <Result />;
      case 'review':
        return <ReviewQueue />;
      case 'audit':
        return <AuditTrail />;
      case 'alerts':
        return <IdentityAlerts />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#13315C] flex flex-col font-sans">
      <Navbar />

      {/* Floating Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white ${
            notification.type === 'error' ? 'bg-[#C1272D]' :
            notification.type === 'warning' ? 'bg-[#0B2545] border border-[#FFC300] text-[#FFC300]' :
            notification.type === 'success' ? 'bg-[#2E7D32]' : 'bg-[#0B2545]'
          }`}>
            {notification.type === 'error' ? <XCircle className="w-4 h-4" /> :
             notification.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-[#FFC300]" /> :
             notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2545] text-white border-t border-[#13315C] py-3 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center text-gray-400">
          <span>SentinelID v1.0.0 • SIH 2026 PS 26188</span>
          <span>Sashastra Seema Bal (SSB) • Ministry of Home Affairs</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
