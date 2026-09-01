import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

export default function ExtractedFieldRow({ label, value, onChange, isEditable = true }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) onChange(currentVal);
  };

  const handleCancel = () => {
    setCurrentVal(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 w-1/3">
        {label}
      </span>

      <div className="flex items-center justify-between w-2/3 gap-2">
        {isEditing ? (
          <input
            type="text"
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            className="w-full px-2.5 py-1 text-sm border border-[#0B2545] rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
            autoFocus
          />
        ) : (
          <span className="text-sm font-semibold text-[#0B2545] font-mono truncate">
            {currentVal || '—'}
          </span>
        )}

        {isEditable && (
          <div className="flex items-center gap-1 shrink-0">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                  title="Save correction"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-[#0B2545] hover:bg-gray-100 rounded"
                title="Edit OCR misread"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
