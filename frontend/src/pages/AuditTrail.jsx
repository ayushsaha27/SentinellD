import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Lock,
  Hash,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskBadge from '../components/ui/RiskBadge';

export default function AuditTrail() {
  const { auditTrail, identityAlerts, refreshFromBackend, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ledger');

  const filteredLogs = auditTrail.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      (item.travelerName || '').toLowerCase().includes(q) ||
      (item.verificationId || '').toLowerCase().includes(q) ||
      (item.checkpointId || '').toLowerCase().includes(q) ||
      (item.officer || '').toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = ['Verification ID,Traveler Name,Doc Type,Risk Score,Outcome,Timestamp,Officer,Checkpoint,Blockchain Hash'];
    const rows = filteredLogs.map(item => 
      `"${item.verificationId}","${item.travelerName}","${item.docType}",${item.riskScore},"${item.outcome}","${item.timestamp}","${item.officer}","${item.checkpointId}","${item.blockchainHash}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sentinel_audit_ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B2545] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FFC300]" />
            <h2 className="text-xl font-bold font-serif text-white">{t('auditTab')}</h2>
          </div>
          <p className="text-xs text-gray-300">
            Immutable SHA-256 cryptographic chain of custody ledger & real-time border security alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refreshFromBackend}
            className="p-2.5 bg-[#13315C] text-white hover:bg-slate-700 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Refresh database sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-[#FFC300] hover:bg-amber-400 text-[#0B2545] font-extrabold text-xs rounded shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0B2545]" />
            <span>Export Forensic Audit (CSV)</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs: Ledger vs Alerts */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'ledger'
              ? 'border-[#0B2545] text-[#0B2545] bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blockchain Audit Ledger ({auditTrail.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'border-[#C1272D] text-[#C1272D] bg-white shadow-sm'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#C1272D]" />
          <span>Security & Impersonation Alerts ({identityAlerts.length})</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by traveler name, verification ID, officer, or checkpoint..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
        />
      </div>

      {/* TAB 1: AUDIT LEDGER TABLE */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-[#C7D6E8] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-semibold">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Traveler Name</th>
                  <th className="p-3">Doc Type</th>
                  <th className="p-3">Risk Assessment</th>
                  <th className="p-3">Kiosk Outcome</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Officer & Post</th>
                  <th className="p-3">SHA-256 Blockchain Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 font-mono">
                      No audit records logged yet. Run document screenings at the checkpoint to generate immutable blockchain logs.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => (
                    <tr key={item.verificationId} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-[#0B2545]">{item.verificationId}</td>
                      <td className="p-3 font-bold text-[#0B2545] font-mono">{item.travelerName || 'TRAVELER'}</td>
                      <td className="p-3 text-gray-600">{item.docType}</td>
                      <td className="p-3">
                        <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                      </td>
                      <td className="p-3 font-semibold text-[#0B2545]">{item.outcome}</td>
                      <td className="p-3 font-mono text-gray-500 text-[11px]">{item.timestamp}</td>
                      <td className="p-3 text-gray-700">
                        <div className="font-bold">{item.officer}</div>
                        <div className="text-[10px] text-gray-400">{item.checkpointId}</div>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-gray-500 max-w-[140px] truncate" title={item.blockchainHash}>
                        <span className="flex items-center gap-1 text-emerald-800">
                          <Hash className="w-3 h-3 text-emerald-600 shrink-0" />
                          {item.blockchainHash ? item.blockchainHash.substring(0, 16) + '...' : '0x8f99a10c...'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ALERTS PANEL */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {identityAlerts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-gray-500 font-mono">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>No high-risk identity alerts recorded. All border checkpoints running normally.</span>
            </div>
          ) : (
            identityAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-50 border-2 border-[#C1272D] p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-[#C1272D] shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-[#0B2545]">{alert.title}</h4>
                    <p className="text-xs text-gray-700 font-mono">
                      Location: {alert.checkpoint} • Time: {alert.timestamp}
                    </p>
                    <p className="text-xs text-red-800 mt-1 font-semibold">{alert.details}</p>
                  </div>
                </div>
                <span className="bg-[#C1272D] text-white px-3 py-1 rounded text-xs font-bold font-mono">
                  HIGH PRIORITY
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
