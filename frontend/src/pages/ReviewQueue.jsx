import React, { useState } from 'react';
import { Clock, Filter, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskBadge from '../components/ui/RiskBadge';
import { PRESET_SAMPLES } from '../api/mockApi';

export default function ReviewQueue() {
  const { reviewQueue, setActivePage, setActiveVerification } = useApp();
  const [filterDocType, setFilterDocType] = useState('ALL');

  const handleInspectCase = (item) => {
    // Load preset or mock active verification
    const preset = PRESET_SAMPLES.find(p => p.verificationId === item.verificationId) || PRESET_SAMPLES[3];
    setActiveVerification(preset);
    setActivePage('result');
  };

  const filtered = reviewQueue.filter(item => {
    if (filterDocType === 'ALL') return true;
    return item.docType === filterDocType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FFC300]" />
            <h2 className="text-xl font-bold font-serif text-white">Supervisor Review Queue</h2>
          </div>
          <p className="text-xs text-gray-300">
            Pending medium-risk cases flagged for secondary inspection or officer override verification.
          </p>
        </div>
        <span className="bg-[#FFC300] text-[#0B2545] px-3 py-1 rounded text-xs font-mono font-extrabold">
          {reviewQueue.length} Cases Pending
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#C7D6E8] rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-[#0B2545]" />
          <span className="text-xs font-bold uppercase text-gray-700">Filter Document Type:</span>
          <select
            value={filterDocType}
            onChange={(e) => setFilterDocType(e.target.value)}
            className="text-xs border border-gray-300 rounded px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
          >
            <option value="ALL">All Categories</option>
            <option value="Passport">Passport</option>
            <option value="Visa">Visa</option>
            <option value="National ID">National ID</option>
            <option value="Permit">Permit</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-mono">
          Showing {filtered.length} of {reviewQueue.length} records
        </span>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white border border-[#C7D6E8] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0B2545] text-white uppercase text-[11px] tracking-wider font-semibold border-b border-[#13315C]">
              <tr>
                <th className="p-3.5">Ref ID</th>
                <th className="p-3.5">Traveler Name</th>
                <th className="p-3.5">Doc Type</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Flagged Reason</th>
                <th className="p-3.5">Submitted</th>
                <th className="p-3.5">Officer</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.verificationId} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0B2545]">{item.verificationId}</td>
                  <td className="p-3.5 font-bold text-[#0B2545]">{item.travelerName}</td>
                  <td className="p-3.5">
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono">
                      {item.docType}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                  </td>
                  <td className="p-3.5 text-gray-700 max-w-xs truncate">{item.flaggedReason}</td>
                  <td className="p-3.5 text-gray-500 font-mono">{item.submittedAt}</td>
                  <td className="p-3.5 text-gray-700">{item.officer}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleInspectCase(item)}
                      className="px-3 py-1.5 bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-bold text-xs rounded shadow inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3 text-[#FFC300]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
