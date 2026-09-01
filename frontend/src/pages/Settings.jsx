import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Globe, Shield, Database, UserPlus, Search, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchBiometricsAPI, registerBiometricAPI } from '../api/apiService';
import BiometricEnrolmentModal from '../components/BiometricEnrolmentModal';

export default function Settings() {
  const { officer, updateOfficerStation, language, setLanguage, t, showToast } = useApp();

  // Active Officer Station Edit State
  const [officerName, setOfficerName] = useState(officer.name);
  const [officerBadge, setOfficerBadge] = useState(officer.badge);
  const [officerCheckpoint, setOfficerCheckpoint] = useState(officer.checkpoint);

  // Traveler Biometrics Database state
  const [biometricsList, setBiometricsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBioOpen, setIsAddBioOpen] = useState(false);

  useEffect(() => {
    async function loadBio() {
      const data = await fetchBiometricsAPI();
      if (data) {
        setBiometricsList(data);
      }
    }
    loadBio();
  }, []);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    updateOfficerStation(officerName, officerBadge, officerCheckpoint);
    showToast(t('savePref') + ' ' + t('activeOfficer'), 'success');
  };

  const filteredBio = biometricsList.filter(b => {
    const q = searchTerm.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.docNumber.toLowerCase().includes(q) || b.countryCode.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white p-5 rounded-lg border-b-4 border-[#FFC300] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FFC300]" />
            <h2 className="text-xl font-bold font-serif text-white">{t('settingsTab')}</h2>
          </div>
          <p className="text-xs text-gray-300">
            Manage station preferences, active officer profile, regional kiosk language, and registered traveler face biometrics.
          </p>
        </div>
      </div>

      {/* SECTION 1: Registered Traveler Biometrics Database (WITH FACE PICTURE THUMBNAILS) */}
      <div className="bg-white border border-[#C7D6E8] rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-[#0B2545] font-serif uppercase tracking-wider flex items-center gap-2">
              <Database className="w-5 h-5 text-[#FFC300]" />
              Registered Traveler Facial Biometric Database
            </h3>
            <p className="text-xs text-gray-500">
              Stores registered facial feature vectors, face photos, and document metadata for border 1:1 matching.
            </p>
          </div>

          <button
            onClick={() => setIsAddBioOpen(true)}
            className="px-4 py-2 bg-[#0B2545] text-[#FFC300] hover:bg-[#13315C] font-bold text-xs rounded shadow flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enrol Live Face Biometric</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search registered travelers by name, document #, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
          />
        </div>

        {/* Biometrics Table with Face Photo Thumbnails */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-semibold">
              <tr>
                <th className="p-3">Face Photo</th>
                <th className="p-3">Record ID</th>
                <th className="p-3">Traveler Name</th>
                <th className="p-3">Doc #</th>
                <th className="p-3">Country</th>
                <th className="p-3">DOB</th>
                <th className="p-3">AI 128-d Biometric Vector</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredBio.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500 font-mono">
                    No biometric records found. Click "Enrol Live Face Biometric" to register your photo & details into the database.
                  </td>
                </tr>
              ) : (
                filteredBio.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-2">
                      <img
                        src={b.facePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                        alt={b.name}
                        className="w-10 h-10 object-cover rounded-full border border-[#0B2545] shadow-sm"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-[#0B2545]">{b.id}</td>
                    <td className="p-3 font-bold text-[#0B2545]">{b.name}</td>
                    <td className="p-3 font-mono">{b.docNumber}</td>
                    <td className="p-3">
                      <span className="bg-gray-100 px-2 py-0.5 rounded font-bold font-mono">
                        {b.countryCode}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 font-mono">{b.dob}</td>
                    <td className="p-3 text-gray-500 font-mono text-[10px] truncate max-w-[140px]">{b.biometricHash}</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Active Officer Station & Language Preferences */}
      <form onSubmit={handleSavePreferences} className="bg-white border border-[#C7D6E8] rounded-xl p-6 shadow-sm space-y-6 text-[#13315C]">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[#0B2545] font-serif uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFC300]" />
            {t('activeOfficer')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Officer Name</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge ID</label>
              <input
                type="text"
                value={officerBadge}
                onChange={(e) => setOfficerBadge(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Checkpoint</label>
              <select
                value={officerCheckpoint}
                onChange={(e) => setOfficerCheckpoint(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              >
                <option value="Post 04 - Raxaul Checkpoint">Post 04 - Raxaul Checkpoint (Nepal Border)</option>
                <option value="Post 01 - Petrapole Checkpoint">Post 01 - Petrapole Checkpoint (Bangladesh Border)</option>
                <option value="Post 02 - Banbasa Checkpoint">Post 02 - Banbasa Checkpoint (Uttarakhand)</option>
                <option value="Post 05 - Moreh Checkpoint">Post 05 - Moreh Checkpoint (Myanmar Border)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[#0B2545] font-serif uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FFC300]" />
            {t('regionalLang')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { code: 'en', label: 'English (Default)' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'ne', label: 'नेपाली (Nepali)' },
              { code: 'bn', label: 'বাংলা (Bengali)' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded border font-semibold text-center transition-all cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#0B2545] text-[#FFC300] border-[#0B2545] shadow font-bold'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0B2545] hover:bg-[#13315C] text-[#FFC300] font-bold text-xs rounded shadow flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('savePref')}</span>
          </button>
        </div>
      </form>

      {/* Enrolment Modal */}
      <BiometricEnrolmentModal
        isOpen={isAddBioOpen}
        onClose={() => setIsAddBioOpen(false)}
        onEnrolled={(profile) => {
          setBiometricsList(prev => [profile, ...prev]);
        }}
      />
    </div>
  );
}
