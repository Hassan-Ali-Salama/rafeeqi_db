// generate_secret.js
const crypto = require('crypto');

// توليد مفتاح سري عشوائي بطول 64 بايت وتشفيره بـ Base64
const secret = crypto.randomBytes(64).toString('base64');

console.log('------------------------------------------------');
console.log('✅ SHADOWHACKER-GOD Generated JWT_SECRET:');
console.log(secret);
console.log('------------------------------------------------');

// يمكنك الآن نسخ هذا المفتاح ولصقه في ملف .env