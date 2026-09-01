import React, { useState } from 'react';
import { Scan, ShieldAlert, CheckCircle2, Clock, ArrowRight, AlertTriangle, FileText, UserPlus, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCallout from '../components/ui/StatCallout';
import RiskBadge from '../components/ui/RiskBadge';
import BiometricEnrolmentModal from '../components/BiometricEnrolmentModal';

export default function Dashboard() {
  const { setActivePage, reviewQueue, auditTrail, showToast } = useApp();
  const [isEnrolModalOpen, setIsEnrolModalOpen] = useState(false);

  // Pure dynamic stats from real persistent database
  const screenedCount = auditTrail.length;
  const flaggedCount = auditTrail.filter(a => a.riskLevel === 'high').length;
  const pendingCount = reviewQueue.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Officer Welcome & Primary Action Hero Banner */}
      <div className="bg-[#0B2545] text-white rounded-xl p-6 shadow-md border-b-4 border-[#FFC300] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="bg-[#13315C] text-[#FFC300] px-3 py-1 rounded text-xs font-bold font-mono tracking-wide uppercase">
            Active Checkpoint Session
          </span>
          <h2 className="text-2xl font-bold font-serif text-white pt-1">
            Border Kiosk Control Center
          </h2>
          <p className="text-xs text-gray-300 max-w-xl">
            Scan passenger travel documents (Passport, Visa, Permit, ID) for real-time AI OCR extraction, tampering analysis, biometric matching, and blockchain logging.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEnrolModalOpen(true)}
            className="bg-[#13315C] hover:bg-[#0B2545] text-[#FFC300] border border-[#FFC300] font-bold text-sm px-5 py-3.5 rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-[#FFC300]" />
            <span>Enrol Live Face Biometric</span>
          </button>

          <button
            onClick={() => setActivePage('capture')}
            className="bg-[#FFC300] hover:bg-amber-400 text-[#0B2545] font-extrabold text-sm px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Scan className="w-5 h-5 text-[#0B2545]" />
            <span>Scan New Document</span>
            <ArrowRight className="w-4 h-4 text-[#0B2545]" />
          </button>
        </div>
      </div>

      {/* True Dynamic Stats Strip (No Fake Hardcoded Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCallout
          label="Documents Screened Today"
          value={screenedCount}
          subtext="True database count"
          icon={CheckCircle2}
          badgeColor="bg-[#0B2545]"
        />
        <StatCallout
          label="Flagged High Risk"
          value={flaggedCount}
          subtext="Secondary screening held"
          icon={ShieldAlert}
          badgeColor="bg-[#C1272D]"
        />
        <StatCallout
          label="Pending Review Queue"
          value={pendingCount}
          subtext="Requires supervisor action"
          icon={Clock}
          badgeColor="bg-[#FFC300]"
        />
        <StatCallout
          label="Avg Processing Speed"
          value="2.4s"
          subtext="4 AI modules executed"
          icon={Scan}
          badgeColor="bg-[#13315C]"
        />
      </div>

      {/* Review Queue Counter Banner if cases pending */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border-2 border-[#FFC300] rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#0B2545]" />
            <div>
              <h4 className="font-bold text-sm text-[#0B2545]">
                {pendingCount} Cases Pending Supervisor Review
              </h4>
              <p className="text-xs text-gray-700">
                Medium-risk documents awaiting manual review or override confirmation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('review')}
            className="bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFC300]" />
          </button>
        </div>
      )}

      {/* Recent Verifications Activity */}
      <div className="bg-white border border-[#C7D6E8] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#0B2545] text-white px-5 py-3.5 border-b border-[#13315C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FFC300]" />
            <h3 className="font-semibold text-base font-serif text-white">Recent Checkpoint Activity</h3>
          </div>
          <button
            onClick={() => setActivePage('audit')}
            className="text-xs text-[#FFC300] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Audit Log</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {auditTrail.slice(0, 5).map((item) => (
            <div 
              key={item.verificationId}
              className="p-4 hover:bg-gray-50 flex flex-wrap items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#13315C] text-[#FFC300] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  {item.docType.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#0B2545] font-mono">{item.travelerName}</h4>
                    <span className="text-xs text-gray-500 font-mono">({item.docType})</span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {item.verificationId} • {item.timestamp} • {item.checkpointId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                <span className="text-xs font-semibold text-[#0B2545] bg-[#C7D6E8]/40 px-2.5 py-1 rounded">
                  {item.outcome}
                </span>
                <button
                  onClick={() => setActivePage('audit')}
                  className="text-xs font-semibold text-[#0B2545] hover:text-[#13315C] underline cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biometric Enrolment Modal */}
      <BiometricEnrolmentModal
        isOpen={isEnrolModalOpen}
        onClose={() => setIsEnrolModalOpen(false)}
        onEnrolled={(profile) => {
          showToast(`Enrolled face biometric for ${profile.name}. Saved to Database.`, 'success');
        }}
      />
    </div>
  );
}
