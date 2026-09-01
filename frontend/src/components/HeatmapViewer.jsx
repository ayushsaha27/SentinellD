import React, { useState } from 'react';
import { Eye, EyeOff, Layers, AlertCircle } from 'lucide-react';

export default function HeatmapViewer({ imageUrl, heatmapRegions = [], overallScore = 0 }) {
  const [showHeatmap, setShowHeatmap] = useState(true);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0B2545]" />
          <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
            AI Forgery Overlay View
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
            showHeatmap 
              ? 'bg-[#0B2545] text-[#FFC300]' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showHeatmap ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Forgery Heatmap</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show Forgery Heatmap</span>
            </>
          )}
        </button>
      </div>

      {/* Document Image container with Overlay */}
      <div className="relative border-2 border-[#13315C] rounded-lg overflow-hidden bg-gray-900 shadow-inner group min-h-[220px] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Document inspection"
          className={`w-full h-auto object-contain max-h-[350px] transition-all duration-300 ${
            showHeatmap && heatmapRegions.length > 0 ? 'brightness-90 contrast-105' : ''
          }`}
        />

        {/* Heatmap Overlay boxes */}
        {showHeatmap && heatmapRegions.map((region, idx) => (
          <div
            key={idx}
            style={{
              left: region.x,
              top: region.y,
              width: region.w,
              height: region.h
            }}
            className="absolute border-2 border-red-500 bg-red-500/35 backdrop-blur-[1px] animate-pulse rounded flex flex-col justify-between p-1 z-10 shadow-lg cursor-pointer"
            title={region.label}
          >
            <span className="bg-red-700 text-white font-mono font-bold text-[10px] px-1 py-0.5 rounded shadow w-max max-w-full truncate">
              ⚠️ {region.label}
            </span>
          </div>
        ))}

        {heatmapRegions.length === 0 && showHeatmap && (
          <div className="absolute top-3 right-3 bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-semibold shadow flex items-center gap-1">
            ✓ No ELA/Visual Anomalies Detected
          </div>
        )}
      </div>

      {/* Flagged Regions List */}
      {heatmapRegions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-xs font-bold text-red-800 uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Detected Forgery & Manipulation Coordinates:
          </p>
          {heatmapRegions.map((r, i) => (
            <div key={i} className="text-xs bg-red-50 border border-red-200 text-red-900 px-3 py-1.5 rounded flex items-center justify-between">
              <span className="font-semibold">{r.label}</span>
              <span className="font-mono text-[11px] text-red-700">Region: X:{r.x} Y:{r.y}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
