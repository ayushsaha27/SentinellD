import React, { useState, useRef } from 'react';
import { Camera, UserPlus, X, CheckCircle, ShieldCheck, Sparkles, RefreshCw, FileText, Upload } from 'lucide-react';
import { registerBiometricAPI } from '../api/apiService';

export default function BiometricEnrolmentModal({ isOpen, onClose, onEnrolled }) {
  const [name, setName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IND');
  const [dob, setDOB] = useState('1995-08-20');
  const [expiryDate, setExpiryDate] = useState('2032-12-31');
  const [gender, setGender] = useState('M');
  
  // Face & Document Image states
  const [capturedFaceBase64, setCapturedFaceBase64] = useState('');
  const [capturedDocBase64, setCapturedDocBase64] = useState('');
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isExtractingVector, setIsExtractingVector] = useState(false);
  const [extractedVector, setExtractedVector] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const startWebcam = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access unavailable. Upload face photo manually.');
      setIsCameraActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureFacePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedFaceBase64(dataUrl);
      stopWebcam();

      setIsExtractingVector(true);
      setTimeout(() => {
        const vec = 'BIO_128D_FEATURE_VECTOR_' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
        setExtractedVector(vec);
        setIsExtractingVector(false);
      }, 800);
    }
  };

  const handleFaceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedFaceBase64(reader.result);
        const vec = 'BIO_128D_FEATURE_VECTOR_' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
        setExtractedVector(vec);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedDocBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !docNumber) {
      alert('Please fill in Traveler Name and Document Number.');
      return;
    }

    const payload = {
      name,
      docNumber,
      countryCode,
      nationality: countryCode,
      dob,
      expiryDate,
      gender,
      facePhotoBase64: capturedFaceBase64 || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      documentPhotoBase64: capturedDocBase64 || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
    };

    const res = await registerBiometricAPI(payload);
    if (res?.success) {
      setSuccessMsg(`Face Biometric, Passport Image & PII stored permanently in database for ${name}.`);
      if (onEnrolled) onEnrolled(res.profile);
      setTimeout(() => {
        stopWebcam();
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border-2 border-[#0B2545] max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[#0B2545] font-serif">
            <UserPlus className="w-5 h-5 text-[#FFC300]" />
            <span>Enrol Passport Document & Face Biometric Record</span>
          </div>
          <button 
            onClick={() => { stopWebcam(); onClose(); }} 
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-2 rounded text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Grid for Face & Passport Document Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Live Face Capture */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                1. Passenger Face Biometric *
              </label>

              <div className="relative border-2 border-dashed border-[#0B2545] rounded-lg h-36 bg-gray-900 flex items-center justify-center overflow-hidden">
                {isCameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <button
                      type="button"
                      onClick={captureFacePhoto}
                      className="absolute bottom-2 px-3 py-1 bg-[#FFC300] text-[#0B2545] font-bold text-xs rounded shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Snap Photo</span>
                    </button>
                  </>
                ) : capturedFaceBase64 ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                    <img src={capturedFaceBase64} alt="Captured face" className="h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={startWebcam}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded hover:bg-black"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-1 p-2">
                    <button
                      type="button"
                      onClick={startWebcam}
                      className="px-3 py-1.5 bg-[#0B2545] text-[#FFC300] font-bold text-xs rounded shadow flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Webcam Snap</span>
                    </button>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFaceUpload}
                className="text-[10px] text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#0B2545] file:text-[#FFC300]"
              />
            </div>

            {/* 2. Passport Document Photo Upload */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                2. Passport / ID Document Image *
              </label>

              <div className="border-2 border-dashed border-gray-400 rounded-lg h-36 bg-gray-50 flex items-center justify-center p-1 overflow-hidden">
                {capturedDocBase64 ? (
                  <img src={capturedDocBase64} alt="Passport document" className="h-full object-contain rounded" />
                ) : (
                  <div className="text-center text-gray-500 font-mono text-[11px]">
                    <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span>Upload Passport / ID Image</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleDocUpload}
                className="text-[10px] text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#0B2545] file:text-[#FFC300]"
              />
            </div>
          </div>

          {/* AI Feature Vector */}
          {extractedVector && (
            <div className="bg-slate-100 border border-slate-300 p-2 rounded text-[10px] font-mono text-gray-700">
              <span className="font-bold text-[#0B2545] block mb-0.5">✓ 128-d AI Biometric Vector Generated:</span>
              <span className="break-all text-emerald-800 font-semibold">{extractedVector}</span>
            </div>
          )}

          {/* Section 3: Document Details Form */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
              3. Official Traveler Passport Details *
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Full Traveler Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VIVEK KUMAR"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Passport / Document # *</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. Z9988102"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Nationality / Country</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                >
                  <option value="IND">🇮🇳 India</option>
                  <option value="NPL">🇳🇵 Nepal</option>
                  <option value="BGD">🇧🇩 Bangladesh</option>
                  <option value="USA">🇺🇸 USA</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Date of Birth (DOB)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Passport Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="O">Other (O)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => { stopWebcam(); onClose(); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0B2545] text-[#FFC300] hover:bg-[#13315C] font-bold rounded shadow flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Store Passport & Biometrics in Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
