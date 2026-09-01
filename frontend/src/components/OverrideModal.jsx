import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export default function OverrideModal({ isOpen, onClose, onConfirm, travelerName }) {
  const [reason, setReason] = useState('Diplomatic immunity / Official Clearance');
  const [supervisorNote, setSupervisorNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(`${reason} — Note: ${supervisorNote || 'Verified physically'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border-2 border-[#FFC300] max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-lg font-serif">
            <AlertTriangle className="w-6 h-6 text-[#FFC300]" />
            <span>Officer Override Clearance</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600">
          You are manually overriding the AI High-Risk flag for traveler <strong className="text-[#0B2545]">{travelerName}</strong>. This action will be permanently recorded in the immutable blockchain audit trail.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Primary Override Justification *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              required
            >
              <option value="Diplomatic Passport / Official Clearance">Diplomatic Passport / Official Clearance</option>
              <option value="Physical Verification Passed by Supervisor">Physical Verification Passed by Supervisor</option>
              <option value="System Misidentification / False Positive OCR">System Misidentification / False Positive OCR</option>
              <option value="Emergency Humanitarian Entry Permit">Emergency Humanitarian Entry Permit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Supervisor Authorization Note *
            </label>
            <textarea
              rows={3}
              value={supervisorNote}
              onChange={(e) => setSupervisorNote(e.target.value)}
              placeholder="Enter supervisor badge ID and detailed clearance remarks..."
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-[#FFC300] text-[#0B2545] hover:bg-amber-400 rounded flex items-center gap-1.5 shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Override & Clear</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
