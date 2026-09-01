import React from 'react';

export default function StatCallout({ label, value, subtext, icon: Icon, badgeColor = 'bg-[#0B2545]' }) {
  return (
    <div className="bg-white border border-[#C7D6E8] rounded-lg p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-extrabold font-mono text-[#0B2545]">{value}</p>
        {subtext && <p className="text-xs text-gray-600 mt-1">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg text-white ${badgeColor} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
