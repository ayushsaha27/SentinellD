import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskBadge({ level = 'low', score = 0, showScore = true, size = 'md' }) {
  const normalized = (level || '').toLowerCase();

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5 font-semibold',
    lg: 'px-4 py-2 text-base gap-2 font-bold'
  }[size];

  if (normalized === 'high' || score >= 75) {
    return (
      <span className={`inline-flex items-center rounded-md bg-[#C1272D] text-white shadow-sm ${sizeClasses}`}>
        <ShieldAlert className="w-4 h-4 text-white shrink-0" />
        <span>HIGH RISK</span>
        {showScore && <span className="ml-1 opacity-90 font-mono">[{score}%]</span>}
      </span>
    );
  }

  if (normalized === 'medium' || (score >= 45 && score < 75)) {
    return (
      <span className={`inline-flex items-center rounded-md bg-[#FFC300] text-[#0B2545] font-semibold shadow-sm ${sizeClasses}`}>
        <AlertTriangle className="w-4 h-4 text-[#0B2545] shrink-0" />
        <span>MEDIUM RISK</span>
        {showScore && <span className="ml-1 opacity-90 font-mono">[{score}%]</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-md bg-[#2E7D32] text-white shadow-sm ${sizeClasses}`}>
      <ShieldCheck className="w-4 h-4 text-white shrink-0" />
      <span>LOW RISK</span>
      {showScore && <span className="ml-1 opacity-90 font-mono">[{score}%]</span>}
    </span>
  );
}
