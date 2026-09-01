import React from 'react';
import { AlertOctagon, ShieldAlert, ArrowRight, GitFork, UserX, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function IdentityAlerts() {
  const { identityAlerts, showToast } = useApp();

  const handleEscalate = (alertId) => {
    showToast(`Case ${alertId} escalated to MHA Central Intelligence & Investigation Unit.`, 'error');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#C1272D] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-[#FFC300]" />
            <h2 className="text-xl font-bold font-serif text-white">Cross-Checkpoint Identity Graph Alerts</h2>
          </div>
          <p className="text-xs text-red-100">
            Novel Feature: Detects travelers presenting different passports/names at separate border posts using facial biometric graph linkage.
          </p>
        </div>

        <span className="bg-[#FFC300] text-[#0B2545] px-3 py-1 rounded text-xs font-mono font-extrabold">
          {identityAlerts.length} High-Confidence Impersonations
        </span>
      </div>

      {/* Alerts Cards List */}
      <div className="space-y-6">
        {identityAlerts.map((alert) => (
          <div key={alert.id} className="bg-white border-2 border-red-200 rounded-xl shadow-md overflow-hidden">
            {/* Top Bar */}
            <div className="bg-[#0B2545] text-white px-5 py-3 border-b border-[#13315C] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="bg-[#C1272D] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                  {alert.severity} SEVERITY
                </span>
                <span className="font-bold text-sm text-white font-serif">{alert.alertType}</span>
                <span className="text-xs text-gray-400 font-mono">ID: {alert.id}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#FFC300]">
                <GitFork className="w-4 h-4" />
                <span>Biometric Link Confidence: {alert.matchConfidence}%</span>
              </div>
            </div>

            {/* Content Body: Side-by-Side Comparison */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                {/* Subject Face Photo */}
                <div className="text-center shrink-0 space-y-1">
                  <img
                    src={alert.subjectFaceUrl}
                    alt="Subject face"
                    className="w-24 h-24 object-cover rounded-full border-4 border-[#C1272D] shadow"
                  />
                  <span className="text-[11px] font-bold text-red-900 font-mono block">
                    BIOMETRIC FACE MATCH
                  </span>
                </div>

                {/* Side by Side Linked Records */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full text-xs">
                  {/* Record A */}
                  <div className="bg-white p-3.5 rounded border-2 border-red-300 shadow-sm space-y-1">
                    <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase block w-max mb-1">
                      Identity Record A
                    </span>
                    <p className="font-bold text-[#0B2545] text-sm font-mono">{alert.linkedRecords[0].identityName}</p>
                    <p className="text-gray-600">Doc: {alert.linkedRecords[0].docType} ({alert.linkedRecords[0].docNumber})</p>
                    <p className="text-gray-600">Post: <strong>{alert.linkedRecords[0].checkpoint}</strong></p>
                    <p className="text-gray-500 font-mono">Date: {alert.linkedRecords[0].date}</p>
                    <span className="inline-block mt-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Status: {alert.linkedRecords[0].status}
                    </span>
                  </div>

                  {/* Record B */}
                  <div className="bg-white p-3.5 rounded border-2 border-amber-300 shadow-sm space-y-1">
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase block w-max mb-1">
                      Identity Record B
                    </span>
                    <p className="font-bold text-[#0B2545] text-sm font-mono">{alert.linkedRecords[1].identityName}</p>
                    <p className="text-gray-600">Doc: {alert.linkedRecords[1].docType} ({alert.linkedRecords[1].docNumber})</p>
                    <p className="text-gray-600">Post: <strong>{alert.linkedRecords[1].checkpoint}</strong></p>
                    <p className="text-gray-500 font-mono">Date: {alert.linkedRecords[1].date}</p>
                    <span className="inline-block mt-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Status: {alert.linkedRecords[1].status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Escalation Action */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-mono">
                  Automated flag triggered by Central Identity Graph Service
                </p>

                <button
                  onClick={() => handleEscalate(alert.id)}
                  className="px-5 py-2.5 bg-[#C1272D] hover:bg-red-800 text-white font-extrabold text-xs rounded shadow flex items-center gap-2 cursor-pointer"
                >
                  <UserX className="w-4 h-4" />
                  <span>Escalate to Central Investigation Unit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
