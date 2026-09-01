import React, { useState, useRef } from 'react';
import { Camera, Upload, Shield, Lock, Globe, UserX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_SAMPLES } from '../api/mockApi';
import { COUNTRY_RULES } from '../utils/countryRules';
import { DEFAULT_DOCUMENT_PLACEHOLDER, DEFAULT_FACE_PLACEHOLDER } from '../utils/defaultPlaceholders';

export default function Capture() {
  const { setActivePage, runVerificationPipeline, showToast } = useApp();

  const [inputMode, setInputMode] = useState('upload');
  const [selectedCountry, setSelectedCountry] = useState('IND');
  const [docType, setDocType] = useState('Passport');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  
  // User Input Fields
  const [travelerName, setTravelerName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docImagePreview, setDocImagePreview] = useState(DEFAULT_DOCUMENT_PLACEHOLDER);
  const [selfieImagePreview, setSelfieImagePreview] = useState(DEFAULT_FACE_PLACEHOLDER);
  const [isImpersonatingTest, setIsImpersonatingTest] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      setInputMode('camera');
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast('Camera access unavailable. Using file upload.', 'warning');
      setInputMode('upload');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocImagePreview(reader.result);
        showToast('Document uploaded successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieImagePreview(reader.result);
        showToast('Passenger face selfie photo uploaded.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAndScreen = async () => {
    stopCamera();

    const payload = {
      documentImage: docImagePreview,
      documentType: docType,
      selfieImage: selfieImagePreview,
      travelerNameHint: travelerName || 'ABHISHEK CHATTERJEE',
      docNumberHint: docNumber || 'Z9482104',
      selectedPresetId,
      isImpersonatingTest
    };

    const res = await runVerificationPipeline(payload);
    if (res?.success) {
      setActivePage('processing');
    }
  };

  const currentRules = COUNTRY_RULES[selectedCountry] || COUNTRY_RULES['IND'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-[#0B2545] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Document & Identity Screening Kiosk</h2>
          <p className="text-xs text-gray-300 font-mono">Scan passenger travel document and verify face biometric match.</p>
        </div>
        <span className="bg-[#13315C] text-[#FFC300] px-3 py-1 rounded text-xs font-mono font-bold uppercase flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#FFC300]" />
          <span>AES-256 E2EE Protected</span>
        </span>
      </div>

      {/* Country Selection */}
      <div className="bg-white border border-[#C7D6E8] rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#0B2545]" />
            Select Issuing Jurisdiction
          </label>
          <span className="text-xs font-mono text-[#0B2545] bg-gray-100 px-2 py-0.5 rounded font-bold">
            Standard: {currentRules.standard}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(COUNTRY_RULES).map(([code, config]) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedCountry(code)}
              className={`p-2.5 rounded border text-xs font-bold text-left transition-all cursor-pointer ${
                selectedCountry === code
                  ? 'bg-[#0B2545] text-[#FFC300] border-[#0B2545] shadow'
                  : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="text-base mb-0.5">{config.flag} {code}</div>
              <div className="text-[11px] truncate opacity-90">{config.countryName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Traveler Name & Document Input */}
      <div className="bg-white border border-[#C7D6E8] rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Traveler Full Name (Visual Inspection)</label>
          <input
            type="text"
            value={travelerName}
            onChange={(e) => setTravelerName(e.target.value)}
            placeholder="e.g. ABHISHEK CHATTERJEE / AYUSH SAHA"
            className="w-full px-3 py-2 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Document Number</label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            placeholder="e.g. Z9482104 / 282556573"
            className="w-full px-3 py-2 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
          />
        </div>
      </div>

      {/* Input Mode & Images */}
      <div className="bg-white border border-[#C7D6E8] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setInputMode('upload'); stopCamera(); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded cursor-pointer ${
                inputMode === 'upload' ? 'bg-[#0B2545] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Document & Selfie Upload</span>
            </button>
            <button
              type="button"
              onClick={startCamera}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded cursor-pointer ${
                inputMode === 'camera' ? 'bg-[#0B2545] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Kiosk Camera</span>
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#0B2545] cursor-pointer bg-amber-50 px-3 py-1.5 rounded border border-amber-200">
            <input
              type="checkbox"
              checked={isImpersonatingTest}
              onChange={(e) => setIsImpersonatingTest(e.target.checked)}
              className="w-4 h-4 text-[#C1272D] rounded"
            />
            <UserX className="w-4 h-4 text-[#C1272D]" />
            <span>Simulate Impersonation Test (Different Person's Face)</span>
          </label>
        </div>

        {/* Document & Face Upload Preview */}
        {inputMode === 'camera' ? (
          <div className="relative border-4 border-dashed border-[#0B2545] rounded-lg h-72 bg-black flex items-center justify-center overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-4 border-2 border-[#FFC300] rounded pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between text-[#FFC300] text-xs font-mono font-bold bg-black/60 px-2 py-0.5 rounded w-max">
                ALIGN DOCUMENT IN FRAME
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase text-gray-700">1. Document Image (Passport/ID)</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[180px]">
                <img
                  src={docImagePreview}
                  alt="Document preview"
                  className="max-h-44 object-contain rounded border shadow-sm"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0B2545] file:text-[#FFC300]"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase text-gray-700">2. Passenger Live Face Photo</span>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50 flex items-center justify-center min-h-[180px]">
                <img
                  src={selfieImagePreview}
                  alt="Passenger selfie"
                  className="w-36 h-36 object-cover rounded-full border-2 border-[#0B2545] shadow"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleSelfieUpload}
                className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0B2545] file:text-[#FFC300]"
              />
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleConfirmAndScreen}
            className="px-6 py-3 bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-extrabold text-sm rounded shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#FFC300]" />
            <span>Confirm & Run AI Screening</span>
          </button>
        </div>
      </div>
    </div>
  );
}
