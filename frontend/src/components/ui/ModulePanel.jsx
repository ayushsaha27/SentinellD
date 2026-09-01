import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ModulePanel({ moduleNumber, title, statusBadge, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-[#C7D6E8] rounded-lg shadow-sm overflow-hidden mb-4">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-5 py-3.5 bg-[#0B2545] text-white cursor-pointer select-none border-b border-[#13315C]"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FFC300] text-[#0B2545] font-bold text-xs">
            M{moduleNumber}
          </span>
          <h3 className="font-semibold text-base tracking-wide text-white font-serif">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {statusBadge}
          <button 
            type="button"
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle panel"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 text-[#13315C]">
          {children}
        </div>
      )}
    </div>
  );
}
