// Open-Source Open Dataset Fixtures for SentinelID
// Based on MIDV-500/2020 Passport MRZ, CASIA 2.0 Tampering, and LFW Face Biometrics Datasets

export const PRESET_SAMPLES = [
  {
    id: "sample-1",
    label: "MIDV-2020 Authentic Passport (India - ABHISHEK CHATTERJEE)",
    documentType: "Passport",
    countryCode: "IND",
    documentImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    selfieImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    verificationId: "VREF-IND-901",
    riskLevel: "low",
    riskScore: 12,
    submittedAt: "2026-09-01 23:35:00",
    checkpointId: "Post 04 - Raxaul Checkpoint",
    module1_ocr: {
      confidence: 98.4,
      fields: {
        name: "ABHISHEK CHATTERJEE",
        docNumber: "Z9482104",
        nationality: "IND",
        dob: "1991-03-15",
        expiryDate: "2031-10-25",
        gender: "M"
      }
    },
    module2_validation: {
      formatValid: true,
      mrzChecksumValid: true,
      expired: false,
      blacklisted: false
    },
    module3_tampering: {
      overallScore: 8,
      photoReplacement: 5,
      textManipulation: 10,
      stampForgery: 6,
      metadataAnomaly: 4,
      heatmapRegions: []
    },
    module4_faceMatch: {
      matchConfidence: 96.5,
      documentPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      livePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "sample-2",
    label: "CASIA 2.0 Forgery Spliced Document (HIGH RISK - Spliced Expiry)",
    documentType: "Passport",
    countryCode: "USA",
    documentImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    selfieImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    verificationId: "VREF-CASIA-882",
    riskLevel: "high",
    riskScore: 89,
    submittedAt: "2026-09-01 23:36:12",
    checkpointId: "Post 01 - Petrapole Checkpoint",
    module1_ocr: {
      confidence: 84.1,
      fields: {
        name: "JOHN DOE",
        docNumber: "PM908123",
        nationality: "USA",
        dob: "1985-04-12",
        expiryDate: "2024-01-01",
        gender: "M"
      }
    },
    module2_validation: {
      formatValid: true,
      mrzChecksumValid: false,
      expired: true,
      blacklisted: true
    },
    module3_tampering: {
      overallScore: 89,
      photoReplacement: 92,
      textManipulation: 84,
      stampForgery: 31,
      metadataAnomaly: 78,
      heatmapRegions: [
        { label: "Photo Replacement Artifacts (CASIA ELA 92%)", x: "12%", y: "24%", w: "32%", h: "44%" },
        { label: "Font Mismatch on Expiry Date", x: "55%", y: "62%", w: "38%", h: "12%" }
      ]
    },
    module4_faceMatch: {
      matchConfidence: 34.2,
      documentPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      livePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    }
  }
];

export const MOCK_REVIEW_QUEUE = [];
export const MOCK_AUDIT_TRAIL = [];
export const MOCK_IDENTITY_ALERTS = [];
export const MOCK_ANALYTICS = {
  screenedToday: 0,
  flaggedToday: 0,
  avgProcessingTimeSeconds: 2.4,
  pendingReview: 0,
  verificationsOverTime: [],
  riskDistribution: [
    { name: "Low Risk (Cleared)", value: 0, color: "#2E7D32" },
    { name: "Medium Risk (Review)", value: 0, color: "#FFC300" },
    { name: "High Risk (Flagged)", value: 0, color: "#C1272D" }
  ]
};
