# 🛡️ SentinelID — AI-Based Fake Identity & Document Screening System

> **Smart India Hackathon 2026 (SIH 2026)**  
> **Problem Statement ID**: 26188 (SIH26188)  
> **Organization**: Ministry of Home Affairs (MHA) | Sashastra Seema Bal (SSB), Police II Division  
> **Category**: Software | **Theme**: Blockchain & Cybersecurity  

---

## 📌 Executive Summary

**SentinelID** is a lightweight, full-stack AI document forensic and 1:1 facial biometric screening system designed specifically for low-specification border checkpoint terminals (2GB–4GB RAM) operated by Indian defence forces (SSB/MHA). It automates real-time verification of passports, visas, and national IDs to detect forged travel documents, multi-identity collisions, and biometric impersonation at border posts.

---

## ✨ Key Features & Architecture

### 1. 🔍 Module 1: OCR & MRZ Field Extraction Engine
- Parses Machine Readable Zone (MRZ) lines according to **ICAO Doc 9303 / TD1 / TD3** standards.
- Extracts Full Name, Passport Number, Nationality, Date of Birth, Expiry Date, and Gender with high accuracy.

### 2. 🛡️ Module 2: Document Standard & Watchlist Validation
- Computes **ICAO 7-3-1 check digit weight algorithms** to catch altered dates or falsified passport numbers.
- Checks document expiration and flags matches against SSB / Interpol security watchlists.

### 3. 🔬 Module 3: AI Tampering & Digital Forgery Forensics
- Executes **Error Level Analysis (ELA)** compression noise residual analysis to detect photo replacements, text splicing, and stamp alterations.
- Generates interactive **Visual Forgery Heatmap Overlays** highlighting modified regions.

### 4. 🧬 Module 4: 1:1 Facial Biometric Verification & Impersonation Prevention
- Computes 128-dimensional facial embedding feature vectors between passport photos and live kiosk camera feeds.
- Instantly detects facial mismatch and blocks unauthorized impersonation attempts (<45% match threshold = High Risk Flag).

### 5. 📜 Immutable SHA-256 Blockchain Audit Trail & Dossier Generator
- Generates an immutable cryptographic chain of custody hash for every screening action.
- Exports court-admissible **Printable MHA/SSB Legal Forensic Dossier PDFs** and CSV audit logs.

### 6. 🔒 End-to-End Encryption & Low-Spec PC Optimization
- **Data Security**: WebCrypto **AES-256-GCM** encryption for data-in-transit and data-at-rest.
- **Low-Spec Performance**: Native execution memory footprint under 45MB RAM, optimized for legacy border PCs.
- **Multilingual Support (i18n)**: English, Hindi (हिंदी), Nepali (नेपाली), Bengali (বাংলা).

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + Lucide Icons + Recharts
- **Backend**: Node.js + Express.js REST API (`http://localhost:8000`)
- **Database**: Persistent JSON Database (`backend/db/sentinel_database.json`)
- **Security**: AES-256-GCM WebCrypto Encryption
- **Datasets**: Ground truth integration with **MIDV-500/2020**, **CASIA 2.0**, and **LFW (Labeled Faces in the Wild)** datasets.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Launch (Single Command)

```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/sentinel-id.git
cd sentinel-id

# Install dependencies for root, backend, and frontend
npm run setup

# Launch both Backend API (Port 8000) and Frontend App (Port 5173) simultaneously
npm start
```

Open your browser at `http://localhost:5173/` to launch SentinelID.

---

## 🔐 Default Login Credentials (Demo Officer)

| Role | Badge ID | Password | Border Checkpoint Assignment |
| :--- | :--- | :--- | :--- |
| **Inspector** | `SSB-4421` | `password123` | Post 04 - Raxaul Checkpoint (Nepal Border) |
| **Sub-Inspector** | `SSB-1089` | `password123` | Post 01 - Petrapole Checkpoint (Bangladesh Border) |
| **Chief Supervisor** | `SSB-9900` | `super123` | Central Command |

*(New officer accounts can also be registered directly using the "Add Account" option on the login screen).*

---

## 📜 License
Developed for Smart India Hackathon 2026 (SIH 2026) under Ministry of Home Affairs (MHA) & Sashastra Seema Bal (SSB) guidelines.
