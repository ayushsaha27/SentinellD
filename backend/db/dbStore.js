// SentinelID Persistent Database Store
// Loaded with Open-Source MIDV-500/2020, CASIA 2.0, and LFW Benchmark Datasets

const fs = require('fs');
const path = require('path');
const OPEN_SOURCE_DATASETS = require('../data/openSourceDatasets');

const DB_FILE = path.join(__dirname, 'sentinel_database.json');

const INITIAL_DATASET_DB = {
  officers: [
    { badgeId: 'SSB-4421', password: 'password123', name: 'Insp. V. Sharma', rank: 'Inspector', checkpoint: 'Post 04 - Raxaul Checkpoint' },
    { badgeId: 'SSB-1089', password: 'password123', name: 'Sub-Insp. A. Singh', rank: 'Sub-Inspector', checkpoint: 'Post 01 - Petrapole Checkpoint' },
    { badgeId: 'SSB-9900', password: 'super123', name: 'Chief Insp. R. K. Varma', rank: 'Chief Supervisor', checkpoint: 'Central Command' }
  ],
  openSourceDatasets: OPEN_SOURCE_DATASETS,
  travelerBiometrics: OPEN_SOURCE_DATASETS.faceBiometricsDataset.map(b => ({
    id: b.id,
    name: b.travelerName,
    docNumber: b.docNumber,
    countryCode: b.countryCode,
    nationality: b.countryCode,
    dob: '1991-03-15',
    gender: 'M',
    facePhotoUrl: b.facePhotoUrl,
    documentPhotoUrl: OPEN_SOURCE_DATASETS.passportOCRDataset[0].documentPhotoUrl,
    biometricHash: b.biometricHash,
    enrolledAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: b.status
  })),
  auditTrail: [],
  reviewQueue: []
};

function loadDatabase() {
  try {
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATASET_DB, null, 2), 'utf8');
      return INITIAL_DATASET_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Database load error:', err);
    return INITIAL_DATASET_DB;
  }
}

function saveDatabase(dbData) {
  try {
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Database save error:', err);
  }
}

module.exports = {
  loadDatabase,
  saveDatabase
};
