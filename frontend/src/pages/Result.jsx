import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Printer, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskBadge from '../components/ui/RiskBadge';
import ModulePanel from '../components/ui/ModulePanel';
import ExtractedFieldRow from '../components/ui/ExtractedFieldRow';
import ConfidenceMeter from '../components/ui/ConfidenceMeter';
import HeatmapViewer from '../components/HeatmapViewer';
import OverrideModal from '../components/OverrideModal';
import { generateForensicPDF } from '../utils/pdfGenerator';

export default function Result() {
  const { activeVerification, officer, handleDecision, setActivePage } = useApp();
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [ocrFields, setOcrFields] = useState(() => activeVerification?.module1_ocr?.fields || {});

  useEffect(() => {
    if (activeVerification?.module1_ocr?.fields) {
      setOcrFields(activeVerification.module1_ocr.fields);
    }
  }, [activeVerification]);

  if (!activeVerification) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-gray-600">No active verification record loaded.</p>
        <button
          onClick={() => setActivePage('capture')}
          className="px-4 py-2 bg-[#0B2545] text-[#FFC300] font-bold text-xs rounded cursor-pointer"
        >
          Scan New Document
        </button>
      </div>
    );
  }

  const {
    verificationId = 'VREF-2026-8901',
    riskLevel = 'low',
    riskScore = 12,
    documentType = 'Passport',
    documentImage = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    selfieImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    submittedAt = 'Just now',
    checkpointId = 'Post 04 - Raxaul Checkpoint',
    module1_ocr = { confidence: 98.4, fields: {} },
    module2_validation = { formatValid: true, mrzChecksumValid: true, expired: false, blacklisted: false },
    module3_tampering = { overallScore: 8, photoReplacement: 5, textManipulation: 10, stampForgery: 6, metadataAnomaly: 4, heatmapRegions: [] },
    module4_faceMatch = { matchConfidence: 94.8 },
    identityGraphAlert = { flagged: false, linkedRecords: [] }
  } = activeVerification;

  const handleFieldChange = (key, val) => {
    setOcrFields(prev => ({ ...prev, [key]: val }));
  };

  const isHighRisk = riskLevel === 'high' || riskScore >= 75;
  const isMediumRisk = riskLevel === 'medium' || (riskScore >= 45 && riskScore < 75);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Navigation & Quick Details Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('dashboard')}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2545] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Checkpoint Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <span>Ref ID: <strong className="text-[#0B2545]">{verificationId}</strong></span>
          <span>•</span>
          <span>{submittedAt}</span>
        </div>
      </div>

      {/* Top Banner with Large Risk-Score Badge */}
      <div className={`p-6 rounded-xl border-2 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 ${
        isHighRisk 
          ? 'bg-red-50 border-[#C1272D]' 
          : isMediumRisk 
          ? 'bg-amber-50 border-[#FFC300]' 
          : 'bg-emerald-50 border-[#2E7D32]'
      }`}>
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-serif text-[#0B2545]">
              Document Verification Assessment
            </h2>
            <RiskBadge level={riskLevel} score={riskScore} size="lg" />
          </div>
          <p className="text-xs text-gray-700 font-medium">
            Traveler: <strong className="text-[#0B2545] font-mono text-sm">{ocrFields.name || 'UNKNOWN'}</strong> • Document: <strong className="text-[#0B2545]">{documentType}</strong> ({ocrFields.docNumber || 'N/A'})
          </p>
        </div>

        {/* Quick Action Button matching Risk Level */}
        <div className="shrink-0 flex items-center gap-2">
          {isHighRisk ? (
            <button
              onClick={() => handleDecision('FLAG')}
              className="px-6 py-3 bg-[#C1272D] hover:bg-red-700 text-white font-extrabold text-sm rounded shadow-lg flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>FLAG FOR SECONDARY SCREENING</span>
            </button>
          ) : isMediumRisk ? (
            <button
              onClick={() => handleDecision('REVIEW')}
              className="px-6 py-3 bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-extrabold text-sm rounded shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-5 h-5 text-[#FFC300]" />
              <span>SEND TO REVIEW QUEUE</span>
            </button>
          ) : (
            <button
              onClick={() => handleDecision('CLEAR')}
              className="px-6 py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold text-sm rounded shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>CLEAR TRAVELER</span>
            </button>
          )}
        </div>
      </div>

      {/* Identity Graph Alert */}
      {identityGraphAlert?.flagged && (
        <div className="bg-red-900 text-white p-4 rounded-xl shadow-lg border-2 border-[#FFC300] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#FFC300]">
              <ShieldAlert className="w-5 h-5" />
              <span>NOVEL ALERT: Multi-Identity Biometric Collision Detected</span>
            </div>
            <span className="bg-red-700 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
              CROSS-BORDER GRAPH MATCH
            </span>
          </div>
          <p className="text-xs text-gray-200">
            This passenger's face matched identity records at another border post under a different passport/name!
          </p>
        </div>
      )}

      {/* MODULE 1: OCR Extracted Data Panel */}
      <ModulePanel
        moduleNumber={1}
        title="OCR & Document Field Extraction"
        statusBadge={
          <span className="text-xs font-mono font-bold text-emerald-400 bg-[#13315C] px-2.5 py-1 rounded">
            OCR Confidence: {module1_ocr?.confidence || 98.4}%
          </span>
        }
      >
        <p className="text-xs text-gray-500 mb-3">
          Extracted from visual zone & MRZ. Click the edit icon on any row to manually correct OCR misreads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 bg-white p-2 rounded">
          <ExtractedFieldRow
            label="Full Traveler Name"
            value={ocrFields.name}
            onChange={(val) => handleFieldChange('name', val)}
          />
          <ExtractedFieldRow
            label="Document Number"
            value={ocrFields.docNumber}
            onChange={(val) => handleFieldChange('docNumber', val)}
          />
          <ExtractedFieldRow
            label="Nationality"
            value={ocrFields.nationality}
            onChange={(val) => handleFieldChange('nationality', val)}
          />
          <ExtractedFieldRow
            label="Date of Birth (DOB)"
            value={ocrFields.dob}
            onChange={(val) => handleFieldChange('dob', val)}
          />
          <ExtractedFieldRow
            label="Expiry Date"
            value={ocrFields.expiryDate}
            onChange={(val) => handleFieldChange('expiryDate', val)}
          />
          <ExtractedFieldRow
            label="Gender"
            value={ocrFields.gender}
            onChange={(val) => handleFieldChange('gender', val)}
          />
        </div>
      </ModulePanel>

      {/* MODULE 2: Validation Panel */}
      <ModulePanel
        moduleNumber={2}
        title="Document Standard & Watchlist Validation"
        statusBadge={
          module2_validation?.blacklisted || module2_validation?.expired || !module2_validation?.mrzChecksumValid ? (
            <span className="text-xs font-bold text-[#C1272D] bg-red-100 px-2 py-0.5 rounded">
              CHECKS FAILED
            </span>
          ) : (
            <span className="text-xs font-bold text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded">
              ALL CHECKS PASSED
            </span>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className={`p-3 rounded border flex items-center justify-between ${
            module2_validation?.formatValid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <span className="font-semibold">ICAO Document Format Structure</span>
            {module2_validation?.formatValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
          </div>

          <div className={`p-3 rounded border flex items-center justify-between ${
            module2_validation?.mrzChecksumValid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <span className="font-semibold">MRZ Checksum 7-3-1 Weight Verification</span>
            {module2_validation?.mrzChecksumValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
          </div>

          <div className={`p-3 rounded border flex items-center justify-between ${
            !module2_validation?.expired ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <span className="font-semibold">Document Expiry Check</span>
            {!module2_validation?.expired ? (
              <span className="font-bold text-emerald-700">Valid</span>
            ) : (
              <span className="font-bold text-red-700">EXPIRED DOCUMENT</span>
            )}
          </div>

          <div className={`p-3 rounded border flex items-center justify-between ${
            !module2_validation?.blacklisted ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <span className="font-semibold">SSB / Interpol Blacklist Watchlist Check</span>
            {!module2_validation?.blacklisted ? (
              <span className="font-bold text-emerald-700">Clean</span>
            ) : (
              <span className="font-bold text-red-700">WATCHLIST MATCH FLAGGED</span>
            )}
          </div>
        </div>
      </ModulePanel>

      {/* MODULE 3: Tampering Panel */}
      <ModulePanel
        moduleNumber={3}
        title="AI Tampering & Digital Forgery Analysis (Core AI Innovation)"
        statusBadge={
          <span className="text-xs font-mono font-bold text-white bg-[#0B2545] px-2.5 py-1 rounded">
            Tampering Risk: {module3_tampering?.overallScore || 0}%
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <ConfidenceMeter
              label="Photo Replacement / ELA Compression Splicing"
              value={module3_tampering?.photoReplacement || 0}
              invert={true}
            />
            <ConfidenceMeter
              label="Text Manipulation / Font Inconsistency"
              value={module3_tampering?.textManipulation || 0}
              invert={true}
            />
            <ConfidenceMeter
              label="Stamp / Seal Pixelation Forgery"
              value={module3_tampering?.stampForgery || 0}
              invert={true}
            />
            <ConfidenceMeter
              label="EXIF & Image Metadata Anomaly"
              value={module3_tampering?.metadataAnomaly || 0}
              invert={true}
            />
          </div>

          <div>
            <HeatmapViewer
              imageUrl={documentImage}
              heatmapRegions={module3_tampering?.heatmapRegions || []}
              overallScore={module3_tampering?.overallScore || 0}
            />
          </div>
        </div>
      </ModulePanel>

      {/* MODULE 4: Face Biometric Match Panel */}
      <ModulePanel
        moduleNumber={4}
        title="1:1 Biometric Face Verification & Anti-Spoofing"
        statusBadge={
          <span className="text-xs font-mono font-bold text-white bg-[#2E7D32] px-2.5 py-1 rounded">
            Match: {module4_faceMatch?.matchConfidence || 94.8}%
          </span>
        }
      >
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-gray-500 block">
              Document Photo (Extracted)
            </span>
            <img
              src={module4_faceMatch?.documentPhotoUrl || documentImage}
              alt="Document face"
              className="w-32 h-32 object-cover rounded-lg border-2 border-[#0B2545] shadow mx-auto"
            />
          </div>

          <div className="w-full sm:w-1/3 text-center space-y-2">
            <ConfidenceMeter
              label="Facial Embedding Similarity"
              value={module4_faceMatch?.matchConfidence ?? 0}
              invert={false}
            />
            <span className="text-[11px] text-gray-600 font-mono block">
              Threshold: &gt;70% Required for Auto-Clear
            </span>
            {module4_faceMatch?.faceDetectionFailed && (
              <span className="text-[11px] text-red-700 font-bold font-mono block">
                No face detected in one of the images — result marked unverified/high risk.
              </span>
            )}
          </div>

          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-gray-500 block">
              Live Camera Feed (Passenger)
            </span>
            <img
              src={selfieImage || module4_faceMatch?.livePhotoUrl}
              alt="Live passenger selfie"
              className="w-32 h-32 object-cover rounded-full border-2 border-[#FFC300] shadow mx-auto"
            />
          </div>
        </div>
      </ModulePanel>

      {/* Bottom Action Footer - Officer Decisions */}
      <div className="bg-white border border-[#C7D6E8] rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => generateForensicPDF(activeVerification, officer)}
            className="px-3.5 py-2 border border-gray-300 text-gray-700 font-semibold text-xs rounded hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Forensic Report</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isHighRisk && (
            <button
              type="button"
              onClick={() => setIsOverrideModalOpen(true)}
              className="px-4 py-2.5 border border-amber-500 text-amber-900 bg-amber-50 font-bold text-xs rounded hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Override & Clear (Supervisor Note)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleDecision('CLEAR')}
            className="px-5 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold text-xs rounded shadow flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Clear Traveler</span>
          </button>

          <button
            type="button"
            onClick={() => handleDecision('REVIEW')}
            className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-bold text-xs rounded shadow flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-[#FFC300]" />
            <span>Send to Review Queue</span>
          </button>

          <button
            type="button"
            onClick={() => handleDecision('FLAG')}
            className="px-5 py-2.5 bg-[#C1272D] hover:bg-red-700 text-white font-bold text-xs rounded shadow flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Flag & Secondary Screening</span>
          </button>
        </div>
      </div>

      <OverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        onConfirm={(reason) => handleDecision('OVERRIDE_CLEAR', reason)}
        travelerName={ocrFields.name}
      />
    </div>
  );
}
