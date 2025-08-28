const fs = require('fs');
const admin = require('firebase-admin');

function ensureFirebase() {
  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucket) {
    const e = new Error('FIREBASE_STORAGE_BUCKET belum diset'); e.expose = true; e.status = 500;
    throw e;
  }
  if (admin.apps.length) return;

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  let init = { storageBucket: bucket };

  if (credPath) {
    if (!fs.existsSync(credPath)) {
      const e = new Error(`File credential tidak ditemukan: ${credPath}`); e.expose = true; e.status = 500;
      throw e;
    }
    init.credential = admin.credential.cert(require(credPath));
  } else {
    // fallback: ADC, kalau OS/env sudah di-setup
    init.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(init);
  console.log('[Firebase] Storage bucket:', bucket);
}

async function uploadToFirebase(reqFile) {
  ensureFirebase();
  const bucket = admin.storage().bucket();

  const safeName = (reqFile.originalname || 'file').replace(/[^\w.\-]+/g, '_');
  const filename = `screenshots/${Date.now()}-${Math.round(Math.random()*1e9)}-${safeName}`;
  const file = bucket.file(filename);

  await file.save(reqFile.buffer, {
    metadata: { contentType: reqFile.mimetype, cacheControl: 'public,max-age=31536000' },
    resumable: false
  });

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 365*24*60*60*1000
  });

  return url;
}

module.exports = { uploadToFirebase };
