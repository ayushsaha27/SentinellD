// Cryptographic Blockchain Audit Ledger Engine
// SHA-256 Hash-chain generator for immutable legal digital chain of custody

const crypto = require('crypto');

let previousHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

function generateAuditHash(verificationRecord) {
  const payload = JSON.stringify({
    prev: previousHash,
    id: verificationRecord.verificationId,
    name: verificationRecord.travelerName,
    risk: verificationRecord.riskScore,
    time: verificationRecord.timestamp || new Date().toISOString()
  });

  const hash = '0x' + crypto.createHash('sha256').update(payload).digest('hex');
  previousHash = hash;
  return hash;
}

module.exports = {
  generateAuditHash
};
