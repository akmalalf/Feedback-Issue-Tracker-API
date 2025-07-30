const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
// const auth = require('../middlewares/auth'); ← jangan dulu

// Tanpa verifyToken
router.post('/', upload.single('screenshot'), (req, res) => {
  console.log('[DEBUG] req.body:', req.body);
  console.log('[DEBUG] req.file:', req.file);

  res.json({
    message: 'Upload test received',
    body: req.body,
    file: req.file
  });
});

module.exports = router;
