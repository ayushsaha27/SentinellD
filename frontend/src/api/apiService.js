// SentinelID Frontend API Client
// Wraps backend REST API endpoints with AES-256 E2EE Payload Encryption

import { encryptPayloadE2EE } from '../utils/cryptoE2EE';

const API_BASE_URL = 'http://localhost:8000/api';

export async function verifyDocumentAPI(payload) {
  try {
    const encryptedBody = await encryptPayloadE2EE(payload);

    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedData: encryptedBody, ...payload })
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in verifyDocumentAPI:', err);
    return null;
  }
}

export async function logDecisionAPI(decisionPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisionPayload)
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in logDecisionAPI:', err);
    return null;
  }
}

export async function fetchAuditAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in fetchAuditAPI:', err);
    return null;
  }
}

export async function fetchReviewQueueAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/review-queue`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in fetchReviewQueueAPI:', err);
    return null;
  }
}

export async function fetchOfficersAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/officers`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in fetchOfficersAPI:', err);
    return null;
  }
}

export async function registerOfficerAPI(officerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/officers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officerData)
    });

    if (!response.ok) return { success: false };
    return await response.json();
  } catch (err) {
    console.warn('API Error in registerOfficerAPI:', err);
    return { success: false };
  }
}

export async function fetchBiometricsAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/biometrics`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API Error in fetchBiometricsAPI:', err);
    return null;
  }
}

export async function registerBiometricAPI(biometricData) {
  try {
    const response = await fetch(`${API_BASE_URL}/biometrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(biometricData)
    });

    if (!response.ok) return { success: false };
    return await response.json();
  } catch (err) {
    console.warn('API Error in registerBiometricAPI:', err);
    return { success: false };
  }
}
