import React, { useState } from 'react';
import { Shield, Lock, User, MapPin, CheckCircle, Wifi, AlertCircle, UserPlus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { loginOfficer, registerOfficer, isOnline } = useApp();
  
  // Login Form state
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [checkpoint, setCheckpoint] = useState('Post 04 - Raxaul Checkpoint');
  const [errorMsg, setErrorMsg] = useState('');

  // Register Officer Modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newBadgeId, setNewBadgeId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('Inspector');
  const [newCheckpoint, setNewCheckpoint] = useState('Post 04 - Raxaul Checkpoint');
  const [regErrorMsg, setRegErrorMsg] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!badgeId || !password) {
      setErrorMsg('Please enter both Badge ID and Password.');
      return;
    }

    const success = loginOfficer(badgeId, password, checkpoint);
    if (!success) {
      setErrorMsg('Invalid Officer Badge ID or Password. Access Denied!');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegErrorMsg('');
    setRegSuccessMsg('');

    if (!newBadgeId || !newPassword || !newName) {
      setRegErrorMsg('Please fill in all required fields.');
      return;
    }

    const res = await registerOfficer({
      badgeId: newBadgeId,
      password: newPassword,
      name: newName,
      rank: newRank,
      checkpoint: newCheckpoint
    });

    if (res.success) {
      setRegSuccessMsg(`Account created for ${newName} (${newBadgeId}). You can now log in.`);
      setBadgeId(newBadgeId);
      setPassword(newPassword);
      setTimeout(() => {
        setIsRegisterOpen(false);
        setRegSuccessMsg('');
      }, 1800);
    } else {
      setRegErrorMsg(res.error || 'Failed to create officer account.');
    }
  };

  const fillQuickDemo = (bId, pwd) => {
    setBadgeId(bId);
    setPassword(pwd);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-center items-center p-4 relative">
      {/* Official Header Badge */}
      <div className="max-w-md w-full text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0B2545] border-4 border-[#FFC300] text-[#FFC300] mb-3 shadow-lg">
          <Shield className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B2545] font-serif tracking-tight">SentinelID</h1>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mt-1">
          Border Checkpoint Identity Screening System
        </p>
        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
          Ministry of Home Affairs — Sashastra Seema Bal (SSB)
        </p>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-white border border-[#C7D6E8] rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#0B2545] text-white px-6 py-4 border-b border-[#13315C] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm font-serif">
            <Lock className="w-4 h-4 text-[#FFC300]" />
            <span>Officer Authentication</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
            isOnline ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'
          }`}>
            <Wifi className="w-3 h-3" />
            {isOnline ? 'Edge Online' : 'Offline Kiosk'}
          </span>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-[#13315C]">
          {errorMsg && (
            <div className="bg-red-50 border border-[#C1272D] text-[#C1272D] px-3 py-2 rounded text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Officer Badge ID / Credentials *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="Enter Badge ID (e.g. SSB-4421)"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Password / Security Passcode *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Assigned Checkpoint / Border Post
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={checkpoint}
                onChange={(e) => setCheckpoint(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
              >
                <option value="Post 04 - Raxaul Checkpoint">Post 04 - Raxaul Checkpoint (Nepal Border)</option>
                <option value="Post 01 - Petrapole Checkpoint">Post 01 - Petrapole Checkpoint (Bangladesh Border)</option>
                <option value="Post 02 - Banbasa Checkpoint">Post 02 - Banbasa Checkpoint (Uttarakhand)</option>
                <option value="Post 05 - Moreh Checkpoint">Post 05 - Moreh Checkpoint (Myanmar Border)</option>
              </select>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#0B2545] text-[#FFC300] font-bold text-sm rounded shadow hover:bg-[#13315C] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Authenticate Officer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="px-3 py-2.5 border border-[#0B2545] text-[#0B2545] hover:bg-gray-100 font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer"
              title="Add new authorized officer account"
            >
              <UserPlus className="w-4 h-4 text-[#0B2545]" />
              <span>Add Account</span>
            </button>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] space-y-1.5 pt-2">
            <p className="font-bold text-[#0B2545] uppercase tracking-wider">
              🔐 Authorized Demo Accounts (Click to Fill):
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono">
              <button
                type="button"
                onClick={() => fillQuickDemo('SSB-4421', 'password123')}
                className="bg-white border border-gray-300 hover:border-[#0B2545] px-2 py-1 rounded text-gray-800 font-semibold"
              >
                Insp. V. Sharma (SSB-4421 / password123)
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('SSB-1089', 'password123')}
                className="bg-white border border-gray-300 hover:border-[#0B2545] px-2 py-1 rounded text-gray-800 font-semibold"
              >
                Sub-Insp. A. Singh (SSB-1089 / password123)
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* REGISTER NEW AUTHORIZED OFFICER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border-2 border-[#0B2545] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#0B2545] font-serif">
                <UserPlus className="w-5 h-5 text-[#FFC300]" />
                <span>Register New Authorized Officer</span>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {regErrorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded text-xs font-bold">
                {regErrorMsg}
              </div>
            )}

            {regSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-2 rounded text-xs font-bold">
                {regSuccessMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Full Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Insp. Rajesh Varma"
                  className="w-full px-3 py-2 border border-gray-300 rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Officer Badge ID / Credentials *</label>
                <input
                  type="text"
                  value={newBadgeId}
                  onChange={(e) => setNewBadgeId(e.target.value)}
                  placeholder="e.g. SSB-5520"
                  className="w-full px-3 py-2 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Security Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create Security Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Rank / Designation</label>
                <select
                  value={newRank}
                  onChange={(e) => setNewRank(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                >
                  <option value="Inspector">Inspector (Insp.)</option>
                  <option value="Sub-Inspector">Sub-Inspector (Sub-Insp.)</option>
                  <option value="Assistant Commandant">Assistant Commandant</option>
                  <option value="Border Supervisor">Border Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Border Checkpoint</label>
                <select
                  value={newCheckpoint}
                  onChange={(e) => setNewCheckpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
                >
                  <option value="Post 04 - Raxaul Checkpoint">Post 04 - Raxaul Checkpoint (Nepal Border)</option>
                  <option value="Post 01 - Petrapole Checkpoint">Post 01 - Petrapole Checkpoint (Bangladesh Border)</option>
                  <option value="Post 02 - Banbasa Checkpoint">Post 02 - Banbasa Checkpoint (Uttarakhand)</option>
                  <option value="Post 05 - Moreh Checkpoint">Post 05 - Moreh Checkpoint (Myanmar Border)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2545] text-[#FFC300] hover:bg-[#13315C] font-bold rounded shadow"
                >
                  Create & Allot Officer ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
