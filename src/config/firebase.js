require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();

console.log('[Firebase] Storage bucket initialized:', process.env.FIREBASE_STORAGE_BUCKET);
bucket.exists().then(data => {
  console.log('[DEBUG] Bucket exists:', data[0]); // true jika berhasil
}).catch(err => {
  console.error('[DEBUG] Bucket existence error:', err);
});

module.exports = bucket;

