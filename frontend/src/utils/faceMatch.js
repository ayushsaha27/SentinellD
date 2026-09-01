// frontend/src/utils/faceMatch.js
//
// Real, actual facial biometric comparison — runs entirely in the browser.
// Loads face-api.js (a real face-detection/recognition library) from a CDN,
// detects a face in both the document photo and the live selfie, extracts a
// 128-dimensional face descriptor for each, and computes the Euclidean
// distance between them to produce a genuine similarity score.
//
// This replaces the old server-side logic that "matched" faces based on a
// checkbox and the traveler's name instead of the actual images.

const FACEAPI_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';

let modelsReadyPromise = null;

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (window.faceapi) return resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load face-api.js')));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load face-api.js'));
    document.head.appendChild(script);
  });
}

// Loads the face-api.js library + the three small ML models it needs
// (tiny face detector, landmark net, recognition net). Cached so this only
// happens once per kiosk session.
export function ensureFaceApiReady() {
  if (modelsReadyPromise) return modelsReadyPromise;

  modelsReadyPromise = (async () => {
    await loadScriptOnce(FACEAPI_SCRIPT_URL);
    const faceapi = window.faceapi;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    return faceapi;
  })();

  return modelsReadyPromise;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image for face comparison'));
    img.src = src;
  });
}

/**
 * Compares the face in the document photo against the face in the live selfie.
 *
 * @param {string} documentImageSrc - data URL or URL of the document/ID photo
 * @param {string} selfieImageSrc - data URL or URL of the live captured selfie
 * @returns {Promise<{success: boolean, matchConfidence: number, distance?: number, reason?: string}>}
 */
export async function computeFaceMatch(documentImageSrc, selfieImageSrc) {
  try {
    const faceapi = await ensureFaceApiReady();
    const [docImg, selfieImg] = await Promise.all([
      loadImageElement(documentImageSrc),
      loadImageElement(selfieImageSrc),
    ]);

    const detectorOptions = new faceapi.TinyFaceDetectorOptions();

    const [docResult, selfieResult] = await Promise.all([
      faceapi.detectSingleFace(docImg, detectorOptions).withFaceLandmarks().withFaceDescriptor(),
      faceapi.detectSingleFace(selfieImg, detectorOptions).withFaceLandmarks().withFaceDescriptor(),
    ]);

    if (!docResult) {
      return { success: false, matchConfidence: 0, reason: 'NO_FACE_IN_DOCUMENT_PHOTO' };
    }
    if (!selfieResult) {
      return { success: false, matchConfidence: 0, reason: 'NO_FACE_IN_SELFIE' };
    }

    const distance = faceapi.euclideanDistance(docResult.descriptor, selfieResult.descriptor);

    // face-api.js convention: distance ~0.0 = same person, ~0.6 = typical match
    // threshold, 1.0+ = clearly different people. We map that onto a 0-100 scale.
    const matchConfidence = Math.max(0, Math.min(100, (1 - distance / 1.2) * 100));

    return {
      success: true,
      matchConfidence: Number(matchConfidence.toFixed(1)),
      distance: Number(distance.toFixed(3)),
    };
  } catch (err) {
    return { success: false, matchConfidence: 0, reason: err.message || 'FACE_COMPARISON_ERROR' };
  }
}
