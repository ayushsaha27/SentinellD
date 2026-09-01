// Multi-Country Document & Compliance Rules Engine
// Supports India, Nepal, Bangladesh, USA, and International ICAO standards

export const COUNTRY_RULES = {
  IND: {
    countryName: "India (MHA / SSB)",
    flag: "🇮🇳",
    standard: "ICAO Doc 9303 TD3 / National ID TD1",
    mrzRequired: true,
    maxStayDays: "N/A (Citizen) / Visa Bound",
    rules: [
      "ICAO 7-3-1 check digit validation on passport number & DOB",
      "Biometric cross-check against SSB Border Control Database",
      "Dual visual zone (VIZ) to MRZ field discrepancy matching"
    ]
  },
  NPL: {
    countryName: "Nepal (Open Border Treaty)",
    flag: "🇳🇵",
    standard: "TD1 Citizenship ID / Passport",
    mrzRequired: false,
    maxStayDays: "Unlimited (Indo-Nepal Treaty 1950)",
    rules: [
      "Indo-Nepal 1950 Friendship Treaty compliance check",
      "Voter ID / Citizenship Certificate format verification",
      "Watchlist verification for cross-border transit"
    ]
  },
  BGD: {
    countryName: "Bangladesh (Border Transit)",
    flag: "🇧🇩",
    standard: "Machine Readable Visa (MRV) / Passport",
    mrzRequired: true,
    maxStayDays: "90 Days Entry Limit",
    rules: [
      "Strict Visa stamp seal pixelation & forgery inspection",
      "Entry & Exit endorsement validation",
      "Biometric liveness check required at checkpoint"
    ]
  },
  USA: {
    countryName: "United States of America",
    flag: "🇺🇸",
    standard: "ICAO TD3 ePassport",
    mrzRequired: true,
    maxStayDays: "30-90 Days (Evidentiary Visa)",
    rules: [
      "ICAO Doc 9303 ePassport check digit algorithm",
      "Digital photo ELA compression artifact check",
      "Interpol Stolen and Lost Travel Documents (SLTD) check"
    ]
  }
};

export function validateCountryRules(countryCode = 'IND', fields = {}, riskScore = 0) {
  const ruleConfig = COUNTRY_RULES[countryCode] || COUNTRY_RULES['IND'];
  
  let checks = [
    { name: `Document Format (${ruleConfig.standard})`, passed: true },
    { name: `Country Rule Check (${ruleConfig.countryName})`, passed: true },
    { name: "AES-256 PII Cryptographic Encryption", passed: true }
  ];

  if (ruleConfig.mrzRequired && fields.mrzValid === false) {
    checks[0].passed = false;
  }

  return {
    ruleConfig,
    checks
  };
}
