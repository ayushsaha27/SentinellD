import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  verifyDocumentAPI, 
  logDecisionAPI, 
  registerOfficerAPI, 
  registerBiometricAPI,
  fetchAuditAPI,
  fetchReviewQueueAPI,
  fetchBiometricsAPI,
  fetchOfficersAPI
} from '../api/apiService';
import { TRANSLATIONS } from '../utils/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [officersList, setOfficersList] = useState([]);
  const [language, setLanguage] = useState('en');

  const [officer, setOfficer] = useState({
    name: 'Insp. V. Sharma',
    badge: 'SSB-4421',
    checkpoint: 'Post 04 - Raxaul Checkpoint (Nepal Border)',
    role: 'Inspector',
    isLoggedIn: true
  });

  const [isOnline, setIsOnline] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  
  const [activeVerification, setActiveVerification] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [biometricsList, setBiometricsList] = useState([]);
  const [identityAlerts, setIdentityAlerts] = useState([]);
  const [notification, setNotification] = useState(null);

  // Synchronize with persistent backend database on startup
  const refreshFromBackend = async () => {
    try {
      const [auditData, queueData, bioData, officerData] = await Promise.all([
        fetchAuditAPI(),
        fetchReviewQueueAPI(),
        fetchBiometricsAPI(),
        fetchOfficersAPI()
      ]);

      if (auditData) setAuditTrail(auditData);
      if (queueData) setReviewQueue(queueData);
      if (bioData) setBiometricsList(bioData);
      if (officerData && officerData.length > 0) setOfficersList(officerData);

      // Generate Identity Alerts from High Risk Audit Entries
      if (auditData) {
        const highRiskAlerts = auditData
          .filter(item => item.riskLevel === 'high')
          .map(item => ({
            id: `ALT-${item.verificationId}`,
            title: `High Risk Identity Flagged: ${item.travelerName}`,
            checkpoint: item.checkpointId || 'Raxaul Checkpoint',
            severity: 'HIGH',
            timestamp: item.timestamp,
            details: `Flagged for secondary screening (${item.docType})`
          }));
        setIdentityAlerts(highRiskAlerts);
      }
    } catch (err) {
      console.warn('Backend sync failed, offline fallback active:', err);
    }
  };

  useEffect(() => {
    refreshFromBackend();
  }, []);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loginOfficer = (badgeId, password, checkpointId) => {
    const found = officersList.find(
      u => u.badgeId.toUpperCase() === badgeId.trim().toUpperCase() && u.password === password
    );

    if (!found) {
      showToast('Authentication Failed: Invalid Badge ID or Password. Access Denied!', 'error');
      return false;
    }

    setOfficer({
      name: found.name,
      badge: found.badgeId,
      checkpoint: checkpointId || found.checkpoint,
      role: found.rank || 'Inspector',
      isLoggedIn: true
    });

    setActivePage('dashboard');
    showToast(`Access Granted: Welcome ${found.name}. Kiosk Session Active.`, 'success');
    return true;
  };

  const updateOfficerStation = (name, badge, checkpoint) => {
    setOfficer(prev => ({
      ...prev,
      name: name || prev.name,
      badge: badge || prev.badge,
      checkpoint: checkpoint || prev.checkpoint
    }));
    showToast('Officer Station & Checkpoint updated.', 'success');
  };

  const registerOfficer = async (newOfficerData) => {
    const exists = officersList.some(o => o.badgeId.toUpperCase() === newOfficerData.badgeId.toUpperCase());
    if (exists) {
      return { success: false, error: 'Officer Badge ID already registered.' };
    }

    const created = {
      badgeId: newOfficerData.badgeId.toUpperCase(),
      password: newOfficerData.password,
      name: newOfficerData.name,
      rank: newOfficerData.rank || 'Inspector',
      checkpoint: newOfficerData.checkpoint || 'Post 04 - Raxaul Checkpoint'
    };

    setOfficersList(prev => [...prev, created]);
    await registerOfficerAPI(created);
    showToast(`New Officer Account registered: ${created.name} (${created.badgeId})`, 'success');
    return { success: true };
  };

  const logoutOfficer = () => {
    setOfficer({ name: '', badge: '', checkpoint: '', role: '', isLoggedIn: false });
    setActivePage('login');
    showToast('Officer session logged out securely.', 'info');
  };

  const runVerificationPipeline = async (payload) => {
    const result = await verifyDocumentAPI(payload);
    if (result) {
      setActiveVerification(result);
      // Immediately sync with backend database
      await refreshFromBackend();
      showToast(`AI Verification complete. Risk score: ${result.riskScore}%`, 'success');
      return { success: true, result };
    } else {
      showToast('Backend Verification Failed. Please check connection.', 'error');
      return { success: false, error: 'Verification failed' };
    }
  };

  const handleDecision = async (actionType, reason = '') => {
    if (!activeVerification) return;

    let newOutcome = '';

    if (actionType === 'CLEAR') {
      newOutcome = 'Cleared Traveler';
      showToast(`Traveler ${activeVerification.module1_ocr?.fields?.name || 'Traveler'} CLEARED for entry.`, 'success');
    } else if (actionType === 'REVIEW') {
      newOutcome = 'Sent to Review Queue';
      showToast(`Case ${activeVerification.verificationId} sent to Review Queue.`, 'warning');
    } else if (actionType === 'FLAG') {
      newOutcome = 'Flagged for Secondary Screening';
      showToast(`ALERT: Traveler ${activeVerification.module1_ocr?.fields?.name || 'Traveler'} FLAGGED!`, 'error');
    } else if (actionType === 'OVERRIDE_CLEAR') {
      newOutcome = `Officer Override Clear (${reason || 'Supervisor Approved'})`;
      showToast(`Verification overridden and CLEARED by ${officer.name}.`, 'info');
    }

    const auditEntry = {
      verificationId: activeVerification.verificationId,
      travelerName: activeVerification.module1_ocr?.fields?.name || 'Traveler',
      docType: activeVerification.documentType,
      riskLevel: activeVerification.riskLevel,
      riskScore: activeVerification.riskScore,
      outcome: newOutcome,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officer: officer.name,
      checkpointId: officer.checkpoint,
      blockchainHash: activeVerification.blockchainHash || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''))
    };

    // Update existing audit row instead of duplicating
    setAuditTrail(prev => {
      const idx = prev.findIndex(item => item.verificationId === activeVerification.verificationId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = auditEntry;
        return updated;
      }
      return [auditEntry, ...prev];
    });

    await logDecisionAPI(auditEntry);
    await refreshFromBackend();
    setActivePage('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        officer,
        updateOfficerStation,
        loginOfficer,
        registerOfficer,
        logoutOfficer,
        isOnline,
        setIsOnline,
        language,
        setLanguage,
        t,
        activePage,
        setActivePage,
        activeVerification,
        setActiveVerification,
        runVerificationPipeline,
        reviewQueue,
        setReviewQueue,
        auditTrail,
        biometricsList,
        identityAlerts,
        notification,
        showToast,
        handleDecision,
        refreshFromBackend
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
