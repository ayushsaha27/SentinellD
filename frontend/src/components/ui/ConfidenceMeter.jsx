import React from 'react';

export default function ConfidenceMeter({ label, value, invert = false, showPercentage = true }) {
  // invert = true means high score is BAD (e.g. tampering), invert = false means high score is GOOD (e.g. face match)
  const getBarColor = (score) => {
    if (invert) {
      if (score >= 75) return 'bg-[#C1272D]'; // High tampering -> RED
      if (score >= 40) return 'bg-[#FFC300]'; // Medium tampering -> AMBER
      return 'bg-[#2E7D32]'; // Low tampering -> GREEN
    } else {
      if (score >= 80) return 'bg-[#2E7D32]'; // High match -> GREEN
      if (score >= 50) return 'bg-[#FFC300]'; // Medium match -> AMBER
      return 'bg-[#C1272D]'; // Low match -> RED
    }
  };

  return (
    <div className="w-full my-2">
      <div className="flex justify-between items-center text-sm font-medium mb-1">
        <span className="text-[#13315C] font-semibold">{label}</span>
        {showPercentage && (
          <span className="font-mono font-bold text-[#0B2545]">{value.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-[#C7D6E8]/40 rounded-full h-3.5 overflow-hidden p-0.5 border border-[#C7D6E8]">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
